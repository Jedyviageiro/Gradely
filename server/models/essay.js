const pool = require('../config/db');

const createEssay = async(user_id, title, content) => {
    try {
        const result = await pool.query(
            'INSERT INTO essays (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
            [user_id, title, content]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error creating essay:', error);
        throw new Error('Failed to create essay');
    }
};

const findEssayByUser = async(user_id) => {
    try {
        const result = await pool.query(
            `SELECT
                e.essay_id,
                e.user_id,
                e.title,
                e.content,
                e.uploaded_at,
                COUNT(f.feedback_id) > 0 as has_feedback
            FROM essays e
            LEFT JOIN feedback f ON e.essay_id = f.essay_id
            WHERE e.user_id = $1
            GROUP BY e.essay_id
            ORDER BY e.uploaded_at DESC`,
            [user_id]
        );
        return result.rows;
    } catch (error) {
        console.error('Error finding essays by user:', error);
        throw new Error('Failed to retrieve user essays');
    }
};

const findEssayById = async(essay_id) => {
    try {
        const result = await pool.query(
            'SELECT * FROM essays WHERE essay_id = $1',
            [essay_id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error finding essay by ID:', error);
        throw new Error('Failed to retrieve essay');
    }
};

const deleteEssay = async (essay_id, user_id) => {
  try {
    const result = await pool.query(
      'DELETE FROM essays WHERE essay_id = $1 AND user_id = $2 RETURNING *',
      [essay_id, user_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting essay:', error);
    throw new Error('Failed to delete essay');
  }
};

const updateEssayTitle = async (essay_id, user_id, newTitle) => {
  try {
    const result = await pool.query(
      'UPDATE essays SET title = $1 WHERE essay_id = $2 AND user_id = $3 RETURNING *',
      [newTitle, essay_id, user_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error updating essay title:', error);
    throw new Error('Failed to update essay title');
  }
};

module.exports = {
    createEssay,
    findEssayByUser,
    findEssayById,
    deleteEssay,
    updateEssayTitle,
};