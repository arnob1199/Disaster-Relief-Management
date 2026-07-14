const { validationResult } = require('express-validator');
const shelterModel = require('../models/shelterModel');
const { success, error } = require('../utils/response');

const validationMessage = (req) => {
  const errors = validationResult(req);
  return errors.isEmpty() ? null : errors.array()[0].msg;
};

const getAllShelters = async (req, res, next) => {
  try {
    const shelters = await shelterModel.findAll();
    return success(res, shelters);
  } catch (error) {
    return next(error);
  }
};

const getShelterById = async (req, res, next) => {
  try {
    const message = validationMessage(req);
    if (message) {
      return error(res, message, 400);
    }

    const shelter = await shelterModel.findById(req.params.id);
    if (!shelter) {
      return error(res, 'Shelter not found', 404);
    }

    return success(res, shelter);
  } catch (error) {
    return next(error);
  }
};

const createShelter = async (req, res, next) => {
  try {
    const message = validationMessage(req);
    if (message) {
      return error(res, message, 400);
    }

    const { name, location, contact_number, capacity, current_occupancy } = req.body;
    const shelterId = await shelterModel.create({
      name: name.trim(),
      location: location.trim(),
      contactNumber: contact_number.trim(),
      capacity,
      currentOccupancy: current_occupancy
    });
    const shelter = await shelterModel.findById(shelterId);

    return success(res, shelter, 'Shelter created successfully', 201);
  } catch (error) {
    return next(error);
  }
};

const updateShelter = async (req, res, next) => {
  try {
    const message = validationMessage(req);
    if (message) {
      return error(res, message, 400);
    }

    const existingShelter = await shelterModel.findById(req.params.id);
    if (!existingShelter) {
      return error(res, 'Shelter not found', 404);
    }

    const { name, location, contact_number, capacity, current_occupancy } = req.body;
    await shelterModel.update(req.params.id, {
      name: name.trim(),
      location: location.trim(),
      contactNumber: contact_number.trim(),
      capacity,
      currentOccupancy: current_occupancy
    });

    const shelter = await shelterModel.findById(req.params.id);
    return success(res, shelter, 'Shelter updated successfully');
  } catch (error) {
    return next(error);
  }
};

const deleteShelter = async (req, res, next) => {
  try {
    const message = validationMessage(req);
    if (message) {
      return error(res, message, 400);
    }

    const affectedRows = await shelterModel.remove(req.params.id);
    if (affectedRows === 0) {
      return error(res, 'Shelter not found', 404);
    }

    return success(res, { id: Number(req.params.id) }, 'Shelter deleted successfully');
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return error(res, 'Shelter cannot be deleted because it is referenced by relief requests', 409);
    }

    return next(error);
  }
};

module.exports = {
  getAllShelters,
  getShelterById,
  createShelter,
  updateShelter,
  deleteShelter
};
