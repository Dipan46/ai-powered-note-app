import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        sequenceId: {
            type: Number,
            unique: true,
        },
    },
    {
        timestamps: true,
    },
);

noteSchema.pre("save", async function () {
    if (!this.sequenceId) {
        const notes = await mongoose.connection.db
            .collection("notes")
            .find({}, { projection: { sequenceId: 1 } })
            .toArray();

        const existingIds = new Set(notes.map((n) => n.sequenceId));

        let newId = 1;

        while (existingIds.has(newId)) {
            newId++;
        }
        this.sequenceId = newId;
    }
});

export default mongoose.model("Note", noteSchema);