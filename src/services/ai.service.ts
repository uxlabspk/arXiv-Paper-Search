import axios from 'axios';
import { Paper } from './arxiv.service';

interface AIConfig {
  apiKey: string;
  model: string;
  endpoint: string;
  enabled: boolean;
}

interface AIResponse {
  output: string;
  approved: boolean;
  reason?: string;
}

const getDefaultConfig = (): AIConfig => ({
  apiKey: process.env.MISTRAL_API_KEY || '',
  model: process.env.MISTRAL_MODEL || 'mistral-tiny-latest',
  endpoint: process.env.MISTRAL_ENDPOINT || 'https://api.mistral.ai/v1/chat/completions',
  enabled: process.env.AI_FILTER_ENABLED?.toLowerCase() === 'true' || false
});

/**
 * Checks if a paper should be approved by AI based on the user's query
 * The AI evaluates whether the paper is relevant to the search query
 */
export const checkPaperWithAI = async (
  paper: Paper,
  query: string,
  config: Partial<AIConfig> = {}
): Promise<AIResponse> => {
  const mergedConfig: AIConfig = { ...getDefaultConfig(), ...config };
  
  // If AI filtering is disabled, approve all papers
  if (!mergedConfig.enabled || !mergedConfig.apiKey) {
    return { 
      output: 'AI filtering disabled or no API key configured', 
      approved: true 
    };
  }

  try {
    // Create a prompt that asks the AI to evaluate if the paper is relevant to the query
    const prompt = `
You are an academic paper relevance filter. Your task is to determine if a given arXiv paper 
is relevant to a user's search query.

User's search query: "${query}"

Paper details:
- Title: ${paper.title}
- Authors: ${paper.authors}
- Abstract: ${paper.abstract}
- Published Date: ${paper.date}

Please analyze the paper and determine if it is relevant to the user's search query.
Respond with ONLY a JSON object in the following format:
{
  "approved": true/false,
  "reason": "brief explanation of your decision"
}

Be strict but fair. Only approve papers that are genuinely relevant to the search query.
Consider the title, abstract, and the specific terms in the user's query.
`;

    const response = await axios.post(
      mergedConfig.endpoint,
      {
        model: mergedConfig.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent, logical responses
        max_tokens: 500,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mergedConfig.apiKey}`
        },
        timeout: 30000 // 30 second timeout
      }
    );

    // Parse the JSON response from the AI
    const aiMessage = response.data.choices?.[0]?.message?.content;
    
    if (!aiMessage) {
      throw new Error('No response from AI');
    }

    // Try to parse the JSON response
    try {
      const parsed = JSON.parse(aiMessage);
      return {
        output: parsed.reason || 'AI approved the paper',
        approved: parsed.approved || false,
        reason: parsed.reason
      };
    } catch (parseError) {
      // If we can't parse as JSON, try to extract the answer from the text
      const lowerContent = aiMessage.toLowerCase();
      const hasYes = lowerContent.includes('yes') || lowerContent.includes('true') || lowerContent.includes('approved');
      const hasNo = lowerContent.includes('no') || lowerContent.includes('false') || lowerContent.includes('rejected');
      
      return {
        output: aiMessage,
        approved: hasYes && !hasNo,
        reason: 'Parsed from text response'
      };
    }
  } catch (error) {
    console.error('AI evaluation error:', error);
    
    // If there's an error with the AI service, we should probably let the paper through
    // to avoid blocking all results. But we can log it.
    const errorMessage = error instanceof Error ? error.message : 'Unknown AI error';
    
    return {
      output: `AI evaluation failed: ${errorMessage}`,
      approved: true, // Fail-open: allow paper through if AI fails
      reason: 'AI service error - failing open'
    };
  }
};

/**
 * Filter an array of papers through AI evaluation
 * This processes papers in parallel for better performance
 */
export const filterPapersWithAI = async (
  papers: Paper[],
  query: string,
  config: Partial<AIConfig> = {}
): Promise<{ approved: Paper[]; rejected: Paper[]; results: AIResponse[] }> => {
  const mergedConfig: AIConfig = { ...getDefaultConfig(), ...config };
  
  // If AI filtering is disabled, return all papers as approved
  if (!mergedConfig.enabled || !mergedConfig.apiKey) {
    return {
      approved: [...papers],
      rejected: [],
      results: papers.map(() => ({ 
        output: 'AI filtering disabled', 
        approved: true 
      }))
    };
  }

  // Process papers in parallel for better performance
  const results = await Promise.all(
    papers.map(paper => checkPaperWithAI(paper, query, config))
  );

  const approved: Paper[] = [];
  const rejected: Paper[] = [];

  results.forEach((result, index) => {
    if (result.approved) {
      approved.push(papers[index]);
    } else {
      rejected.push(papers[index]);
    }
  });

  return { approved, rejected, results };
};

/**
 * Get AI service configuration
 */
export const getAIConfig = (): AIConfig => {
  return getDefaultConfig();
};

/**
 * Check if AI filtering is enabled
 */
export const isAIEnabled = (): boolean => {
  const config = getDefaultConfig();
  return config.enabled && !!config.apiKey;
};

export type { AIConfig, AIResponse };
