const pool = require('../config/db');

const findAll = async () => {
  const [rows] = await pool.execute(
    `SELECT id, name, location, contact_number, capacity, current_occupancy, created_at
     FROM shelters
     ORDER BY created_at DESC, id DESC`
  );

  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT id, name, location, contact_number, capacity, current_occupancy, created_at
     FROM shelters
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
};

const create = async ({ name, location, contactNumber, capacity, currentOccupancy }) => {
  const [result] = await pool.execute(
    `INSERT INTO shelters (name, location, contact_number, capacity, current_occupancy)
     VALUES (?, ?, ?, ?, ?)`,
    [name, location, contactNumber, capacity, currentOccupancy]
  );

  return result.insertId;
};

const update = async (id, { name, location, contactNumber, capacity, currentOccupancy }) => {
  const [result] = await pool.execute(
    `UPDATE shelters
     SET name = ?, location = ?, contact_number = ?, capacity = ?, current_occupancy = ?
     WHERE id = ?`,
    [name, location, contactNumber, capacity, currentOccupancy, id]
  );

  return result.affectedRows;
};

const remove = async (id) => {
  const [result] = await pool.execute('DELETE FROM shelters WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = { findAll, findById, create, update, remove };
