const pool = require('../config/db');

const createFeedback = async (essay_id, feedback_text, originality_score, typo_score) => {
  try {
    // Validate inputs
    const os = Math.round(Number(originality_score));
    const ts = Math.round(Number(typo_score));

    if (!essay_id || !feedback_text || isNaN(os) || isNaN(ts)) {
      throw new Error('Invalid input: All fields are required and scores must be valid numbers');
    }
    if (os < 1 || os > 10 || ts < 1 || ts > 10) {
      throw new Error('Scores must be between 1 and 10');
    }

    const result = await pool.query(
      'INSERT INTO feedback (essay_id, feedback_text, originality_score, typo_score) VALUES ($1, $2, $3, $4) RETURNING *',
      [essay_id, feedback_text, os, ts]
    );
    return result.rows[0];
  } catch (err) {
    throw new Error(`Failed to create feedback: ${err.message}`);
  }
};

const findFeedbackByEssayId = async (essay_id) => {
  try {
    // Validate input
    if (!essay_id) {
      throw new Error('Invalid input: essay_id is required');
    }

    const result = await pool.query(
      'SELECT feedback_id, essay_id, feedback_text, originality_score, typo_score, created_at FROM feedback WHERE essay_id = $1 ORDER BY created_at DESC',
      [essay_id]
    );
    return result.rows;
  } catch (err) {
    throw new Error(`Failed to find feedback by essay ID: ${err.message}`);
  }
};

const findFeedbackByUser = async (user_id) => {
  try {
    // Validate input
    if (!user_id) {
      throw new Error('Invalid input: user_id is required');
    }

    const result = await pool.query(
      `
      SELECT f.*, e.title as essay_title, e.tonality as essay_tonality
      FROM feedback f
      INNER JOIN essays e ON f.essay_id = e.essay_id
      WHERE e.user_id = $1
      ORDER BY f.created_at DESC
      `,
      [user_id]
    );
    return result.rows;
  } catch (err) {
    throw new Error(`Failed to find feedback by user: ${err.message}`);
  }
};

module.exports = {
  createFeedback,
  findFeedbackByEssayId,
  findFeedbackByUser,
};