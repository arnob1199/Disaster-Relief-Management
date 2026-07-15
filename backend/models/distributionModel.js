const pool = require('../config/db');
const ApiError = require('../utils/ApiError');

const findAll = async () => {
  const [rows] = await pool.execute(
    `SELECT d.id, d.request_id, d.distributed_by, d.distribution_date, d.notes,
            rr.user_id, rr.shelter_id, u.full_name AS distributed_by_name
     FROM distributions d
     INNER JOIN relief_requests rr ON rr.id = d.request_id
     INNER JOIN users u ON u.id = d.distributed_by
     ORDER BY d.distribution_date DESC, d.id DESC`
  );

  return rows;
};

const findById = async (id) => {
  const [distributions] = await pool.execute(
    `SELECT d.id, d.request_id, d.distributed_by, d.distribution_date, d.notes,
            rr.user_id, rr.shelter_id, u.full_name AS distributed_by_name
     FROM distributions d
     INNER JOIN relief_requests rr ON rr.id = d.request_id
     INNER JOIN users u ON u.id = d.distributed_by
     WHERE d.id = ?
     LIMIT 1`,
    [id]
  );

  if (distributions.length === 0) {
    return null;
  }

  const distribution = distributions[0];
  const [items] = await pool.execute(
    `SELECT di.id, di.supply_id, di.quantity, s.name AS supply_name, s.unit
     FROM distribution_items di
     INNER JOIN supplies s ON s.id = di.supply_id
     WHERE di.distribution_id = ?
     ORDER BY di.id ASC`,
    [id]
  );

  return { ...distribution, items };
};

const createWithItems = async ({ requestId, distributedBy, notes, items }) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [requests] = await connection.execute(
      'SELECT id, status FROM relief_requests WHERE id = ? FOR UPDATE',
      [requestId]
    );
    const request = requests[0];

    if (!request) {
      throw new ApiError(404, 'Relief request not found');
    }

    if (request.status !== 'Approved') {
      throw new ApiError(400, 'Only approved relief requests can be distributed');
    }

    const [existingDistributions] = await connection.execute(
      'SELECT id FROM distributions WHERE request_id = ? FOR UPDATE',
      [requestId]
    );
    if (existingDistributions.length > 0) {
      throw new ApiError(409, 'A distribution already exists for this relief request');
    }

    for (const item of items) {
      const [supplies] = await connection.execute(
        'SELECT id, name, quantity FROM supplies WHERE id = ? FOR UPDATE',
        [item.supply_id]
      );
      const supply = supplies[0];

      if (!supply) {
        throw new ApiError(404, `Supply with id ${item.supply_id} was not found`);
      }

      if (supply.quantity < item.quantity) {
        throw new ApiError(400, `Insufficient inventory for ${supply.name}`);
      }
    }

    const [distributionResult] = await connection.execute(
      `INSERT INTO distributions (request_id, distributed_by, distribution_date, notes)
       VALUES (?, ?, NOW(), ?)`,
      [requestId, distributedBy, notes]
    );
    const distributionId = distributionResult.insertId;

    for (const item of items) {
      const [inventoryUpdate] = await connection.execute(
        'UPDATE supplies SET quantity = quantity - ? WHERE id = ? AND quantity >= ?',
        [item.quantity, item.supply_id, item.quantity]
      );

      if (inventoryUpdate.affectedRows !== 1) {
        throw new ApiError(400, 'Inventory changed while creating the distribution');
      }

      await connection.execute(
        `INSERT INTO distribution_items (distribution_id, supply_id, quantity)
         VALUES (?, ?, ?)`,
        [distributionId, item.supply_id, item.quantity]
      );
    }

    await connection.execute(
      "UPDATE relief_requests SET status = 'Completed' WHERE id = ?",
      [requestId]
    );

    await connection.commit();
    return distributionId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const removeWithInventoryRestore = async (id) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [distributions] = await connection.execute(
      'SELECT id, request_id FROM distributions WHERE id = ? FOR UPDATE',
      [id]
    );
    const distribution = distributions[0];
    if (!distribution) {
      throw new ApiError(404, 'Distribution not found');
    }

    const [items] = await connection.execute(
      'SELECT supply_id, quantity FROM distribution_items WHERE distribution_id = ? FOR UPDATE',
      [id]
    );

    for (const item of items) {
      const [supplies] = await connection.execute(
        'SELECT id FROM supplies WHERE id = ? FOR UPDATE',
        [item.supply_id]
      );
      if (supplies.length === 0) {
        throw new ApiError(409, 'A distribution supply record is missing');
      }

      await connection.execute(
        'UPDATE supplies SET quantity = quantity + ? WHERE id = ?',
        [item.quantity, item.supply_id]
      );
    }

    await connection.execute('DELETE FROM distribution_items WHERE distribution_id = ?', [id]);
    await connection.execute('DELETE FROM distributions WHERE id = ?', [id]);
    await connection.execute("UPDATE relief_requests SET status = 'Approved' WHERE id = ?", [distribution.request_id]);

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = { findAll, findById, createWithItems, removeWithInventoryRestore };
