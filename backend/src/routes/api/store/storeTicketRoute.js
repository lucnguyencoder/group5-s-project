//OOS
const express = require('express');
const router = express.Router();
const storeTicketController = require('../../../controllers/store/storeTicketController');
const { verifyToken } = require('../../../middleware/jwt');
const { requirePermission } = require('../../../middleware/permission');
const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    next();
};

router.post('/', [
    verifyToken,
    requirePermission('/api/store/tickets', 'POST'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('message').notEmpty().withMessage('Message is required'),
    validate
], storeTicketController.createTicket);


router.get('/', [
    verifyToken,
    // Comment out permission check temporarily for testing
    requirePermission('/api/store/tickets', 'GET')
], storeTicketController.getTickets);

/**
 * @route   GET /api/store/tickets/:id
 * @desc    Get store ticket details by ID
 * @access  Private (Store owners only)
 */
router.get('/:id', [
    verifyToken,
    requirePermission('/api/store/tickets/:id', 'GET')
], storeTicketController.getTicketById);

/**
 * @route   POST /api/store/tickets/:id/reply
 * @desc    Add reply to a store ticket
 * @access  Private (Store owners only)
 */
router.post('/:id/reply', [
    verifyToken,
    requirePermission('/api/store/tickets/:id/reply', 'POST'),
    body('message').notEmpty().withMessage('Message content is required'),
    validate
], storeTicketController.replyToTicket);

/**
 * @route   PUT /api/store/tickets/:id/close
 * @desc    Close a store ticket
 * @access  Private (Store owners only)
 */
router.put('/:id/close', [
    verifyToken,
    requirePermission('/api/store/tickets/:id/close', 'PUT')
], storeTicketController.closeTicket);

module.exports = router;

