//done
const express = require('express');
const router = express.Router();
const adminAuthController = require('../../../controllers/admin/adminAuthController');
const { body } = require('express-validator');
const validate = require('../validateRes');

router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validate], adminAuthController.login);

module.exports = router;
