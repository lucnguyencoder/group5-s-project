//OOS
const express = require('express');
const router = express.Router();
const adminTicketController = require('../../../controllers/admin/adminTicketController');
const { verifyToken } = require('../../../middleware/jwt');
const { requirePermission } = require('../../../middleware/permission');
const { body, validationResult } = require('express-validator');

// Route để lấy tất cả tickets
router.get(
    '/all',
    verifyToken,
    requirePermission('/api/admin/tickets/all', 'GET'),
    adminTicketController.getAllTickets
);

// Route để xem chi tiết ticket
router.get(
    '/:id',
    verifyToken,
    requirePermission('/api/admin/tickets/:id', 'GET'),
    adminTicketController.getTicketById
);

// Route for admin to reply to tickets
router.post(
    '/:id/reply',
    verifyToken,
    requirePermission('/api/admin/tickets/:id/reply', 'POST'),
    adminTicketController.replyToTicket
);

// Route cập nhật ticket (status/details)
router.put(
    '/:id',
    verifyToken,
    requirePermission('/api/admin/tickets/:id', 'PUT'),
    body('status').optional().isIn(['open', 'in_progress', 'resolved', 'closed']).withMessage('Invalid status'),
    // add more validations as needed
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        next();
    },
    adminTicketController.updateTicket
);

// Route for admin to close ticket
router.put(
    '/:id/close',
    verifyToken,
    requirePermission('/api/admin/tickets/:id/close', 'PUT'),
    adminTicketController.closeTicket
);

module.exports = router;