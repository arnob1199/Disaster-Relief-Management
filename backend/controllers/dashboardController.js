const dashboardModel = require('../models/dashboardModel');
const { success } = require('../utils/response');

const getAdminDashboard = async (req, res, next) => {
  try {
    const dashboard = await dashboardModel.getAdminDashboard();
    return success(res, dashboard);
  } catch (err) {
    return next(err);
  }
};

const getVictimDashboard = async (req, res, next) => {
  try {
    const dashboard = await dashboardModel.getVictimDashboard(req.user.id);
    return success(res, dashboard);
  } catch (err) {
    return next(err);
  }
};

module.exports = { getAdminDashboard, getVictimDashboard };
