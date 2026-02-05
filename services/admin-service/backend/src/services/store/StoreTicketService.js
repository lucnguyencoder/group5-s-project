const { Ticket, TicketMessage, User, UserGroup } = require('../../models');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const { sendTicketNotification } = require('../EmailSender');
const AdminTicketService = require('../admin/AdminTicketService');

class StoreTicketService {
    _validateTextLength(text, maxWords = 250) {
        if (!text) return true;
        const wordCount = text.trim().split(/\s+/).length;
        return wordCount <= maxWords;
    }

    async _checkTicketLimit(userId) {
        try {
            const openTickets = await Ticket.count({
                where: {
                    requester_id: userId,
                    status: 'open',
                }
            });
            
            const MAX_OPEN_TICKETS = 100;
            
            if (openTickets >= MAX_OPEN_TICKETS) {
                return {
                    status: 400,
                    success: false,
                    message: `You can only have ${MAX_OPEN_TICKETS} open ticket at a time. Please close your existing ticket before creating a new one.`
                };
            }
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const todayTickets = await Ticket.count({
                where: {
                    requester_id: userId,
                    created_at: {
                        [Op.gte]: today
                    }
                }
            });
            
            const MAX_DAILY_TICKETS = 500;
            
            if (todayTickets >= MAX_DAILY_TICKETS) {
                return {
                    status: 400,
                    success: false,
                    message: `You can only create ${MAX_DAILY_TICKETS} tickets per day. Please try again tomorrow.`
                };
            }
            
            return { success: true };
        } catch (error) {
            return {
                status: 500,
                success: false,
                message: 'Server error checking ticket limits'
            };
        }
    }
    
    async createTicket(ticketData) {
        try {
            const limitCheck = await this._checkTicketLimit(ticketData.userId);
            if (!limitCheck.success) {
                return limitCheck;
            }
            
            const description = ticketData.description || ticketData.message;
            
            const ticket = await Ticket.create({
                ticket_code: `STC-${uuidv4().substring(0, 8)}`,
                requester_id: ticketData.userId,
                subject: ticketData.subject?.trim(),
                description: description?.trim(),
                status: 'open',
                created_at: new Date(),
                updated_at: new Date()
            });
            
            const firstMessage = await TicketMessage.create({
                ticket_id: ticket.ticket_id,
                sender_id: ticketData.userId,
                sender_type: 'store',
                message_content: ticketData.message.trim(),
                created_at: new Date()
            });
            
            await AdminTicketService._notifySupport(ticket, firstMessage);
            await this._notifyStore(ticket, 'create', firstMessage);
            
            return {
                status: 201,
                success: true,
                data: {
                    ...ticket.toJSON(),
                    firstMessage
                }
            };
        } catch (error) {
            return {
                status: 500,
                success: false,
                message: 'Error creating ticket: ' + error.message
            };
        }
    }

