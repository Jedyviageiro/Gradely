const pool = require('../config/db');

const createPin = async(user_id, pin) => {
    try {
        const expires_at = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiration
        const result = await pool.query(
            'INSERT INTO password_resets (user_id, reset_pin, expires_at) VALUES ($1, $2, $3) RETURNING *',
            [user_id, pin, expires_at]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error creating PIN:', error);
        throw new Error('Failed to create PIN');
    }
}

const findPin = async(pin) => {
    try {
        const result = await pool.query(
            'SELECT * FROM password_resets WHERE reset_pin = $1 AND expires_at > NOW()',
            [pin]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error finding PIN:', error);
        throw new Error('Failed to find PIN');
    }
}

const deletePin = async(pin) => {
    try {
        const result = await pool.query(
            'DELETE FROM password_resets WHERE reset_pin = $1 RETURNING *',
            [pin]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error deleting PIN:', error);
        throw new Error('Failed to delete PIN');
    }
}

module.exports = {
    createPin,
    findPin,
    deletePin
}