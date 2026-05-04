# 🧠 AI-Powered Note App

> A full-stack, AI-driven note management application. Interact with your notes using **natural language** — the AI understands your intent and automatically creates, reads, updates, or deletes notes without any manual UI interaction.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://mongoosejs.com/)
[![OpenRouter](https://img.shields.io/badge/AI-OpenRouter%20%2F%20GPT--4o--mini-FF6B35)](https://openrouter.ai/)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [AI Tool-Calling System (MCP)](#-ai-tool-calling-system-mcp)
- [API Reference](#-api-reference)
- [Data Model](#-data-model)
- [Frontend Components](#-frontend-components)
- [Environment Variables](#-environment-variables)
- [Installation & Setup](#-installation--setup)
- [Running the Project](#-running-the-project)
- [Usage Guide](#-usage-guide)
- [Known Issues & Limitations](#-known-issues--limitations)
- [Author](#-author)

---

## 🌟 Overview

The **AI-Powered Note App** is a full-stack web application that replaces traditional click-based note management with a **conversational AI interface**. Instead of clicking "Add", "Edit", or "Delete" buttons, users simply type their intent in plain English into a chat panel, and the AI executes the correct operation automatically.

The backend leverages **OpenAI function-calling** (via the **OpenRouter** gateway) to map user messages to specific database operations — a technique commonly referred to as **Model Context Protocol (MCP)** style tool use. This means the AI doesn't just generate text; it takes real, structured actions on your data.

**Example interactions:**
- *"Remind me to call mom"* → Creates a new note
- *"What's in note 2?"* → Retrieves that specific note  
- *"Update note 3 to buy groceries"* → Updates the note content
- *"Delete all my notes"* → Clears the database

---

## 📸 Preview

| Desktop — Notes + Chat Panel | Desktop — Notes Only |
|:---:|:---:|
| ![App with chat panel open](preview/1.png) | ![App with chat panel closed](preview/2.png) |

| Mobile — Notes View | Mobile — Notes + Chat Panel |
|:---:|:---:|
| ![Mobile notes view](preview/3.png) | ![Mobile with chat panel](preview/4.png) |

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🤖 **Conversational AI** | Natural language interface powered by GPT-4o-mini |
| 🛠️ **AI Function Calling** | AI autonomously selects and executes the correct CRUD tool |
| 📝 **Full CRUD via Chat** | Create, Read, Update, Delete notes through plain English |
| 🔢 **Auto-Sequence IDs** | Notes get human-friendly sequential IDs (1, 2, 3…), filling gaps on deletion |
| 🔄 **Real-time UI Sync** | Note list auto-refreshes after every AI action |
| 🎞️ **Animated Chat Panel** | Slide-in side panel with smooth animations |
| 💬 **Chat History** | Conversation stays visible for the session |
| 📱 **Responsive Layout** | Main content shifts when chat panel opens |
| ⚡ **Hot Reload Dev** | Both server (`--watch`) and client (Vite HMR) support live reload |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                                                                 │
│  ┌──────────────────────┐    ┌─────────────────────────────┐    │
│  │     NoteList Panel   │    │        Chat Panel (AI)      │    │
│  │   (NoteList.jsx)     │    │       (ChatPanel.jsx)       │    │
│  │   ┌─────────────┐    │    │  ┌──────────────────────┐   │    │
│  │   │  NoteCard   │    │    │  │  Message Input       │   │    │
│  │   │  NoteCard   │    │    │  │  Chat History        │   │    │
│  │   └─────────────┘    │    │  └──────────────────────┘   │    │
│  └──────────────────────┘    └─────────────────────────────┘    │
│                App.jsx (State Management)                       │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTP (fetch)
                   ┌────────────▼────────────┐
                   │   Express.js Server     │
                   │   (Port 3001)           │
                   │                         │
                   │  GET  /api/notes  ──────┼──► MongoDB (list notes)
                   │  POST /api/chat   ──────┼──► OpenRouter AI
                   └────────────┬────────────┘         │
                                │                       │ GPT-4o-mini
                                │               ┌───────▼──────────┐
                                │               │ Function Calling │
                                │               │  Tool Selection  │
                                │               │  (add/update/    │
                                │               │   delete/get)    │
                                │               └───────┬──────────┘
                                │                       │
                                │               ┌───────▼──────────┐
                                │               │  executeTools()  │
                                └───────────────►  MongoDB CRUD    │
                                                └──────────────────┘
```

### Request Flow

1. User types a message in **ChatPanel**
2. `POST /api/chat` is called with the message
3. Server sends the message + system prompt + available tools to **OpenRouter (GPT-4o-mini)**
4. The AI returns a **function call** (e.g., `add_note`, `delete_note`)
5. Server executes the corresponding **MongoDB operation**
6. Result is returned to the client
7. Client calls `onNoteUpdate()` → `GET /api/notes` refreshes the note list

---

## 🛠️ Tech Stack

### Frontend (`/client`)
| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.x | UI component framework |
| **Vite** | 8.x | Build tool & dev server (HMR) |
| **Vanilla CSS** | — | All styling (no CSS frameworks) |
| **uuid** | 14.x | Unique keys for chat messages |

### Backend (`/server`)
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 18+ | Runtime environment |
| **Express** | 5.x | HTTP server & routing |
| **Mongoose** | 9.x | MongoDB ODM |
| **OpenAI SDK** | 6.x | OpenRouter AI API client |
| **dotenv** | 17.x | Environment variable management |
| **cors** | 2.x | Cross-origin request handling |

### AI & Database
| Service | Purpose |
|---|---|
| **OpenRouter** | AI gateway (routes to GPT-4o-mini) |
| **GPT-4o-mini** | Natural language understanding + function calling |
| **MongoDB Atlas** | Cloud-hosted NoSQL database |

### Tooling
| Tool | Purpose |
|---|---|
| **npm workspaces** | Monorepo management |
| **concurrently** | Run client + server in parallel |
| **node --watch** | Server auto-restart on file changes |
| **ESLint** | Code linting (React hooks rules) |

---

## 📁 Project Structure

```
ai-powered-note-app/                  ← Monorepo root
│
├── package.json                      ← Root workspace config + concurrently
│
├── client/                           ← React + Vite frontend
│   ├── index.html                    ← HTML entry point (title: "AI Powered NoteApp")
│   ├── vite.config.js                ← Vite config with React plugin
│   ├── package.json                  ← Client dependencies
│   ├── eslint.config.js              ← ESLint rules (react-hooks, react-refresh)
│   ├── .env                          ← VITE_API_URL=http://localhost:3001/api
│   ├── .gitignore                    ← Ignores node_modules, dist, .local
│   │
│   └── src/
│       ├── main.jsx                  ← React root mount point
│       ├── App.jsx                   ← Root component (state + layout)
│       ├── App.css                   ← Global layout & header styles
│       ├── index.css                 ← Base/reset styles
│       ├── config.js                 ← Exports API_URL from env variable
│       │
│       └── components/
│           ├── ChatPanel.jsx         ← AI chat interface (core feature)
│           ├── ChatPannel.css        ← Chat panel styles + animations
│           ├── MessageButton.jsx     ← Floating chat toggle button (SVG icon)
│           ├── MessageButton.css     ← Floating button positioning styles
│           ├── NoteList.jsx          ← Renders list of NoteCard components
│           ├── NoteList.css          ← Grid/list layout styles
│           ├── NoteCard.jsx          ← Single note display card
│           └── NoteCard.css         ← Card styles with hover animation
│
└── server/                           ← Node.js + Express backend
    ├── index.js                      ← Main server: Express setup, AI chat, tools
    ├── system_prompt.js              ← AI system prompt with CRUD examples
    ├── package.json                  ← Server dependencies
    ├── .env                          ← MONGODB_URI + OPENROUTER_API_KEY + PORT
    │
    ├── models/
    │   └── Note.js                   ← Mongoose schema (content, sequenceId, timestamps)
    │
    └── routes/
        └── notes.js                  ← GET /api/notes route
```

---

## 🤖 AI Tool-Calling System (MCP)

This is the core innovation of the application. The server defines **6 tools** in OpenAI's function-calling format. When a user message arrives, GPT-4o-mini decides which tool (if any) to invoke:

### Available Tools

| Tool Name | Description | Required Parameters |
|---|---|---|
| `add_note` | Creates a new note | `content` (string) |
| `update_note` | Updates an existing note by ID | `id` (number), `content` (string) |
| `delete_note` | Deletes a specific note by ID | `id` (number) |
| `delete_all_notes` | Deletes all notes | *(none)* |
| `get_note` | Retrieves a specific note by ID | `id` (number) |
| `get_all_notes` | Retrieves all notes | *(none)* |

### How It Works

```javascript
// Server sends message + tools to OpenRouter
const response = await client.chat.completions.create({
    model: "openai/gpt-4o-mini",
    messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user",   content: message }
    ],
    tools: tool,           // 6 defined tools
    tool_choice: "auto",   // AI picks the right tool
});

// Extract tool call from response
const toolCall = response.choices[0]?.message?.tool_calls?.[0];
// Execute the tool → MongoDB operation
const result = await executeTools(toolCall.function.name, args);
```

### System Prompt Strategy

The `system_prompt.js` file contains a highly detailed prompt that:
- Defines exact parameter formats for each tool
- Provides 15 concrete examples of user intent → tool mapping
- Handles typos and variations (e.g., *"rememind"*, *"vlear"*)
- Instructs the AI to ask for clarification if information is ambiguous
- Sets a conversational, friendly tone

### AI Fallback Behavior

```
User message → AI
     │
     ├─► Tool call returned → Execute tool → Return result
     │
     └─► No tool call returned → Return guidance message:
             "I didn't understand that. Try: 'Add note, Delete note (id)...'"
```

---

## 📡 API Reference

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### `GET /api/notes`
Returns all notes sorted by `sequenceId` ascending.

**Response:**
```json
[
    {
        "_id": "...",
        "sequenceId": 1,
        "content": "Remember to call mom",
        "createdAt": "2026-05-04T05:00:00.000Z",
        "updatedAt": "2026-05-04T05:00:00.000Z"
    }
]
```

---

#### `POST /api/chat`
Sends a natural language message to the AI assistant.

**Request Body:**
```json
{
    "message": "Add a note: Buy groceries"
}
```

**Success Response (note created/updated/deleted):**
```json
{
    "success": true,
    "message": "Note #1 created: Buy groceries"
}
```

**Success Response (listing notes):**
```json
{
    "success": true,
    "notes": [
        { "sequenceId": 1, "content": "Buy groceries" }
    ]
}
```

**Unrecognized input response:**
```json
{
    "message": "I didn't understand that. Try: 'Add note, Delete note (id)...'"
}
```

**Error Responses:**

| Status | Meaning |
|---|---|
| `400` | Message field missing in request body |
| `503` | AI service (OpenRouter) unavailable |
| `500` | Internal server error |

---

## 🗄️ Data Model

### Note Schema (`server/models/Note.js`)

```javascript
{
    content:    String,   // Required — the note text
    sequenceId: Number,   // Auto-generated, unique, human-friendly (1, 2, 3...)
    createdAt:  Date,     // Auto-managed by Mongoose timestamps
    updatedAt:  Date,     // Auto-managed by Mongoose timestamps
}
```

### Auto-Sequence ID Logic

A `pre("save")` Mongoose middleware automatically assigns a **gap-filling sequential ID**:

```javascript
noteSchema.pre("save", async function () {
    if (!this.sequenceId) {
        const existingIds = new Set(/* all current IDs */);
        let newId = 1;
        while (existingIds.has(newId)) newId++;  // Find smallest unused ID
        this.sequenceId = newId;
    }
});
```

**Example behavior:**
- Notes 1, 2, 3 exist → Delete note 2 → New note gets ID **2** (gap-filling)
- This keeps IDs compact and human-friendly for AI referencing

> ⚠️ **Known Limitation:** This approach has a race condition under concurrent writes. For production, consider MongoDB's `findOneAndUpdate` with `$inc` on a counter document.

---

## 🧩 Frontend Components

### `App.jsx` — Root Component
**State:**
- `notes` — Array of note objects from the API
- `chatOpen` — Boolean controlling chat panel visibility

**Key behavior:**
- Fetches notes on mount via `useEffect`
- Passes `fetchNote` as `onNoteUpdate` to `ChatPanel` so AI actions trigger a refresh

---

### `ChatPanel.jsx` — AI Chat Interface
The core user-facing component. Manages the full conversation UI.

**State:**
- `messages` — Array of `{ role: "user" | "bot", content: string }`
- `input` — Current text field value
- `loading` — Disables input during API calls

**Key behaviors:**
- Auto-scrolls to the latest message
- Auto-focuses input on open/after response
- Supports `Enter` to send (Shift+Enter for newlines)
- Formats note-list responses from `data.notes` into `#id: content` lines
- Shows animated loading indicator (`...`) while waiting

---

### `NoteList.jsx` — Note Grid
Renders the notes array. Shows an empty-state message when no notes exist.

---

### `NoteCard.jsx` — Individual Note
Displays a single note with:
- **Badge:** Sequential `#id` in indigo
- **Content:** Full note text (preserves whitespace)
- **Date:** Localized creation date
- **Hover animation:** Lifts up with deeper shadow

---

### `MessageButton.jsx` — Floating Action Button
An SVG speech-bubble icon button that toggles the chat panel open/closed.

---

## 🔐 Environment Variables

### Server (`server/.env`)

| Variable | Required | Example | Description |
|---|---|---|---|
| `MONGODB_URI` | ✅ | `mongodb+srv://user:pass@cluster.mongodb.net/noteapp` | MongoDB connection string |
| `OPENROUTER_API_KEY` | ✅ | `sk-or-v1-...` | OpenRouter API key |
| `PORT` | ❌ | `3001` | Server port (defaults to 3001) |

### Client (`client/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | ✅ | `http://localhost:3001/api` | Backend API base URL |

> ⚠️ **Security:** Never commit `.env` files. The server's `.env` contains your API key and database credentials. Add `server/.env` and `client/.env` to your root `.gitignore`.

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** v18 or higher
- **npm** v8 or higher
- A **MongoDB** database (MongoDB Atlas free tier works great)
- An **OpenRouter** account with an API key ([openrouter.ai](https://openrouter.ai))

### Step 1: Clone the repository

```bash
git clone https://github.com/Dipan46/ai-powered-note-app.git
cd ai-powered-note-app
```

### Step 2: Install all dependencies

```bash
npm install
npm install --workspace=server
npm install --workspace=client
```

### Step 3: Configure the Server

Create `server/.env`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxx
PORT=3001
```

### Step 4: Configure the Client

Create `client/.env` (already exists with default):

```env
VITE_API_URL=http://localhost:3001/api
```

---

## ▶️ Running the Project

### Development Mode (Recommended)

Run both client and server simultaneously from the root:

```bash
npm run dev
```

This uses `concurrently` to start:
- **Server** on `http://localhost:3001` (auto-restarts on file change via `node --watch`)
- **Client** on `http://localhost:5173` (Vite HMR)

### Run Individually

```bash
# Server only
npm run server

# Client only
npm run client
```

### Production Build

```bash
# Build client for production
npm run build --workspace=client
```

---

## 📖 Usage Guide

Once the app is running, open `http://localhost:5173` in your browser.

### Chat Commands (Natural Language)

You don't need exact syntax — just speak naturally:

| What you want to do | Example messages |
|---|---|
| **Create a note** | `"Add note: buy milk"` / `"Remind me to call mom"` / `"I need to pick up keys"` |
| **Read a specific note** | `"What's in note 2?"` / `"Show me note 3"` / `"Get note 1"` |
| **List all notes** | `"Show all my notes"` / `"List everything"` / `"What notes do I have?"` |
| **Update a note** | `"Update note 2 to buy organic milk"` / `"Change note 1 to gym at 7pm"` |
| **Delete one note** | `"Delete note 3"` / `"Remove note 2"` / `"Clear note 1"` |
| **Delete everything** | `"Delete all notes"` / `"Remove all"` / `"Clear everything"` |

### UI Controls

- **💬 Floating button** (bottom-right): Toggles the chat panel open/close
- **✕ button** (chat header): Closes the chat panel
- **Enter key**: Sends a message
- **Shift + Enter**: New line in message input

---

## ⚠️ Known Issues & Limitations

| Issue | Details |
|---|---|
| **No user authentication** | All notes are shared globally — no per-user isolation |
| **No conversation memory** | Each chat message is sent independently; the AI has no memory of previous turns |
| **Race condition in sequenceId** | Concurrent note creation could assign the same ID. Acceptable for single-user use |
| **CSS typos** | `border-bottom: 1x solid` in `App.css`; `@media (max-width:768xp)` — mobile responsiveness may be broken |
| **`key={uuidv4()}` in render** | Using `uuidv4()` directly as a key causes all messages to remount on every render |
| **Chat history not persisted** | Refreshing the page clears all chat history |

---

## 🔮 Potential Improvements

- [ ] User authentication (JWT / OAuth)
- [ ] Persistent chat history in MongoDB
- [ ] Multi-turn conversation context
- [ ] Note search / filtering
- [ ] Note categories / tags
- [ ] Markdown rendering in notes
- [ ] Dark mode
- [ ] Mobile-responsive layout fixes
- [ ] Fix CSS typos (`1x` → `1px`, `768xp` → `768px`)
- [ ] Fix chat message keys (stable IDs instead of `uuidv4()` in render)

---

## 👤 Author

**Dipan46**

- GitHub: [@Dipan46](https://github.com/Dipan46)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ using React, Express, MongoDB & OpenRouter AI**

</div>
