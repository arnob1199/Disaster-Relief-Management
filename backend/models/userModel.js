const pool = require('../config/db');

const findByEmail = async (email) => {
  const [rows] = await pool.execute(
    `SELECT id, full_name, email, password, phone, address, role, created_at
     FROM users
     WHERE email = ?
     LIMIT 1`,
    [email]
  );

  return rows[0] || null;
};

const createVictim = async ({ fullName, email, passwordHash, phone, address }) => {
  const [result] = await pool.execute(
    `INSERT INTO users (full_name, email, password, phone, address, role)
     VALUES (?, ?, ?, ?, ?, 'victim')`,
    [fullName, email, passwordHash, phone, address]
  );

  return result.insertId;
};

module.exports = { findByEmail, createVictim };
