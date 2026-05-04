import "./MessageButton.css";

export default function MessageButton({ onClick }) {
    return (
        <button
            className="message-button"
            onClick={onClick}
            aria-label="Open chat"
        >
            🤖
        </button>
    );
}
