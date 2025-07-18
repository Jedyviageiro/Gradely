const pool = require('../config/db');

const createToken = async(user_id, confirmation_token) => {
    try {
        const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours expiration
        const result = await pool.query(
            'INSERT INTO email_confirmations (user_id, confirmation_token, expires_at) VALUES ($1, $2, $3) RETURNING *',
            [user_id, confirmation_token, expires_at]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error creating confirmation token:', error);
        throw new Error('Failed to create confirmation token');
    }
}

const findToken = async(confirmation_token) => {
    try {
        const result = await pool.query(
            'SELECT * FROM email_confirmations WHERE confirmation_token = $1 AND expires_at > NOW()',
            [confirmation_token]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error finding confirmation token:', error);
        throw new Error('Failed to find confirmation token');
    }
}

const deleteToken = async(confirmation_token) => {
    try {
        const result = await pool.query(
            'DELETE FROM email_confirmations WHERE confirmation_token = $1 RETURNING *',
            [confirmation_token]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error deleting confirmation token:', error);
        throw new Error('Failed to delete confirmation token');
    }
}

module.exports = {
    createToken,
    findToken,
    deleteToken
}