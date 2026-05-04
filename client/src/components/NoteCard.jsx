import "./NoteCard.css";

export default function NoteCard({ note, idx }) {
    return (
        <div className="note-card">
            <div className="note-id">#{idx + 1}</div>
            <div className="note-content">{note.content}</div>
            <div className="note-date">
                {new Date(note.createdAt).toLocaleDateString()}
            </div>
        </div>
    );
}
