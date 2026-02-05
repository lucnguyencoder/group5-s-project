//OOS
const express = require('express');
const router = express.Router();
const ticketController = require('../../../controllers/customer/customerTicketController');
const { verifyToken } = require('../../../middleware/jwt');
const { requirePermission } = require('../../../middleware/permission');
const { body, validationResult } = require('express-validator');

// Validation middleware
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

/**
 * @route   POST /api/customer/tickets
 * @desc    Create a new support ticket
 * @access  Private
 */
router.post('/', [
    verifyToken,
    requirePermission('/api/customer/tickets', 'POST'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('description').notEmpty().withMessage('Description is required'),
    validate
], ticketController.createTicket);

/**
 * @route   GET /api/customer/tickets
 * @desc    Get all tickets for the logged-in customer
 * @access  Private
 */
router.get('/', [
    verifyToken,
    requirePermission('/api/customer/tickets', 'GET')
], ticketController.getCustomerTickets);

/**
 * @route   GET /api/customer/tickets/:id
 * @desc    Get ticket details by ID
 * @access  Private
 */
router.get('/:id', [
    verifyToken,
    requirePermission('/api/customer/tickets/:id', 'GET')
], ticketController.getTicketById);

/**
 * @route   POST /api/customer/tickets/:id/replies
 * @desc    Add reply to a ticket
 * @access  Private
 */
router.post('/:id/replies', [
    verifyToken,
    requirePermission('/api/customer/tickets/:id/replies', 'POST'),
    body('message_content').notEmpty().withMessage('Message content is required'),
    validate
], (req, res, next) => {
    // Map message_content to message for controller compatibility
    req.body.message = req.body.message_content;
    return ticketController.addTicketReply(req, res, next);
});
/**
 * @route   PUT /api/customer/tickets/:id/close
 * @desc    Close a ticket
 * @access  Private
 */
router.put('/:id/close', [
    verifyToken,
    requirePermission('/api/customer/tickets/:id/close', 'PUT')
], ticketController.closeTicket);

module.exports = router;