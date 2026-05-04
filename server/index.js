import mongoose from "mongoose";
import express from "express";
import OpenAI from "openai";
import cors from "cors";
import "dotenv/config";

import Note from "./models/Note.js"
import noteRoutes from "./routes/notes.js";
import { SYSTEM_PROMPT } from "./system_prompt.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize OpenAI for OpenRouter
const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
});

// MCP Tools (OpenAI functioin calling format)
const tool = [
    {
        type: "function",
        function: {
            name: "add_note",
            description: "Create a new note. Used for requests to create new note",
            parameters: {
                type: "object",
                properties: {
                    content: { type: "string", description: "The full note content" },
                },
                required: ["content"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "update_note",
            description: "Update a existing note by it's ID. Used for requests to update a existing note",
            parameters: {
                type: "object",
                properties: {
                    id: { type: "number", description: "Update the instructed note using the ID" },
                    content: { type: "string", description: "The new content to be used to update" },
                },
                required: ["id", "content"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "delete_note",
            description: "Delete a existing note. Used for requests to delete a existing note",
            parameters: {
                type: "object",
                properties: {
                    id: { type: "number", description: "Delete the instructed note" },
                },
                required: ["id"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "delete_all_notes",
            description: "Delete all existing note. Used for requests to delete all note",
            parameters: {
                type: "object",
                properties: {},
                required: [],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_note",
            description: "Get a specific note by ID. Used for requests to get a specific note",
            parameters: {
                type: "object",
                properties: {
                    id: { type: "number", description: "Get the instructed note" },
                },
                required: ["id"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_all_notes",
            description: "Get all existing note. Used for requests to get all note",
            parameters: {
                type: "object",
                properties: {},
                required: [],
            },
        },
    },
]

app.use(cors({
    origin: process.env.CLIENT_URL
        ? [process.env.CLIENT_URL, process.env.CLIENT_URL.replace(/\/$/, "")]
        : "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json())
app.use("/api/notes", noteRoutes);

// Tool execution functions
async function deleteNote(id) {
    const note = await Note.findOneAndDelete({ sequenceId: id });
    if (!note) return {
        success: false,
        message: `Note #${id} not found`
    };

    return {
        success: true,
        message: `Note #${note.id} deleted!`,
    };
}

async function addNote(content) {
    const note = new Note({ content })
    await note.save();
    return {
        success: true,
        message: `Note #${note.sequenceId} created: ${content}`,
    };
}

async function updateNote(id, content) {
    const note = await Note.findOneAndUpdate(
        { sequenceId: id },
        { content },
        { new: true },
    );

    if (!note) return {
        success: false,
        message: `Note #${note.id} not found`,
    }

    return {
        success: true,
        message: `Note #${note.id} update to: ${content}`,
    };
}

async function deleteAllNotes() {
    const result = await Note.deleteMany({});
    return {
        success: true,
        message: `Deleted ${result.deletedCount} notes`,
    };
}

async function getNote(id) {
    const note = await Note.findOne(
        { sequenceId: id },
    );

    if (!note) return {
        success: false,
        message: `Note #${note.id} not found`,
    }

    return {
        success: true,
        message: `Note #${note.sequenceId} ${note.content}`,
        note,
    };
}

async function listNotes() {
    const notes = await Note.find().sort({ sequenceId: 1 });
    return {
        success: true,
        notes,
    };
}

// Execute tools
async function executeTools(toolName, toolArgs) {
    switch (toolName) {
        case "add_note":
            return await addNote(toolArgs.content);
        case "update_note":
            return await updateNote(toolArgs.id, toolArgs.content);
        case "delete_note":
            return await deleteNote(toolArgs.id);
        case "delete_all_notes":
            return await deleteAllNotes();
        case "get_note":
            return await getNote(toolArgs.id);
        case "get_all_notes":
            return await listNotes();
        default:
            return {
                success: false,
                message: `Unknown tool ${toolName}`,
            }
    }
}

// API Routes
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message)
            return res.status(400).json({ error: "Message required!" });

        console.log("Chat:", message);

        let result;
        let usedAI = false;

        try {
            // Use OpenRouter AI to decide which tool to use
            const response = await client.chat.completions.create({
                model: "openai/gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: SYSTEM_PROMPT,
                    },
                    {
                        role: "user",
                        content: message,
                    },
                ],
                tools: tool,
                tool_choice: "auto",
            });

            const toolCall = response.choices[0]?.message?.tool_calls?.[0];
            if (toolCall) {
                console.log(
                    "Ai tool:",
                    toolCall.function.name,
                    toolCall.function.arguments,
                );
                const args = JSON.parse((toolCall.function.arguments));
                result = await executeTools(toolCall.function.name, args);
                usedAI = true;
            }
        } catch (aiError) {
            console.error("AI Error:", aiError.message);
        }

        // If AI did not works
        if (usedAI && !result)
            return res.status(503).json({ error: "AI service unavailable", message });

        if (!result)
            return res.json({ message: "I didn't understand that. Try: 'Add note, Delete note (id), Update note (id), List all note, Delete all note" });

        res.json(result);
    } catch (err) {
        console.error("Chat error:", err);
        res.status(500).json({ error: err.message });
    }
})

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("MongoDB connected!");
    app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`))
}).catch(err => console.error("DB error:", err));

