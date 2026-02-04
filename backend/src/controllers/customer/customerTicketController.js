const customerTicketService = require('../../services/customer/customerTicketService');
const { consola } = require('consola');

class CustomerTicketController {
    async createTicket(req, res) {
        try {
            const ticket = await customerTicketService.createTicket(req.user.id, req.body);

            return res.status(201).json({
                success: true,
                message: 'Ticket created successfully',
                data: ticket
            });
        } catch (error) {
            consola.error('Create ticket error:', error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getCustomerTickets(req, res) {
        try {
            const tickets = await customerTicketService.getCustomerTickets(req.user.id);

            return res.status(200).json({
                success: true,
                data: tickets
            });
        } catch (error) {
            consola.error('Get tickets error:', error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getTicketById(req, res) {
        try {
            const ticket = await customerTicketService.getTicketById(req.params.id, req.user.id);

            return res.status(200).json({
                success: true,
                data: ticket
            });
        } catch (error) {
            consola.error('Get ticket error:', error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async addTicketReply(req, res) {
        try {
            const reply = await customerTicketService.addTicketReply(
                req.params.id,
                req.user.id,
                req.body.message
            );

            return res.status(201).json({
                success: true,
                message: 'Reply added successfully',
                data: reply
            });
        } catch (error) {
            consola.error('Add reply error:', error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async closeTicket(req, res) {
        try {
            const ticket = await customerTicketService.closeTicket(
                req.params.id,
                req.user.id
            );

            return res.status(200).json({
                success: true,
                message: 'Ticket closed successfully',
                data: ticket
            });
        } catch (error) {
            consola.error('Close ticket error:', error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new CustomerTicketController();