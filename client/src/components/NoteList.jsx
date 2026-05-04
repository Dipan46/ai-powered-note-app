import NoteCard from "./NoteCard";
import "./NoteList.css";

export default function NoteList({ notes }) {
    if (notes.length === 0)
        return (
            <div className="note-list-empty">
                <p>No notes yet. click the chat buttom to create one</p>
            </div>
        );

    return (
        <div className="note-list">
            {notes.map((note, idx) => (
                <NoteCard key={note._id} note={note} idx={idx} />
            ))}
        </div>
    );
}
