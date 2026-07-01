import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { searchArxiv, SortCriterion, AIFilterResult } from './services/arxiv.service';
import { isAIEnabled } from './services/ai.service';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Check AI configuration on startup
if (isAIEnabled()) {
  console.log('AI filtering is ENABLED');
} else {
  console.log('AI filtering is DISABLED - papers will not be filtered by AI');
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.render('landing', {
    query: '',
    maxResults: 20,
    sortBy: SortCriterion.SubmittedDate,
    viewMode: 'Cards',
    error: null,
    aiEnabled: isAIEnabled()
  });
});

app.get('/search', async (req, res) => {
  const query = req.query.query as string;
  const maxResults = parseInt(req.query.max_results as string) || 20;
  const sortBy = (req.query.sort_by as string) as SortCriterion || SortCriterion.SubmittedDate;
  const viewMode = (req.query.view_as as string) || 'Cards';
  const useAIFilter = req.query.ai_filter !== 'false' && req.query.ai_filter !== '0';
 
  if (!query || query.trim() === '') {
    return res.render('landing', {
      query: '',
      maxResults,
      sortBy,
      viewMode,
      error: 'Please enter a search query',
      aiEnabled: isAIEnabled()
    });
  }
  
  try {
    const result: AIFilterResult = await searchArxiv(query, maxResults, sortBy, useAIFilter);
    
    res.render('index', { 
      papers: result.papers, 
      query: result.query,
      maxResults, 
      sortBy, 
      viewMode,
      error: null,
      aiEnabled: result.aiEnabled,
      aiStats: {
        approvedCount: result.approvedCount,
        rejectedCount: result.rejectedCount,
        totalFiltered: result.rejectedCount > 0 ? result.approvedCount + result.rejectedCount : 0
      },
      aiResults: result.aiResults
    });
  } catch (error) {
    res.render('index', { 
      papers: [], 
      query, 
      maxResults, 
      sortBy, 
      viewMode,
      error: 'Error searching arXiv. Please try again.',
      aiEnabled: isAIEnabled(),
      aiStats: null
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
