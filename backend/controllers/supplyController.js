const { validationResult } = require('express-validator');
const supplyModel = require('../models/supplyModel');
const { success, error } = require('../utils/response');

const validationMessage = (req) => {
  const errors = validationResult(req);
  return errors.isEmpty() ? null : errors.array()[0].msg;
};

const getAllSupplies = async (req, res, next) => {
  try {
    const supplies = await supplyModel.findAll();
    return success(res, supplies);
  } catch (err) {
    return next(err);
  }
};

const getSupplyById = async (req, res, next) => {
  try {
    const message = validationMessage(req);
    if (message) {
      return error(res, message, 400);
    }

    const supply = await supplyModel.findById(req.params.id);
    if (!supply) {
      return error(res, 'Supply not found', 404);
    }

    return success(res, supply);
  } catch (err) {
    return next(err);
  }
};

const createSupply = async (req, res, next) => {
  try {
    const message = validationMessage(req);
    if (message) {
      return error(res, message, 400);
    }

    const { name, category, description, quantity, unit } = req.body;
    const supplyId = await supplyModel.create({
      name: name.trim(),
      category: category.trim(),
      description: description ? description.trim() : null,
      quantity,
      unit: unit.trim()
    });
    const supply = await supplyModel.findById(supplyId);

    return success(res, supply, 'Supply created successfully', 201);
  } catch (err) {
    return next(err);
  }
};

const updateSupply = async (req, res, next) => {
  try {
    const message = validationMessage(req);
    if (message) {
      return error(res, message, 400);
    }

    const existingSupply = await supplyModel.findById(req.params.id);
    if (!existingSupply) {
      return error(res, 'Supply not found', 404);
    }

    const { name, category, description, quantity, unit } = req.body;
    await supplyModel.update(req.params.id, {
      name: name.trim(),
      category: category.trim(),
      description: description ? description.trim() : null,
      quantity,
      unit: unit.trim()
    });
    const supply = await supplyModel.findById(req.params.id);

    return success(res, supply, 'Supply updated successfully');
  } catch (err) {
    return next(err);
  }
};

const deleteSupply = async (req, res, next) => {
  try {
    const message = validationMessage(req);
    if (message) {
      return error(res, message, 400);
    }

    const affectedRows = await supplyModel.remove(req.params.id);
    if (affectedRows === 0) {
      return error(res, 'Supply not found', 404);
    }

    return success(res, { id: Number(req.params.id) }, 'Supply deleted successfully');
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return error(res, 'Supply cannot be deleted because it is referenced by distribution items', 409);
    }

    return next(err);
  }
};

module.exports = {
  getAllSupplies,
  getSupplyById,
  createSupply,
  updateSupply,
  deleteSupply
};
