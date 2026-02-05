//OOS
const { Ticket, TicketMessage, User, UserGroup } = require('../../models');
const { sendTicketNotification } = require('../EmailSender');

class AdminTicketService {
      _validateTextLength(text, maxWords = 250) {
        const wordCount = text.trim().split(/\s+/).length;
        return wordCount <= maxWords;
    }
    async getAllTickets() {
        try {
            const tickets = await Ticket.findAll({
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
                        as: 'requester',
                        attributes: ['id', 'email'],
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
                        attributes: ['message_id', 'created_at', 'message_content', 'sender_type'],
                        required: false
                    }
                ],
                order: [['created_at', 'DESC']]
            });

            return tickets;
        } catch (error) {
            throw new Error('Error fetching tickets');
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
                        attributes: ['message_id', 'created_at', 'message_content', 'sender_type'],
                    }
                ],
                order: [['created_at', 'DESC']]
            });

            return tickets;
        } catch (error) {
            throw new Error('Error fetching tickets: ' + error.message);
        }
    }

    async adminUpdateTicket(ticketId, updateData) {
        try {
            const ticket = await Ticket.findOne({
                where: { ticket_id: ticketId }
            });

            if (!ticket) {
                throw new Error('Ticket not found');
            }

            const allowedStatuses = ['open', 'in_progress', 'resolved', 'closed'];
            let updateFields = { ...updateData, updated_at: new Date() };

            if (updateData.status) {
                if (!allowedStatuses.includes(updateData.status)) {
                    throw new Error('Invalid status update');
                }
                // If status is 'closed', set resolved_at
                if (updateData.status === 'closed') {
                    updateFields.resolved_at = new Date();
                } else {
                    updateFields.resolved_at = null;
                }
            }

            await ticket.update(updateFields);

            return ticket;
        } catch (error) {
            throw new Error('Error updating ticket: ' + error.message);
        }
    }
    
    // Admin: close ticket
    async adminCloseTicket(ticketId) {
        try {
            const ticket = await Ticket.findOne({
                where: { ticket_id: ticketId }
            });

            if (!ticket) {
                throw new Error('Ticket not found');
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

    
    async addTicketReply(ticketId, userId, message_content) {
        try {
            const ticket = await Ticket.findByPk(ticketId);
            if (!ticket) {
                throw new Error('Ticket not found');
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

            // Nếu admin trả lời và ticket chưa được gán, tự động gán cho admin này
            if (sender_type === 'admin' && !ticket.assigned_to) {
                await ticket.update({
                    assigned_to: userId
                });
            }

            // Gửi thông báo qua email cho khách hàng
            try {
                const customer = await User.findByPk(ticket.requester_id);
                if (customer && sender_type === 'admin') {
                    await sendTicketNotification(
                        customer.email,
                        'New reply to your ticket',
                        `There is a new reply to your ticket: ${ticket.subject}.\n\nReply: ${message_content}`
                    );
                }
            } catch (emailError) {
                console.error('Error sending email notification:', emailError);
            }

            return message;
        } catch (error) {
            throw new Error('Error adding reply: ' + error.message);
        }
    }
      async _notifySupport(ticket, message) {
        try {
            const admins = await User.findAll({
                include: [{
                    model: UserGroup,
                    as: 'group',
                    where: { id: 1  }
                }]
            });

            admins.forEach(async (admin) => {
                await sendTicketNotification(
                    admin.email,
                    `New Ticket: ${ticket.ticket_code}`,
                    message.message_content,
                    `A new support ticket has been created<br/>Subject: ${ticket.subject}<br/>Description: ${ticket.description}`
                );
            });
        } catch (error) {
            console.error('Error notifying admin:', error);
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
     async getTicketById(ticketId) {
        try {
            const where = { ticket_id: ticketId };
           

            const ticket = await Ticket.findOne({
                where,
                include: [
                    {
                        model: TicketMessage,
                        as: 'messages',
                        attributes: ['message_id', 'created_at', 'message_content', 'sender_type','sender_id'],
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
}
module.exports = new AdminTicketService();