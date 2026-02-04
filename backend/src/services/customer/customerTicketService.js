const { Ticket, TicketMessage, User, UserGroup } = require('../../models');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const { sendTicketNotification } = require('../EmailSender');
const AdminTicketService = require('../admin/AdminTicketService');
class CustomerTicketService {
  _validateTextLength(text, maxWords = 250) {
        const wordCount = text.trim().split(/\s+/).length;
        return wordCount <= maxWords;
    }

    async _checkTicketLimit(userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const ticketCount = await Ticket.count({
            where: {
                requester_id: userId,
                created_at: {
                    [Op.gte]: today
                }
            }
        });
        
       
    }pó
        
    async createTicket(userId, ticketData) {
        try {
            await this._checkTicketLimit(userId);

            const openTickets = await Ticket.count({
                where: {
                    requester_id: userId,
                    status: 'open',
                    created_at: {
                        [Op.gt]: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
                    }
                }
            });

            if (openTickets >= 1) { 
                throw new Error('Too many open tickets. Please wait or close existing tickets.');
            }

            // Validate subject length
            if (ticketData.subject.length > 100) {
                throw new Error('Subject must not exceed 100 characters');
            }

            // Validate description length
            if (ticketData.description.length > 1000) {
                throw new Error('Description must not exceed 1000 characters');
            }

            if (!this._validateTextLength(ticketData.description)) {
                throw new Error('Description cannot exceed 250 words');
            }

            // Create ticket first
            const ticket = await Ticket.create({
                ticket_code: `TIC-${uuidv4().substring(0, 8)}`,
                requester_id: userId,
                subject: ticketData.subject.trim(),
                description: ticketData.description.trim(),
                status: 'open',
                created_at: new Date(),
                updated_at: new Date()
            });

            // Create first message in ticket_messages table
            const firstMessage = await TicketMessage.create({
                ticket_id: ticket.ticket_id,
                sender_id: userId,
                message_content: ticketData.message_content.trim(),
                created_at: new Date()
            });

       
            await AdminTicketService._notifySupport(ticket, firstMessage);
            await this._notifyCustomer(ticket, 'create', firstMessage);
            return {
                ...ticket.toJSON(),
                firstMessage
            };
        } catch (error) {
            throw new Error('Error creating ticket: ' + error.message);
        }
    }

     async getCustomerTickets(userId) {
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
                        attributes: ['message_id', 'created_at', 'message_content','sender_type'],
                    }
                ],
                order: [['created_at', 'DESC']]
            });

            return tickets;
        } catch (error) {
            throw new Error('Error fetching tickets: ' + error.message);
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
                throw new Error('Ticket not found');
            }

            return ticket;
        } catch (error) {
            throw new Error('Error fetching ticket: ' + error.message);
        }
    }

  async closeTicket(ticketId, userId) {
        try {
            const ticket = await Ticket.findOne({
                where: { 
                    ticket_id: ticketId,
                    requester_id: userId
                }
            });

            if (!ticket) {
                throw new Error('Ticket not found or unauthorized');
            }

            if (ticket.status === 'closed') {
                throw new Error('Ticket is already closed');
            }

            await ticket.update({
                status: 'closed',
                updated_at: new Date(),
                resolved_at: new Date()
            });

            return ticket;
        } catch (error) {
            throw new Error('Error closing ticket: ' + error.message);
        }
    }

async _notifyCustomer(ticket, type = 'update', message) {
        try {
            const customer = await User.findByPk(ticket.requester_id);
            if (customer) {
                const subject = `Ticket ${type === 'update' ? 'Update' : 'Created'}: ${ticket.ticket_code}`;
                const description = type === 'update' 
                    ? `Your ticket ${ticket.ticket_code} has been updated`
                    : `Your ticket ${ticket.ticket_code} has been created`;
                
                await sendTicketNotification(
                    customer.email,
                    subject,
                    message.message_content || 'No message content',
                    `${description}<br/>Subject: ${ticket.subject}<br/>Description: ${ticket.description}`
                );
            }
        } catch (error) {
            console.error('Error notifying customer:', error);
        }
    }

      async addTicketReply(ticketId, userId, message_content) {
        try {
            const ticket = await Ticket.findByPk(ticketId);
            if (!ticket) {
                throw new Error('Ticket not found');
            }

            // Kiểm tra quyền trả lời
            if (ticket.requester_id !== userId) {
                throw new Error('You can only reply to your own tickets');
            }

            // Kiểm tra nếu ticket đã đóng
            if (ticket.status === 'closed') {
                throw new Error('Cannot reply to a closed ticket');
            }

            // Lấy thông tin người dùng kèm theo group
            const user = await User.findOne({
                where: { id: userId },
                include: [
                    { 
                        model: UserGroup, 
                        as: 'group',
                        attributes: ['id', 'name', 'type']
                    }
                ]
            });

            if (!user) {
                throw new Error('User not found');
            }

            // Xác định sender_type dựa trên user_groups.type
            let sender_type = 'customer'; // Mặc định
            if (user.group) {
                switch (user.group.type) {
                    case 'system':
                        sender_type = 'admin';
                        break;
                    case 'store':
                        sender_type = 'staff';
                        break;
                    default:
                        sender_type = 'customer';
                }
            }

            // Tạo tin nhắn với sender_type được xác định
            const message = await TicketMessage.create({
                ticket_id: ticketId,
                sender_id: userId,
                sender_type: sender_type,
                message_content,
                created_at: new Date()
            });

            // Cập nhật thời gian cập nhật của ticket
            await ticket.update({
                updated_at: new Date()
            });

            return message;
        } catch (error) {
            throw new Error('Error adding reply: ' + error.message);
        }
    }
}
module.exports = new CustomerTicketService();
