const { validationResult } = require('express-validator');
const reliefRequestModel = require('../models/reliefRequestModel');
const { success, error } = require('../utils/response');

const validationMessage = (req) => {
  const errors = validationResult(req);
  return errors.isEmpty() ? null : errors.array()[0].msg;
};

const getAllRequests = async (req, res, next) => {
  try {
    const requests = req.user.role === 'admin'
      ? await reliefRequestModel.findAll()
      : await reliefRequestModel.findByUserId(req.user.id);

    return success(res, requests);
  } catch (err) {
    return next(err);
  }
};

const getRequestById = async (req, res, next) => {
  try {
    const message = validationMessage(req);
    if (message) {
      return error(res, message, 400);
    }

    const request = await reliefRequestModel.findById(req.params.id);
    if (!request) {
      return error(res, 'Relief request not found', 404);
    }

    if (req.user.role === 'victim' && request.user_id !== req.user.id) {
      return error(res, 'You are not authorized to view this relief request', 403);
    }

    return success(res, request);
  } catch (err) {
    return next(err);
  }
};

const createRequest = async (req, res, next) => {
  try {
    const message = validationMessage(req);
    if (message) {
      return error(res, message, 400);
    }

    const { shelter_id, priority, remarks } = req.body;
    const shelterFound = await reliefRequestModel.shelterExists(shelter_id);
    if (!shelterFound) {
      return error(res, 'Shelter not found', 404);
    }

    const requestId = await reliefRequestModel.create({
      userId: req.user.id,
      shelterId: shelter_id,
      priority,
      remarks: remarks ? remarks.trim() : null
    });
    const request = await reliefRequestModel.findById(requestId);

    return success(res, request, 'Relief request created successfully', 201);
  } catch (err) {
    return next(err);
  }
};

const updateRequestStatus = async (req, res, next) => {
  try {
    const message = validationMessage(req);
    if (message) {
      return error(res, message, 400);
    }

    const request = await reliefRequestModel.findById(req.params.id);
    if (!request) {
      return error(res, 'Relief request not found', 404);
    }

    await reliefRequestModel.updateStatus(req.params.id, req.body.status);
    const updatedRequest = await reliefRequestModel.findById(req.params.id);

    return success(res, updatedRequest, 'Relief request status updated successfully');
  } catch (err) {
    return next(err);
  }
};

const deleteRequest = async (req, res, next) => {
  try {
    const message = validationMessage(req);
    if (message) {
      return error(res, message, 400);
    }

    const affectedRows = await reliefRequestModel.remove(req.params.id);
    if (affectedRows === 0) {
      return error(res, 'Relief request not found', 404);
    }

    return success(res, { id: Number(req.params.id) }, 'Relief request deleted successfully');
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return error(res, 'Relief request cannot be deleted because it has a distribution record', 409);
    }

    return next(err);
  }
};

module.exports = {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequestStatus,
  deleteRequest
};
