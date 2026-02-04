import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";


const saveReplyHistory = (ticketId, message) => {
  try {
    const key = `reply_history_${ticketId}`;
    const data = localStorage.getItem(key);
    const history = data ? JSON.parse(data) : [];

    if (!history.includes(message)) {
      history.push(message);
      localStorage.setItem(key, JSON.stringify(history));
    }
  } catch {}
};

export default function ReplyBox({
  ticketId,
  replyInput,
  setReplyInputs,
  replyLoading,
  replyError,
  handleReply,
}) {

  const onSubmit = async (e) => {
    e.preventDefault();
    const msg = replyInput.trim();
    if (!msg) return;
 
    const result = await handleReply(ticketId);
    if (result !== false) {
      saveReplyHistory(ticketId, msg);
    }
  };

  return (
    <form className="mt-4 flex flex-col gap-2" onSubmit={onSubmit}>
      <Textarea
        className="border rounded text-sm"
        rows={2}
        placeholder="Type your reply..."
        value={replyInput}
        onChange={(e) =>
          setReplyInputs((prev) => ({
            ...prev,
            [ticketId]: e.target.value,
          }))
        }
        disabled={replyLoading}
      />
      {replyError && <div className="text-xs text-red-500">{replyError}</div>}
      <div className="flex gap-2">
        <Button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm disabled:opacity-50"
          disabled={replyLoading}
        >
          {replyLoading ? "Sending..." : "Reply"}
        </Button>
      </div>
    </form>
  );
}