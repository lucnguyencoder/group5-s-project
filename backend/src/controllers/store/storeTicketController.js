const StoreTicketService = require('../../services/store/StoreTicketService');

class storeTicketController {
    async createTicket(req, res) {
        try {
            const { subject, description, message } = req.body;
            const userId = req.user.id;

            console.log("Creating ticket for user:", userId);
            console.log("Request body:", { subject, description, message });

            if (!subject || !description || !message) {
                return res.status(400).json({
                    success: false,
                    message: 'Subject, description, and message are required'
                });
            }

            const result = await StoreTicketService.createTicket({
                userId,
                subject: subject.trim(),
                description: description.trim(),
                message: message.trim()
            });

            if (!result.success) {
                return res.status(result.status || 500).json({
                    success: false,
                    message: result.message
                });
            }

            // Chuẩn hóa response data
            const ticketData = result.data.toJSON ? result.data.toJSON() : result.data;
            const responseData = {
                ticket_id: ticketData.ticket_id,
                ticket_code: ticketData.ticket_code,
                requester_id: ticketData.requester_id,
                subject: ticketData.subject,
                description: ticketData.description,
                status: ticketData.status,
                created_at: ticketData.created_at,
                updated_at: ticketData.updated_at
            };

            console.log("Ticket created successfully:", responseData);

            return res.status(201).json({
                success: true,
                message: 'Ticket created successfully',
                data: responseData
            });

        } catch (error) {
            console.error('Error creating ticket:', error);
            return res.status(500).json({
                success: false,
                message: 'Error creating ticket',
                error: error.message
            });
        }
    }

    async getTickets(req, res) {
        try {
            const userId = req.user.id;
            console.log("Getting tickets for user:", userId);
            
            const result = await StoreTicketService.getAllTickets(userId);
            
            if (!result.success) {
                return res.status(result.status || 500).json({
                    success: false,
                    message: result.message
                });
            }

            console.log("Service returned tickets:", result.data);

            // Chuẩn hóa dữ liệu trước khi trả về
            const normalizedTickets = Array.isArray(result.data) 
                ? result.data.map(ticket => {
                    const ticketData = ticket.toJSON ? ticket.toJSON() : ticket;
                    return {
                        ...ticketData,
                        ticket_id: ticketData.ticket_id,
                        messages: ticketData.messages ? ticketData.messages.map(msg => ({
                            ...msg,
                            message_id: msg.message_id || msg.id
                        })) : []
                    };
                })
                : [];

            console.log("Normalized tickets:", normalizedTickets);

            return res.status(200).json({
                success: true,
                data: normalizedTickets
            });

        } catch (error) {
            console.error('Error fetching tickets:', error);
            return res.status(500).json({
                success: false,
                message: 'Error fetching tickets',
                error: error.message
            });
        }
    }

    async getTicketById(req, res) {
        try {
            const ticketId = req.params.id;
            const userId = req.user.id;
            
            console.log("Getting ticket by ID:", ticketId, "for user:", userId);
            
            const result = await StoreTicketService.getTicketById(ticketId, userId);
            
            if (!result.success) {
                return res.status(result.status || 404).json({
                    success: false,
                    message: result.message
                });
            }

            // Chuẩn hóa ticket data
            const ticketData = result.data.toJSON ? result.data.toJSON() : result.data;
            const normalizedTicket = {
                ...ticketData,
                ticket_id: ticketData.ticket_id,
                messages: ticketData.messages ? ticketData.messages.map(msg => ({
                    ...msg,
                    message_id: msg.message_id || msg.id
                })) : []
            };

            return res.status(200).json({
                success: true,
                data: normalizedTicket
            });

        } catch (error) {
            console.error('Error fetching ticket:', error);
            return res.status(500).json({
                success: false,
                message: 'Error fetching ticket',
                error: error.message
            });
        }
    }

    async replyToTicket(req, res) {
        try {
            const ticketId = req.params.id;
            const userId = req.user.id;
            const message = req.body.message || req.body.message_content;

            console.log("Replying to ticket:", ticketId, "by user:", userId);

            if (!message || !message.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Reply message is required'
                });
            }

            const result = await StoreTicketService.replyToTicket(
                ticketId, 
                message.trim(), 
                userId, 
                false
            );

            if (!result.success) {
                return res.status(result.status || 500).json({
                    success: false,
                    message: result.message
                });
            }

            // Chuẩn hóa reply data
            const replyData = result.data.toJSON ? result.data.toJSON() : result.data;
            const normalizedReply = {
                ...replyData,
                message_id: replyData.message_id || replyData.id
            };

            return res.status(201).json({
                success: true,
                message: 'Reply sent successfully',
                data: normalizedReply
            });

        } catch (error) {
            console.error('Error sending reply:', error);
            return res.status(500).json({
                success: false,
                message: 'Error sending reply',
                error: error.message
            });
        }
    }

    async closeTicket(req, res) {
        try {
            const ticketId = req.params.id;
            const userId = req.user.id;

            console.log("Closing ticket:", ticketId, "by user:", userId);

            const result = await StoreTicketService.closeTicket(ticketId, userId, false);

            if (!result.success) {
                return res.status(result.status || 500).json({
                    success: false,
                    message: result.message
                });
            }

            // Chuẩn hóa closed ticket data
            const ticketData = result.data.toJSON ? result.data.toJSON() : result.data;
            const normalizedTicket = {
                ...ticketData,
                ticket_id: ticketData.ticket_id
            };

            return res.status(200).json({
                success: true,
                message: 'Ticket closed successfully',
                data: normalizedTicket
            });

        } catch (error) {
            console.error('Error closing ticket:', error);
            return res.status(500).json({
                success: false,
                message: 'Error closing ticket',
                error: error.message
            });
        }
    }
}

module.exports = new storeTicketController();