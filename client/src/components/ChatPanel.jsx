import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import "./ChatPannel.css";
import { API_URL } from "../config";

export default function ChatPannel({ isOpen, onClose, onNoteUpdate }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messageEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if ((isOpen || !loading) && inputRef.current) inputRef.current.focus();

        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [isOpen, loading, messages]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;
        const userMessage = {
            role: "user",
            content: input.trim(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage.content }),
            });

            if (!res.ok) {
                throw new Error(`Server error: ${res.status}`);
            }

            const data = await res.json();
            let botContent = data.message || "";
            if (data.notes) {
                botContent =
                    data.notes
                        .map((note) => `#${note.sequenceId}: ${note.content}`)
                        .join("\n") || "No notes found";
            }
            setMessages((prev) => [
                ...prev,
                {
                    role: "bot",
                    content: botContent,
                },
            ]);
            if (onNoteUpdate) onNoteUpdate();
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "bot",
                    content: err.message || err,
                },
            ]);
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="chat-panel">
            <div className="chat-header">
                <h3>Note Assistent</h3>
                <button className="chat-close" onClick={onClose}>
                    ✘
                </button>
            </div>
            <div className="chat-messages">
                {messages.length === 0 && (
                    <div className="chat-welcome">
                        <p>Hi! I can help you mannage notes</p>
                        <p className="chat-hint">
                            Try: "Add note: take a shower"
                        </p>
                    </div>
                )}
                {messages.map((message) => (
                    <div
                        key={uuidv4()}
                        className={`chat-message ${message.role}`}
                    >
                        <div className="chat-bubble">{message.content}</div>
                    </div>
                ))}
                {loading && (
                    <div className="chat-message bot">
                        <div className="chat-bubble loading">...</div>
                    </div>
                )}
                <div ref={messageEndRef}></div>
            </div>
            <div className="chat-input-area">
                <input
                    type="text"
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type the prompt"
                    disabled={loading}
                />
                <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                >
                    ➤
                </button>
            </div>
        </div>
    );
}
