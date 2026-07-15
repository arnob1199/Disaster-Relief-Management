const pool = require('../config/db');

const getAdminDashboard = async () => {
  const [rows] = await pool.execute(
    `SELECT
       (SELECT COUNT(*) FROM users) AS total_users,
       (SELECT COUNT(*) FROM users WHERE role = ?) AS total_victims,
       (SELECT COUNT(*) FROM shelters) AS total_shelters,
       (SELECT COUNT(*) FROM supplies) AS total_supplies,
       (SELECT COUNT(*) FROM relief_requests WHERE status = ?) AS pending_requests,
       (SELECT COUNT(*) FROM relief_requests WHERE status = ?) AS approved_requests,
       (SELECT COUNT(*) FROM relief_requests WHERE status = ?) AS completed_requests,
       (SELECT COUNT(*) FROM distributions) AS total_distributions,
       (SELECT COUNT(*) FROM supplies WHERE quantity < ?) AS low_stock_supplies`,
    ['victim', 'Pending', 'Approved', 'Completed', 20]
  );

  return rows[0];
};

const getVictimDashboard = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT
       COUNT(*) AS my_requests,
       COALESCE(SUM(CASE WHEN status = ? THEN 1 ELSE 0 END), 0) AS pending_requests,
       COALESCE(SUM(CASE WHEN status = ? THEN 1 ELSE 0 END), 0) AS approved_requests,
       COALESCE(SUM(CASE WHEN status = ? THEN 1 ELSE 0 END), 0) AS completed_requests
     FROM relief_requests
     WHERE user_id = ?`,
    ['Pending', 'Approved', 'Completed', userId]
  );

  return rows[0];
};

module.exports = { getAdminDashboard, getVictimDashboard };
