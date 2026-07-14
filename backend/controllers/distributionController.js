const { validationResult } = require('express-validator');
const distributionModel = require('../models/distributionModel');
const { success, error } = require('../utils/response');

const validationMessage = (req) => {
  const errors = validationResult(req);
  return errors.isEmpty() ? null : errors.array()[0].msg;
};

const getAllDistributions = async (req, res, next) => {
  try {
    const distributions = await distributionModel.findAll();
    return success(res, distributions);
  } catch (err) {
    return next(err);
  }
};

const getDistributionById = async (req, res, next) => {
  try {
    const message = validationMessage(req);
    if (message) {
      return error(res, message, 400);
    }

    const distribution = await distributionModel.findById(req.params.id);
    if (!distribution) {
      return error(res, 'Distribution not found', 404);
    }

    return success(res, distribution);
  } catch (err) {
    return next(err);
  }
};

const createDistribution = async (req, res, next) => {
  try {
    const message = validationMessage(req);
    if (message) {
      return error(res, message, 400);
    }

    const supplyIds = req.body.items.map((item) => item.supply_id);
    if (new Set(supplyIds).size !== supplyIds.length) {
      return error(res, 'Each supply can appear only once in a distribution', 400);
    }

    const distributionId = await distributionModel.createWithItems({
      requestId: req.body.request_id,
      distributedBy: req.user.id,
      notes: req.body.notes ? req.body.notes.trim() : null,
      items: req.body.items
    });
    const distribution = await distributionModel.findById(distributionId);

    return success(res, distribution, 'Distribution created successfully', 201);
  } catch (err) {
    if (err.statusCode) {
      return error(res, err.message, err.statusCode);
    }

    return next(err);
  }
};

const deleteDistribution = async (req, res, next) => {
  try {
    const message = validationMessage(req);
    if (message) {
      return error(res, message, 400);
    }

    await distributionModel.removeWithInventoryRestore(req.params.id);
    return success(res, { id: Number(req.params.id) }, 'Distribution deleted and inventory restored successfully');
  } catch (err) {
    if (err.statusCode) {
      return error(res, err.message, err.statusCode);
    }

    return next(err);
  }
};

module.exports = {
  getAllDistributions,
  getDistributionById,
  createDistribution,
  deleteDistribution
};
