const { Essay, Feedback } = require('../models');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

// Initialize Gemini 2.5 Flash client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Helper to calculate Jaccard similarity between two texts
function calculateSimilarity(text1, text2) {
  const set1 = new Set(text1.split(/\s+/));
  const set2 = new Set(text2.split(/\s+/));
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  if (union.size === 0) return 1; // Both are empty
  return intersection.size / union.size;
}

// Generate AI feedback for an essay
const generateFeedback = async (req, res) => {
  try {
    const { essay_id } = req.params;
    const { user_id } = req.user; // From authMiddleware

    // Validate essay exists and belongs to user
    const essay = await Essay.findEssayById(essay_id);
    if (!essay || essay.user_id !== user_id) {
      return res.status(403).json({ error: 'Unauthorized or essay not found' });
    }

    // Check if feedback already exists for this essay
    const existingFeedback = await Feedback.findFeedbackByEssayId(essay_id);
    if (existingFeedback && existingFeedback.length > 0) {
      return res.status(409).json({ error: 'Feedback has already been generated for this essay.' });
    }

    // Check for identical or similar previous essays
    const allUserEssays = await Essay.findEssayByUser(user_id);
    const otherEssays = allUserEssays.filter(e => e.essay_id !== essay.essay_id);

    let highestSimilarity = 0;
    let mostSimilarEssay = null;

    for (const otherEssay of otherEssays) {
      const similarity = calculateSimilarity(essay.content, otherEssay.content);
      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        mostSimilarEssay = otherEssay;
      }
    }

    // If an identical essay is found, stop and inform the user
    if (highestSimilarity === 1) {
      return res.status(409).json({ message: "This essay rings a bell... I've seen this exact content from you before." });
    }

    // Read prompt from file
    const promptPath = path.join(__dirname, '../config/prompts/prompt.txt');
    let prompt;
    try {
      prompt = await fs.readFile(promptPath, 'utf8');
    } catch (err) {
      return res.status(500).json({ error: 'Failed to read prompt file' });
    }

    // Set similarity context for the prompt
    let similarityContext = '';
    if (mostSimilarEssay && highestSimilarity > 0.85) {
      similarityContext = `This essay is similar (${Math.round(highestSimilarity * 100)}% similarity) to a previous essay titled "${mostSimilarEssay.title}". Focus on how this essay differs or improves upon the previous one.\n\n`;
    }

    // Replace placeholders with essay content and similarity context
    const finalPrompt = prompt
      .replace('{{SIMILARITY_CONTEXT}}', similarityContext)
      .replace('{{ESSAY_CONTENT}}', essay.content)
      .replace('{{ESSAY_TONALITY}}', essay.tonality);

    // Call Gemini API
    const result = await model.generateContent(finalPrompt);
    const response = result.response.text();

    // Log raw response for debugging
    console.log('Gemini raw response:', response);

    // Parse response with fallback for non-JSON
    let feedbackData;
    try {
      feedbackData = JSON.parse(response);
    } catch (parseErr) {
      // Fallback: Strip markdown or extra text
      const cleanedResponse = response.replace(/```json\n|```/g, '').trim();
      try {
        feedbackData = JSON.parse(cleanedResponse);
      } catch (fallbackErr) {
        return res.status(500).json({ error: 'Failed to parse AI response', rawResponse: response });
      }
    }

    // Parse and validate data from AI response
    const originalityScore = Math.round(Number(feedbackData.originality_score));
    const typoScore = Math.round(Number(feedbackData.typo_score));

    if (
      !Array.isArray(feedbackData.feedback_text) ||
      isNaN(originalityScore) ||
      isNaN(typoScore) ||
      typoScore < 1 || typoScore > 10 ||
      originalityScore < 1 || originalityScore > 10 ||
      !feedbackData.analysis
    ) {
      return res.status(500).json({ error: 'Invalid AI response format', rawResponse: response });
    }

    // Store feedback in database
    await Feedback.createFeedback(
      essay_id,
      JSON.stringify(feedbackData.feedback_text), // Store structured text as a JSON string
      originalityScore,
      typoScore
    );

    // Send the full structured data from the AI to the client
    res.status(201).json(feedbackData);
  } catch (err) {
    console.error('Error generating feedback:', err);
    res.status(500).json({ error: `Failed to generate feedback: ${err.message}` });
  }
};

// Get feedback for a specific essay
const getEssayFeedback = async (req, res) => {
  try {
    const { essay_id } = req.params;
    const { user_id } = req.user;

    // Validate essay exists and belongs to user
    const essay = await Essay.findEssayById(essay_id);
    if (!essay || essay.user_id !== user_id) {
      return res.status(403).json({ error: 'Unauthorized or essay not found' });
    }

    const feedback = await Feedback.findFeedbackByEssayId(essay_id);
    res.json(feedback);
  } catch (err) {
    console.error('Error retrieving feedback:', err);
    res.status(500).json({ error: `Failed to retrieve feedback: ${err.message}` });
  }
};

// Get all feedback for a user's essays
const getUserFeedback = async (req, res) => {
  try {
    const { user_id } = req.user;
    const feedback = await Feedback.findFeedbackByUser(user_id);
    res.json(feedback);
  } catch (err) {
    console.error('Error retrieving user feedback:', err);
    res.status(500).json({ error: `Failed to retrieve user feedback: ${err.message}` });
  }
};

module.exports = {
  generateFeedback,
  getEssayFeedback,
  getUserFeedback,
};