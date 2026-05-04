import { useState, useEffect } from "react";
import { API_URL } from "./config";

import "./App.css";
import NoteList from "./components/NoteList";
import ChatPanel from "./components/ChatPanel";
import MessageButton from "./components/MessageButton";

function App() {
    const [notes, setNotes] = useState([]);
    const [chatOpen, setChatOpen] = useState(true);

    const fetchNote = async () => {
        try {
            const res = await fetch(`${API_URL}/notes`);
            const data = await res.json();
            setNotes(data);
        } catch (err) {
            console.error("Failed to fetch notes:", err);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line
        fetchNote();
    }, []);

    return (
        <div className="app">
            <header className="app-header">
                <h1> My Notes </h1>
                <span className="note-count">
                    {notes.length} note{notes.length > 1 ? "s" : ""}
                </span>
            </header>

            <main className={`app-main ${chatOpen && "chat-open"}`}>
                <NoteList notes={notes} />
            </main>

            <MessageButton onClick={() => setChatOpen((prev) => !prev)} />
            <ChatPanel
                isOpen={chatOpen}
                onClose={() => setChatOpen((prev) => !prev)}
                onNoteUpdate={fetchNote}
            />
        </div>
    );
}

export default App;
