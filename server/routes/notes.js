import express from "express";
import Note from "../models/Note.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const notes = await Note.find().sort({ sequenceId: 1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;