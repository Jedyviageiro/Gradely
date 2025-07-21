const { Essay } = require('../models');
const fs = require('fs').promises;
const pdf = require('pdf-parse');
const multer = require('multer');

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

module.exports = {
  uploadEssay,
  getUserEssays,
  getEssayById,
  deleteEssay,
  updateEssayTitle,
};