    async getAllTickets(userId) {
        try {
            const tickets = await Ticket.findAll({
                where: { requester_id: userId },
                attributes: [
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
                        as: 'assignedTo',
                        attributes: ['id', 'email']
                    },
                    {
                        model: TicketMessage,
                        as: 'messages',
                        attributes: ['message_id', 'created_at', 'message_content', 'sender_type'],
                    }
                ],
                order: [['created_at', 'DESC']]
            });

            return {
                status: 200,
                success: true,
                data: tickets
            };
        } catch (error) {
            return {
                status: 500,
                success: false,
                message: 'Error fetching tickets: ' + error.message
            };
        }
    }

    async getTicketById(ticketId, userId) {
        try {
            const ticket = await Ticket.findOne({
                where: { 
                    ticket_id: ticketId,
                    requester_id: userId 
                },
                include: [
                    {
                        model: TicketMessage,
                        as: 'messages',
                        attributes: ['message_id', 'created_at', 'message_content', 'sender_type'],
                    },
                    {
                        model: User,
                        as: 'assignedTo',
                        attributes: ['id', 'email']
                    }
                ]
            });

            if (!ticket) {
                return {
                    status: 404,
                    success: false,
                    message: 'Ticket not found or unauthorized'
                };
            }

            return {
                status: 200,
                success: true,
                data: ticket
            };
        } catch (error) {
            return {
                status: 500,
                success: false,
                message: 'Error fetching ticket: ' + error.message
            };
        }
    }

    async closeTicket(ticketId, userId, isAdmin = false) {
        try {
            const where = { ticket_id: ticketId };
            if (!isAdmin) where.requester_id = userId;
            
            const ticket = await Ticket.findOne({
                where
            });

            if (!ticket) {
                return {
                    status: 404,
                    success: false,
                    message: 'Ticket not found or unauthorized'
                };
            }

            if (ticket.status === 'closed') {
                return {
                    status: 400,
                    success: false,
                    message: 'Ticket is already closed'
                };
            }

            await ticket.update({
                status: 'closed',
                updated_at: new Date(),
                resolved_at: new Date()
            });

            return {
                status: 200,
                success: true,
                data: ticket
            };
        } catch (error) {
            return {
                status: 500,
                success: false,
                message: 'Error closing ticket: ' + error.message
            };
        }
    }

    async replyToTicket(ticketId, message, userId, isAdmin = false) {
        try {
            const where = { ticket_id: ticketId }; 
            if (!isAdmin) where.requester_id = userId;
            
            const ticket = await Ticket.findOne({ where });
            
            if (!ticket) {
                return {
                    status: 404,
                    success: false,
                    message: 'Ticket not found or unauthorized'
                };
            }

            if (ticket.status === 'closed') {
                return {
                    status: 400,
                    success: false,
                    message: 'Cannot reply to a closed ticket'
                };
            }

            const sender_type = isAdmin ? 'admin' : 'store';

            const reply = await TicketMessage.create({
                ticket_id: ticketId,
                sender_id: userId,
                sender_type,
                message_content: message,
                created_at: new Date()
            });

            await ticket.update({
                updated_at: new Date()
            });

            if (isAdmin) {
                await this._notifyStore(ticket, 'update', reply);
            } else {
                await AdminTicketService._notifySupport(ticket, reply);
            }

            return {
                status: 201,
                success: true,
                data: reply
            };
        } catch (error) {
            return {
                status: 500,
                success: false,
                message: 'Error replying to ticket: ' + error.message
            };
        }
    }

    async updateTicket(ticketId, data, userId, isAdmin = false) {
        try {
            const where = { ticket_id: ticketId };  
            if (!isAdmin) where.requester_id = userId;
            
            const ticket = await Ticket.findOne({ where });
            if (!ticket) {
                return {
                    status: 404,
                    success: false,
                    message: 'Ticket not found or unauthorized'
                };
            }

            const allowedUpdates = {};
            if (data.subject) allowedUpdates.subject = data.subject.trim();
            if (data.status && isAdmin) allowedUpdates.status = data.status;
            if (isAdmin && data.assigned_to) allowedUpdates.assigned_to = data.assigned_to;

            await ticket.update(allowedUpdates);

            return {
                status: 200,
                success: true,
                data: await Ticket.findOne({ where })
            };
        } catch (error) {
            return {
                status: 500,
                success: false,
                message: 'Error updating ticket: ' + error.message
            };
        }
    }

    async _notifyStore(ticket, type = 'update', message) {
        try {
            const storeUser = await User.findByPk(ticket.requester_id);
            if (storeUser) {
                const subject = `Ticket ${type === 'update' ? 'Update' : 'Created'}: ${ticket.ticket_code}`;
                const description = type === 'update' 
                    ? `Your store ticket ${ticket.ticket_code} has been updated`
                    : `Your store ticket ${ticket.ticket_code} has been created`;
                
                let messageContent = 'No message content';
                
                if (message && typeof message === 'object') {
                    if (message.message_content) {
                        messageContent = message.message_content;
                    } else if (message.content) {
                        messageContent = message.content;
                    } else if (typeof message === 'string') {
                        messageContent = message;
                    }
                }
                
                await sendTicketNotification(
                    storeUser.email,
                    subject,
                    messageContent,
                    `${description}<br/>Subject: ${ticket.subject}`
                );
                
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }
}

module.exports = new StoreTicketService();
