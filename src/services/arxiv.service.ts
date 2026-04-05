import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

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

export const searchArxiv = async (query: string, maxResults: number, sortBy: SortCriterion): Promise<Paper[]> => {
  const url = `http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&max_results=${maxResults}&sortBy=${sortBy}&sortOrder=descending`;
  
  try {
    const response = await axios.get(url);
    const xmlData = response.data as string;
    const jsonObj = parser.parse(xmlData);
    
    if (!jsonObj.feed || !jsonObj.feed.entry) {
      return [];
    }
    
    let entries = jsonObj.feed.entry;
    if (!Array.isArray(entries)) {
      entries = [entries];
    }
    
    return entries.map((entry: any) => {
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
  } catch (error) {
    console.error('Error searching arXiv:', error);
    throw error;
  }
};
