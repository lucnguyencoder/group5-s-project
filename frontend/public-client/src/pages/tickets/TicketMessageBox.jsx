import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import Cookies from 'js-cookie';
import SetTitle from "@/components/common/SetTitle";

function TicketMessageBox({ ticket, onClose, refreshTicket }) {
    const [replyContent, setReplyContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [messages, setMessages] = useState(ticket?.messages || []);

    useEffect(() => {
        if (ticket && ticket.messages) {
            setMessages(ticket.messages);
        }
    }, [ticket]);


    const getToken = () => {

        const cookieToken = Cookies.get('token');


        const localToken = localStorage.getItem('token');


        return cookieToken || localToken || null;
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        setLoading(true);
        setError("");

        try {
            const token = getToken();

            const res = await axios.post(
                `http://localhost:3000/api/customer/tickets/${ticket.ticket_id}/replies`,
                {
                    message_content: replyContent.trim()
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { "Authorization": `Bearer ${token}` } : {})
                    }
                }
            );

            if (res.data && res.data.success && res.data.data) {
                toast.success("Đã gửi tin nhắn thành công!");
                setReplyContent("");
                const newMessage = res.data.data;
                setMessages(prevMessages => [...prevMessages, newMessage]);

                // Gọi hàm refresh nếu có
                if (typeof refreshTicket === 'function') {
                    refreshTicket();
                }
            } else {
                throw new Error(res.data?.message || "Không thể gửi tin nhắn. Vui lòng thử lại sau.");
            }
        } catch (err) {
            console.error("Error sending message:", err);

            if (err?.response?.status === 404) {
                setError("API endpoint không tồn tại (404). Kiểm tra lại đường dẫn API.");
            } else if (err?.response?.status === 401) {
                setError("Bạn cần đăng nhập để gửi tin nhắn.");
            } else {
                let errorMessage = err?.response?.data?.message || err.message || "Không thể gửi tin nhắn. Vui lòng thử lại sau.";
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };
    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        return date.toLocaleString();
    };
    const getMessageClass = (message) => {
        if (message.sender_type === 'customer') {
            return "bg-blue-100 text-blue-800 ml-auto";
        } else if (message.sender_type === 'system' || message.sender_type === 'admin') {
            return "bg-gray-100 text-gray-800";
        }
        return message.is_user ? "bg-blue-100 text-blue-800 ml-auto" : "bg-gray-100 text-gray-800";
    };

    return (
        <div className="flex flex-col h-full">
            <SetTitle title={`Ticket #${ticket.ticket_id} - ${ticket.subject}`} />
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center py-4 text-sm text-gray-500">
                        Chưa có tin nhắn nào. Hãy gửi tin nhắn đầu tiên!
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.message_id || msg.id}
                            className={`p-4 rounded-lg max-w-[80%] ${getMessageClass(msg)}`}
                        >
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>
                                    {msg.sender_type === 'customer' ? "Bạn" :
                                        msg.sender_type === 'system' ? "Hệ thống" :
                                            msg.sender_type === 'admin' ? "Hỗ trợ viên" :
                                                msg.is_user ? "Bạn" : "Hỗ trợ viên"}
                                </span>
                                <span>{formatTime(msg.created_at)}</span>
                            </div>
                            <div className="mt-1 break-words">{msg.message_content || msg.content}</div>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleReplySubmit} className="border-t p-4 bg-white">
                <div className="flex flex-col gap-2">
                    <Textarea
                        className="min-h-[80px] border rounded px-3 py-2 resize-none"
                        value={replyContent}
                        onChange={e => setReplyContent(e.target.value)}
                        maxLength={500}
                        placeholder="Nhập tin nhắn của bạn..."
                        required
                        disabled={loading}
                    />

                    {error && <div className="text-red-500 text-sm">{error}</div>}

                    <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                            {replyContent.length}/500 ký tự
                        </div>
                        <Button
                            type="submit"
                            disabled={loading || !replyContent.trim()}
                            className="bg-primary hover:bg-primary-dark text-white px-4 py-2"
                        >
                            {loading ? "Đang gửi..." : "Gửi"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default TicketMessageBox;