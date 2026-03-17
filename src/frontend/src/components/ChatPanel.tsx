import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useGroupChatMessages, useSendChatMessage } from "../hooks/useQueries";

interface ChatPanelProps {
  groupId: bigint;
  username: string;
}

export default function ChatPanel({ groupId, username }: ChatPanelProps) {
  const [message, setMessage] = useState("");
  const { data: messages = [] } = useGroupChatMessages(groupId);
  const sendMutation = useSendChatMessage();
  const bottomRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      await sendMutation.mutateAsync({
        groupId,
        message: message.trim(),
        senderUsername: username,
      });
      setMessage("");
    } catch {}
  };

  return (
    <div
      className="glass-card rounded-2xl p-4 flex flex-col"
      style={{ height: 320 }}
    >
      <h2 className="font-display font-semibold text-base mb-3 flex items-center gap-2">
        <MessageCircle className="w-4 h-4 text-violet-500" /> Group Chat
      </h2>
      <ScrollArea className="flex-1 pr-2">
        {messages.length === 0 ? (
          <div className="text-center py-6" data-ocid="chat.empty_state">
            <p className="text-xs text-muted-foreground">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((msg, i) => (
              <div
                key={msg.timestamp.toString()}
                className={`flex flex-col ${msg.senderUsername === username ? "items-end" : "items-start"}`}
                data-ocid={`chat.item.${i + 1}`}
              >
                <span className="text-xs text-muted-foreground mb-0.5">
                  {msg.senderUsername}
                </span>
                <div
                  className={`rounded-2xl px-3 py-2 text-sm max-w-[80%] ${
                    msg.senderUsername === username
                      ? "btn-gradient text-white"
                      : "glass text-foreground"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>
      <form onSubmit={handleSend} className="flex gap-2 mt-3">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="glass border-border/50 text-sm flex-1"
          data-ocid="chat.input"
        />
        <Button
          type="submit"
          size="icon"
          className="btn-gradient flex-shrink-0"
          disabled={sendMutation.isPending}
          data-ocid="chat.button"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
