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
            'SELECT * FROM essays WHERE user_id = $1 ORDER BY uploaded_at DESC',
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

module.exports = {
    createEssay,
    findEssayByUser,
    findEssayById
};