import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Loader2, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AI_RESPONSES: Record<string, string> = {
  default:
    "That's a great question! I'm here to help you learn. Could you be more specific about what you'd like to understand?",
  hello:
    "Hi there! 👋 I'm your AI learning assistant. Ask me anything about your studies!",
  help: "I can help you with explanations, study tips, practice questions, and more. What subject are you working on?",
  math: "Mathematics is all about patterns and logic. Break problems down step by step. What specific topic are you struggling with?",
  science:
    "Science is fascinating! Whether it's physics, chemistry, or biology, I'm here to help. What do you want to explore?",
  programming:
    "Programming is a superpower! Start with the fundamentals, practice daily, and don't be afraid to make mistakes. What language are you learning?",
  history:
    "History helps us understand the present. Which period or event would you like to explore?",
  english:
    "English is both an art and a science. Whether it's grammar, writing, or literature — I'm here. What would you like to work on?",
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  for (const [key, response] of Object.entries(AI_RESPONSES)) {
    if (key !== "default" && lower.includes(key)) return response;
  }
  return AI_RESPONSES.default;
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your personal AI tutor. Ask me anything! 🎓",
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || thinking) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setThinking(true);
    await new Promise((resolve) =>
      setTimeout(resolve, 800 + Math.random() * 700),
    );
    const response = getAIResponse(userMessage);
    setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    setThinking(false);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full btn-gradient flex items-center justify-center shadow-glass-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        aria-label="Open AI chatbot"
        data-ocid="chatbot.button"
      >
        {open ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Bot className="w-6 h-6 text-white" />
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-80 glass-card rounded-2xl flex flex-col shadow-glass-lg"
            style={{ height: 400 }}
            data-ocid="chatbot.panel"
          >
            {/* Header */}
            <div className="flex items-center gap-2 p-4 border-b border-border/30">
              <div className="w-8 h-8 rounded-full btn-gradient flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-semibold text-sm">AI Tutor</div>
                <div className="text-xs text-emerald-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />{" "}
                  Online
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-2">
                {messages.map((msg, i) => (
                  <div
                    key={`${msg.role}-${i}`}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`rounded-2xl px-3 py-2 text-sm max-w-[85%] ${
                        msg.role === "user"
                          ? "btn-gradient text-white"
                          : "glass text-foreground"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {thinking && (
                  <div className="flex justify-start">
                    <div className="glass rounded-2xl px-3 py-2">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <form
              onSubmit={sendMessage}
              className="flex gap-2 p-3 border-t border-border/30"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your AI tutor..."
                className="glass border-border/50 text-sm flex-1"
                data-ocid="chatbot.input"
              />
              <Button
                type="submit"
                size="icon"
                className="btn-gradient flex-shrink-0"
                disabled={thinking}
                data-ocid="chatbot.submit_button"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
