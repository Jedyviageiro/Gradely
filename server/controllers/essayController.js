const { Essay, Feedback } = require('../models');
const fs = require('fs').promises;
const pdf = require('pdf-parse');
const multer = require('multer');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const uploadEssay = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { title } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Validate file size (multer limit is 5MB, but confirm here)
    if (req.file.size === 0) {
      await fs.unlink(req.file.path).catch(unlinkErr =>
        console.error('Error cleaning up file:', unlinkErr)
      );
      return res.status(400).json({ error: 'Uploaded file is empty' });
    }

    let content;

    if (req.file.mimetype === 'application/pdf') {
      const dataBuffer = await fs.readFile(req.file.path);

      // Check if file is a valid PDF
      const header = dataBuffer.toString('utf8', 0, 5);
      if (header !== '%PDF-') {
        await fs.unlink(req.file.path).catch(unlinkErr =>
          console.error('Error cleaning up file:', unlinkErr)
        );
        return res.status(400).json({ error: 'Uploaded file is not a valid PDF' });
      }

      try {
        // Add a fallback mechanism. Try the newer parser first, and if it fails,
        // fall back to the default parser.
        const data = await pdf(dataBuffer, { version: 'v2.0.550' }).catch(async (err) => {
          console.error('PDF parsing with v2.0.550 failed, falling back to default:', err.message);
          // Fallback to the default parser if the newer one fails
          return pdf(dataBuffer);
        });

        content = data.text.trim();
        if (!content) {
          await fs.unlink(req.file.path).catch(unlinkErr =>
            console.error('Error cleaning up file:', unlinkErr)
          );
          return res.status(400).json({
            error: 'PDF contains no extractable text. This may be a scanned document.',
          });
        }
      } catch (pdfErr) {
        console.error('PDF parsing error:', pdfErr.message);
        await fs.unlink(req.file.path).catch(unlinkErr =>
          console.error('Error cleaning up file:', unlinkErr)
        );
        return res
          .status(400)
          .json({
            error:
              'Failed to parse PDF. Please ensure the PDF is valid and contains text (not scanned or image-based).',
            details: pdfErr.message,
          });
      }
    } else {
      content = await fs.readFile(req.file.path, 'utf8');
      if (!content.trim()) {
        await fs.unlink(req.file.path).catch(unlinkErr =>
          console.error('Error cleaning up file:', unlinkErr)
        );
        return res.status(400).json({ error: 'Text file contains no content' });
      }
    }

    // Sanitize content to remove null bytes
    const sanitizedContent = content.replace(/\0/g, '');

    const essay = await Essay.createEssay(user_id, title, sanitizedContent);

    // Clean up uploaded file
    await fs.unlink(req.file.path).catch(unlinkErr =>
      console.error('Error cleaning up file:', unlinkErr)
    );

    res.status(201).json(essay);
  } catch (err) {
    console.error('Error uploading essay:', err);

    if (req.file && req.file.path) {
      await fs.unlink(req.file.path).catch(unlinkErr =>
        console.error('Error cleaning up uploaded file:', unlinkErr)
      );
    }

    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Multer error: ${err.message}. Expected 'essay' field in form-data.` });
    }

    res.status(500).json({ error: `Server error during essay upload: ${err.message}` });
  }
};

const createEssayFromText = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { title, content } = req.body;

    if (!title || !content || !title.trim() || !content.trim()) {
      return res.status(400).json({ error: 'Title and content are required.' });
    }

    // Sanitize content to remove null bytes, just in case
    const sanitizedContent = content.replace(/\0/g, '');

    const essay = await Essay.createEssay(user_id, title.trim(), sanitizedContent);

    res.status(201).json(essay);
  } catch (err) {
    console.error('Error creating essay from text:', err);
    res.status(500).json({ error: `Server error during essay creation: ${err.message}` });
  }
};

// Helper function to handle API retries with exponential backoff
const withRetry = async (apiCall, maxRetries = 3, initialDelay = 500) => {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await apiCall();
    } catch (err) {
      attempt++;
      // Check if we should retry for rate limiting or service availability issues
      if ((err.status === 429 || err.status === 503) && attempt < maxRetries) {
        let delay = initialDelay * Math.pow(2, attempt - 1); // Default exponential backoff
        const reason = err.status === 429 ? 'Rate limit hit' : 'Service unavailable';

        // For rate limiting, the API might suggest a specific delay. Let's use it.
        if (err.status === 429) {
          const retryInfo = err.errorDetails?.find(d => d['@type'] === 'type.googleapis.com/google.rpc.RetryInfo');
          if (retryInfo?.retryDelay) {
            const seconds = parseInt(retryInfo.retryDelay.replace('s', ''), 10);
            if (!isNaN(seconds)) {
              // Use the suggested delay plus a small buffer
              delay = (seconds * 1000) + 500;
            }
          }
        }

        console.log(`AI service ${reason} (${err.status}). Retrying attempt ${attempt} in ${delay}ms...`);
        await new Promise(res => setTimeout(res, delay));
      } else {
        // For other errors or after all retries, throw the error
        throw err;
      }
    }
  }
};

const getSuggestions = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || typeof content !== 'string' || !content.trim()) {
      return res.json({ suggestions: [] });
    }

    // Use the new, lightweight prompt
    const promptPath = path.join(__dirname, '../config/prompts/suggestion_prompt.txt');
    let prompt;
    try {
      prompt = await fs.readFile(promptPath, 'utf8');
    } catch (err) {
      console.error('Failed to read suggestion prompt file:', err);
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const finalPrompt = prompt.replace('{{ESSAY_CONTENT}}', content);

    // Use a faster model if available, or the default one
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }); // Using a faster model for real-time
    
    // Wrap the API call with the retry logic
    const result = await withRetry(() => model.generateContent(finalPrompt));

    const response = result.response.text();

    // Clean and parse the response
    const cleanedResponse = response.replace(/```json\n|```/g, '').trim();
    const suggestionData = JSON.parse(cleanedResponse);

    res.status(200).json(suggestionData);

  } catch (err) {
    console.error('Error getting suggestions:', err);
    // Return an empty array on failure to avoid interrupting the user
    res.status(200).json({ suggestions: [] });
  }
};

const getUserEssays = async (req, res) => {
  try {
    const { user_id } = req.user;
    const essays = await Essay.findEssayByUser(user_id);
    res.json(essays);
  } catch (err) {
    console.error('Error retrieving user essays:', err);
    res.status(500).json({ error: `Server error: ${err.message}` });
  }
};

const getEssayById = async (req, res) => {
  try {
    const { essay_id } = req.params;
    const essay = await Essay.findEssayById(essay_id);
    if (!essay || essay.user_id !== req.user.user_id) {
      return res.status(403).json({ error: 'Unauthorized or essay not found' });
    }
    res.json(essay);
  } catch (err) {
    console.error('Error retrieving essay:', err);
    res.status(500).json({ error: `Server error: ${err.message}` });
  }
};

const deleteEssay = async (req, res) => {
  try {
    // The fix is to get essay_id from req.params
    const { essay_id } = req.params;
    const { user_id } = req.user; // CORRECT: Use user_id, consistent with other controllers

    // A check to ensure we have a valid ID before proceeding
    if (!essay_id) {
      return res.status(400).json({ error: 'Essay ID is required.' });
    }

    await Essay.deleteEssay(essay_id, user_id);

    res.status(200).json({ message: 'Essay deleted successfully.' });
  } catch (error) {
    console.error('Error in deleteEssay controller:', error);
    res.status(500).json({ error: 'Failed to delete essay.' });
  }
};


const updateEssayTitle = async (req, res) => {
  try {
    const { essay_id } = req.params;
    const { user_id } = req.user;
    const { title } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const updated = await Essay.updateEssayTitle(essay_id, user_id, title.trim());
    if (!updated) {
      return res.status(404).json({ error: 'Essay not found or not authorized' });
    }
    res.json({ message: 'Essay title updated', essay: updated });
  } catch (err) {
    console.error('Error updating essay title:', err);
    res.status(500).json({ error: 'Failed to update essay title' });
  }
};

const chatWithEssay = async (req, res) => {
  try {
    const { essay_id } = req.params;
    const { user_id } = req.user;
    const { question } = req.body;

    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ error: 'A question is required.' });
    }

    // 1. Fetch the essay and its feedback
    const essay = await Essay.findEssayById(essay_id);
    if (!essay || essay.user_id !== user_id) {
      return res.status(403).json({ error: 'Unauthorized or essay not found' });
    }

    // The model might return an array of feedbacks, so we handle that case.
    let feedbackResult = await Feedback.findFeedbackByEssayId(essay_id);
    const feedbackRecord = Array.isArray(feedbackResult) ? feedbackResult[0] : feedbackResult;

    if (!feedbackRecord) {
      return res.status(404).json({ error: 'No feedback found for this essay. Cannot start chat.' });
    }

    // 2. Load the prompt
    const promptPath = path.join(__dirname, '../config/prompts/chat_prompt.txt');
    const promptTemplate = await fs.readFile(promptPath, 'utf8');

    // The feedback content is stored in the 'feedback_text' property.
    const feedbackText = feedbackRecord.feedback_text;

    if (!feedbackText) {
      console.error('Could not find feedback content on the feedback object:', feedbackRecord);
      return res.status(500).json({ error: 'The content for the requested feedback could not be found or is empty.' });
    }

    // 3. Construct the final prompt
    const finalPrompt = promptTemplate
      .replace('{{ESSAY_CONTENT}}', essay.content)
      .replace('{{ESSAY_FEEDBACK}}', feedbackText)
      .replace('{{USER_QUESTION}}', question);

    // 4. Call the AI model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await withRetry(() => model.generateContent(finalPrompt));
    const response = result.response.text();

    res.status(200).json({ response });
  } catch (err) {
    console.error('Error in chatWithEssay:', err);
    res.status(500).json({ error: 'Failed to get a response from Gradely.' });
  }
};

module.exports = {
  uploadEssay,
  createEssayFromText,
  getSuggestions,
  getUserEssays,
  getEssayById,
  deleteEssay,
  updateEssayTitle,
  chatWithEssay,
};