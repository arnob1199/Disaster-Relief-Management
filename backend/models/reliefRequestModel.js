const pool = require('../config/db');

const selectRequestFields = `
  SELECT rr.id, rr.user_id, rr.shelter_id, rr.priority, rr.status, rr.remarks, rr.created_at,
         u.full_name AS user_name,
         s.name AS shelter_name, s.location AS shelter_location
  FROM relief_requests rr
  INNER JOIN users u ON u.id = rr.user_id
  INNER JOIN shelters s ON s.id = rr.shelter_id
`;

const findAll = async () => {
  const [rows] = await pool.execute(
    `${selectRequestFields}
     ORDER BY rr.created_at DESC, rr.id DESC`
  );

  return rows;
};

const findByUserId = async (userId) => {
  const [rows] = await pool.execute(
    `${selectRequestFields}
     WHERE rr.user_id = ?
     ORDER BY rr.created_at DESC, rr.id DESC`,
    [userId]
  );

  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    `${selectRequestFields}
     WHERE rr.id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
};

const shelterExists = async (shelterId) => {
  const [rows] = await pool.execute('SELECT id FROM shelters WHERE id = ? LIMIT 1', [shelterId]);
  return rows.length > 0;
};

const create = async ({ userId, shelterId, priority, remarks }) => {
  const [result] = await pool.execute(
    `INSERT INTO relief_requests (user_id, shelter_id, priority, status, remarks)
     VALUES (?, ?, ?, 'Pending', ?)`,
    [userId, shelterId, priority, remarks]
  );

  return result.insertId;
};

const updateStatus = async (id, status) => {
  await pool.execute('UPDATE relief_requests SET status = ? WHERE id = ?', [status, id]);
};

const remove = async (id) => {
  const [result] = await pool.execute('DELETE FROM relief_requests WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = {
  findAll,
  findByUserId,
  findById,
  shelterExists,
  create,
  updateStatus,
  remove
};
