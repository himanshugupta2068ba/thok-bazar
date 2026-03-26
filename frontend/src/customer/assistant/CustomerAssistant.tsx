import {
  AutoAwesome,
  CloseRounded,
  SendRounded,
  SmartToyOutlined,
} from "@mui/icons-material";
import { Button, CircularProgress, IconButton } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../../config/api";
import { getValidCustomerJwt } from "../../util/customerSession";

interface AssistantProduct {
  id: string;
  title: string;
  image?: string;
  price: number;
  mrpPrice: number;
  discount: number;
  sellerName?: string;
  url: string;
}

interface AssistantMessage {
  role: "assistant" | "user";
  content: string;
  products?: AssistantProduct[];
}

const starterPrompts = [
  "Find the cheapest t shirt under Rs. 500",
  "Show me budget shoes",
  "Help me with my latest order",
];

const initialMessages: AssistantMessage[] = [
  {
    role: "assistant",
    content:
      "Hi, I can help you find products, compare prices, and answer customer support questions.",
  },
];

const formatPrice = (value: number) => `Rs. ${Number(value || 0).toFixed(2)}`;

export const CustomerAssistant = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<AssistantMessage[]>(initialMessages);

  useEffect(() => {
    if (!open) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, open]);

  const handleSend = async (overrideMessage?: string) => {
    const nextMessage = String(overrideMessage ?? input).trim();

    if (!nextMessage || loading) {
      return;
    }

    const nextUserMessage: AssistantMessage = {
      role: "user",
      content: nextMessage,
    };

    const conversation = [...messages, nextUserMessage]
      .slice(-8)
      .map((message) => ({
        role: message.role,
        content: message.content,
      }));

    setOpen(true);
    setLoading(true);
    setMessages((prev) => [...prev, nextUserMessage]);
    setInput("");

    try {
      const customerJwt = getValidCustomerJwt();
      const response = await api.post(
        "/ai/customer-assistant",
        {
          message: nextMessage,
          conversation,
        },
        {
          headers: customerJwt
            ? {
                Authorization: `Bearer ${customerJwt}`,
              }
            : undefined,
        },
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            response.data?.reply ||
            "I could not generate a response right now. Please try again.",
          products: Array.isArray(response.data?.products) ? response.data.products : [],
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I could not connect right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages(initialMessages);
    setInput("");
    setLoading(false);
  };

  return (
    <>
      {open ? (
        <div className="fixed bottom-5 right-4 z-[160] w-[min(390px,calc(100vw-1.5rem))] rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.16)] sm:right-6">
          <div className="flex items-center justify-between rounded-t-[28px] bg-[linear-gradient(135deg,#f0fdfa_0%,#f8fafc_100%)] px-4 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-600 text-white">
                <SmartToyOutlined />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">AI Help</p>
                <p className="truncate text-xs text-slate-500">Products and support</p>
              </div>
            </div>

            <div className="ml-3 flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-full px-3 py-1 text-xs font-medium text-slate-500 transition hover:bg-white hover:text-slate-700"
              >
                Reset
              </button>
              <IconButton size="small" onClick={() => setOpen(false)}>
                <CloseRounded fontSize="small" />
              </IconButton>
            </div>
          </div>

          <div className="max-h-[60vh] space-y-4 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div className="max-w-[88%] space-y-3">
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                      message.role === "user"
                        ? "bg-slate-900 text-white"
                        : "border border-slate-200 bg-slate-50 text-slate-700"
                    }`}
                  >
                    {message.content}
                  </div>

                  {message.products?.length ? (
                    <div className="grid gap-3">
                      {message.products.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => navigate(product.url)}
                          className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left transition hover:border-teal-300 hover:shadow-sm"
                        >
                          <div className="h-16 w-16 overflow-hidden rounded-xl bg-slate-100">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.title}
                                className="h-full w-full object-cover"
                              />
                            ) : null}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-sm font-semibold text-slate-900">
                              {product.title}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {product.sellerName || "Seller"}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-900">
                                {formatPrice(product.price)}
                              </span>
                              {product.mrpPrice > product.price ? (
                                <span className="text-xs text-slate-400 line-through">
                                  {formatPrice(product.mrpPrice)}
                                </span>
                              ) : null}
                              {product.discount > 0 ? (
                                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                                  {product.discount}% off
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}

            {loading ? (
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <CircularProgress size={18} />
                Finding the best answer for you...
              </div>
            ) : null}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-200 px-4 py-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-teal-300 hover:text-teal-700"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="flex items-end gap-3">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSend();
                  }
                }}
                rows={2}
                placeholder="Ask about products, prices, or support..."
                className="min-h-[52px] flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-teal-400 focus:bg-white"
              />
              <Button
                variant="contained"
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                sx={{
                  minWidth: 52,
                  height: 52,
                  borderRadius: "16px",
                  boxShadow: "none",
                }}
              >
                <SendRounded />
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {!open ? (
        <div className="fixed bottom-5 right-4 z-[160] sm:right-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open AI assistant"
            className="group flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-full bg-slate-900 px-4 py-3 text-white shadow-[0_20px_45px_rgba(15,23,42,0.22)] transition hover:bg-teal-700"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/12">
              <AutoAwesome className="transition group-hover:scale-110" />
            </span>
            <span className="min-w-0 pr-1 text-left">
              <span className="block text-sm font-semibold leading-tight">Ask AI</span>
              <span className="hidden pt-0.5 text-xs leading-tight text-slate-200 sm:block">
                Find products or get support
              </span>
            </span>
          </button>
        </div>
      ) : null}
    </>
  );
};
