"use client";
import { useState } from "react";
import axios from "axios";

export default function Chatbot() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(true);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await axios.post("https://chatbot-h0uz.onrender.com/chat", {
        message: input,
      });

      const botMessage = { role: "bot", content: response.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "⚠️ Error: Unable to reach the chatbot. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }

    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">💬 Chatbot</h1>

        {showWarning && (
          <div className="bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-300 p-3 rounded-lg mb-4 flex justify-between items-center">
            ⚠️ This project is hosted on Render's free tier. Cold starts may cause a 30-50 second delay if the service is inactive.
            <button
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              onClick={() => setShowWarning(false)}
              aria-label="Dismiss warning"
            >
              ✖
            </button>
          </div>
        )}

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto border border-gray-300 dark:border-gray-700 p-4 rounded-lg mb-4">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-3 ${msg.role === "user" ? "text-right" : "text-left"}`}>
              <p
                className={`inline-block p-3 rounded-lg ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                }`}
                aria-label={`${msg.role === "user" ? "User" : "Bot"} message`}
              >
                {msg.content}
              </p>
            </div>
          ))}
          {loading && <p className="text-gray-500 dark:text-gray-300">🤖 Bot is thinking...</p>}
        </div>

        {/* Input */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            aria-label="Chat input"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400 dark:disabled:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Send message"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-6 text-sm text-gray-600 dark:text-gray-400">
        Built with ❤️ using Next.js, Tailwind CSS, and FastAPI.
      </footer>
    </div>
  );
}
