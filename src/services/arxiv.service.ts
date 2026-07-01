import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { filterPapersWithAI, AIResponse } from './ai.service';

export interface Paper {
  title: string;
  authors: string;
  abstract: string;
  date: string;
  url: string;
  pdf_url: string;
}

export enum SortCriterion {
  SubmittedDate = 'submittedDate',
  Relevance = 'relevance',
  LastUpdated = 'lastUpdatedDate'
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_"
});

export interface AIFilterResult {
  papers: Paper[];
  aiResults: AIResponse[];
  approvedCount: number;
  rejectedCount: number;
  query: string;
  aiEnabled: boolean;
}

export const searchArxiv = async (
  query: string, 
  maxResults: number, 
  sortBy: SortCriterion,
  useAIFilter: boolean = true
): Promise<AIFilterResult> => {
  const url = `http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&max_results=${maxResults}&sortBy=${sortBy}&sortOrder=descending`;
  
  try {
    const response = await axios.get(url);
    const xmlData = response.data as string;
    const jsonObj = parser.parse(xmlData);
    
    if (!jsonObj.feed || !jsonObj.feed.entry) {
      return {
        papers: [],
        aiResults: [],
        approvedCount: 0,
        rejectedCount: 0,
        query,
        aiEnabled: false
      };
    }
    
    let entries = jsonObj.feed.entry;
    if (!Array.isArray(entries)) {
      entries = [entries];
    }
    
    const papers: Paper[] = entries.map((entry: any) => {
      let authors = '';
      if (entry.author) {
        if (Array.isArray(entry.author)) {
          authors = entry.author.map((a: any) => a.name).join(', ');
        } else {
          authors = entry.author.name;
        }
      }
      
      const links = Array.isArray(entry.link) ? entry.link : [entry.link];
      const pdfLink = links.find((l: any) => l['@_title'] === 'pdf' || l['@_type'] === 'application/pdf');
      
      return {
        title: entry.title.replace(/\n/g, ' ').trim(),
        authors: authors,
        abstract: entry.summary.replace(/\n/g, ' ').trim(),
        date: entry.published.substring(0, 10),
        url: entry.id,
        pdf_url: pdfLink ? pdfLink['@_href'] : entry.id.replace('abs', 'pdf')
      };
    });

    // Apply AI filtering if enabled and requested
    if (useAIFilter) {
      const aiResult = await filterPapersWithAI(papers, query);
      
      return {
        papers: aiResult.approved,
        aiResults: aiResult.results,
        approvedCount: aiResult.approved.length,
        rejectedCount: aiResult.rejected.length,
        query,
        aiEnabled: true
      };
    }

    // Return all papers without AI filtering
    return {
      papers: papers,
      aiResults: [],
      approvedCount: papers.length,
      rejectedCount: 0,
      query,
      aiEnabled: false
    };
  } catch (error) {
    console.error('Error searching arXiv:', error);
    throw error;
  }
};
