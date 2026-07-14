const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { findByEmail, createVictim } = require('../models/userModel');

const SALT_ROUNDS = 10;

const getValidationErrors = (req) => validationResult(req).array().map((error) => ({
  field: error.path,
  message: error.msg
}));

const register = async (req, res, next) => {
  try {
    const errors = getValidationErrors(req);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    const { full_name, email, password, phone, address } = req.body;
    const normalizedEmail = email.toLowerCase();
    const existingUser = await findByEmail(normalizedEmail);

    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email is already registered' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const userId = await createVictim({
      fullName: full_name.trim(),
      email: normalizedEmail,
      passwordHash,
      phone: phone.trim(),
      address: address.trim()
    });

    return res.status(201).json({
      success: true,
      message: 'Victim registered successfully',
      user: {
        id: userId,
        full_name: full_name.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        address: address.trim(),
        role: 'victim'
      }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'Email is already registered' });
    }

    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const errors = getValidationErrors(req);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    const { email, password } = req.body;
    const user = await findByEmail(email.toLowerCase());

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!process.env.JWT_SECRET) {
      const configurationError = new Error('JWT_SECRET is not configured');
      configurationError.statusCode = 500;
      return next(configurationError);
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        created_at: user.created_at
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { register, login };
