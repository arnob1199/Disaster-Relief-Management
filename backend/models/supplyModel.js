const pool = require('../config/db');

const findAll = async () => {
  const [rows] = await pool.execute(
    `SELECT id, name, category, description, quantity, unit, created_at
     FROM supplies
     ORDER BY created_at DESC, id DESC`
  );

  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT id, name, category, description, quantity, unit, created_at
     FROM supplies
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
};

const create = async ({ name, category, description, quantity, unit }) => {
  const [result] = await pool.execute(
    `INSERT INTO supplies (name, category, description, quantity, unit)
     VALUES (?, ?, ?, ?, ?)`,
    [name, category, description, quantity, unit]
  );

  return result.insertId;
};

const update = async (id, { name, category, description, quantity, unit }) => {
  await pool.execute(
    `UPDATE supplies
     SET name = ?, category = ?, description = ?, quantity = ?, unit = ?
     WHERE id = ?`,
    [name, category, description, quantity, unit, id]
  );
};

const remove = async (id) => {
  const [result] = await pool.execute('DELETE FROM supplies WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = { findAll, findById, create, update, remove };
