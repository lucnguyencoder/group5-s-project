//done
const express = require('express');
const router = express.Router();
const storeAuthController = require('../../../controllers/store/storeAuthController');
const { body } = require('express-validator');
const validate = require('../validateRes');


router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
], storeAuthController.login);

module.exports = router;
