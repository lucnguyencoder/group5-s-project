const { Ticket, User, TicketMessage } = require('../../models');
const AdminTicketService = require('../../services/admin/AdminTicketService'); // Add this line if not present

class adminTicketController {
    async getAllTickets(req, res) {
        try {
            const tickets = await Ticket.findAll({
                attributes: [
                    // 'sender_id',
                    'ticket_id',
                    'ticket_code',
                    'requester_id',
                    'assigned_to',
                    'subject',
                    'description',
                    'status',
                    'created_at',
                    'updated_at'
                ],
                include: [
                    {
                        model: User,
                        as: 'requester',
                        attributes: ['id',  'email'],
                        required: false
                    },
                    {
                        model: User,
                        as: 'assignedTo',
                        attributes: ['id', 'email'],
                        required: false
                    },
                    {
                        model: TicketMessage,
                        as: 'messages',
                        attributes: ['message_id',  'created_at','message_content', 'sender_type'],
                        required: false
                
                    }
                ],
                order: [['created_at', 'DESC']]
            });

            if (!tickets) {
                return res.status(200).json({
                    success: true,
                    data: []
                });
            }

            return res.status(200).json({
                success: true,
                data: tickets
            });

        } catch (error) {
            console.error('Error in getAllTickets:', error);
            return res.status(500).json({
                success: false,
                message: 'Error fetching tickets',
                error: error.message
            });
        }
    }

    async createTicket(req, res) {
        try {
            const { subject, description } = req.body;
            const userId = req.user.id;

            const ticket = await Ticket.create({
                requester_id: userId,
                subject,
                description,
                status: 'open',
                ticket_code: `TIC-${Math.random().toString(36).substr(2, 8)}`,
                created_at: new Date(),
                updated_at: new Date()
            });

            return res.status(201).json({
                success: true,
                message: 'Ticket created successfully',
                data: {
                    ticket_id: ticket.ticket_id,
                    ticket_code: ticket.ticket_code,
                    requester_id: ticket.requester_id,
                    subject: ticket.subject,
                    description: ticket.description,
                    status: ticket.status,
                    created_at: ticket.created_at,
                    updated_at: ticket.updated_at
                }
            });

        } catch (error) {
            console.error('Error in createTicket:', error);
            return res.status(500).json({
                success: false,
                message: 'Error creating ticket',
                error: error.message
            });
        }
    }

    async replyToTicket(req, res) {
        try {
            const ticketId = req.params.id;
            const adminId = req.user.id;
            
            const message = req.body.message || req.body.message_content;

            if (!message || !message.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Reply message is required'
                });
            }

            
            const reply = await AdminTicketService.addTicketReply(ticketId, adminId, message);

            
            const ticket = await AdminTicketService.getTicketById(ticketId, adminId);

        
            await AdminTicketService._notifySupport(ticket, reply);
            await AdminTicketService._notifyCustomer(ticket, 'update', reply);

            return res.status(201).json({
                success: true,
                message: 'Reply sent and notifications delivered',
                data: reply
            });
        } catch (error) {
            console.error('Error in replyToTicket:', error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getTicketById(req, res) {
        try {
            const ticket = await AdminTicketService.getTicketById(req.params.id, null); // null for admin
            return res.status(200).json({
                success: true,
                data: ticket
            });
        } catch (error) {
            console.error('Error in getTicketById:', error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateTicket(req, res) {
        try {
            // Allow admin to update ticket status (open, in_progress, resolved, closed)
            const allowedStatuses = ['open', 'in_progress', 'resolved', 'closed'];
            const { status } = req.body;
            if (status && !allowedStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status value'
                });
            }
            const ticket = await AdminTicketService.adminUpdateTicket(
                req.params.id,
                req.body
            );
            return res.status(200).json({
                success: true,
                message: 'Ticket updated successfully',
                data: ticket
            });
        } catch (error) {
            console.error('Error in updateTicket:', error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async closeTicket(req, res) {
        try {
            const ticket = await AdminTicketService.adminCloseTicket(
                req.params.id
            );
            return res.status(200).json({
                success: true,
                message: 'Ticket closed successfully',
                data: ticket
            });
        } catch (error) {
            console.error('Error in closeTicket:', error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new adminTicketController();