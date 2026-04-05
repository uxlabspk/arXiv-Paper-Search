import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { searchArxiv, SortCriterion } from './services/arxiv.service';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', async (req, res) => {
  const query = req.query.query as string || 'efficient LLM fine-tuning';
  const maxResults = parseInt(req.query.max_results as string) || 20;
  const sortBy = (req.query.sort_by as string) as SortCriterion || SortCriterion.SubmittedDate;
  const viewMode = (req.query.view_as as string) || 'Cards';
  
  try {
    const papers = await searchArxiv(query, maxResults, sortBy);
    res.render('index', { 
      papers, 
      query, 
      maxResults, 
      sortBy, 
      viewMode,
      error: null 
    });
  } catch (error) {
    res.render('index', { 
      papers: [], 
      query, 
      maxResults, 
      sortBy, 
      viewMode,
      error: 'Error searching arXiv. Please try again.' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
