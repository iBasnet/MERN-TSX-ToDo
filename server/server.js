const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Mongoose Connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('MongoDB connection error:', error));

// ToDo Schema and Model
const toDoSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    sentAt: {
        type: Date,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        required: true,
        enum: ["Low", "Medium", "High"],
    },
    isComplete: {
        type: Boolean,
        required: true,
    },
}, { timestamps: true });

const Document = mongoose.model('ToDo', toDoSchema);

// Routes

// Fetch all documents
app.get('/api/todo', async (req, res) => {
    try {
        // const documents = await Document.find();
        const documents = await Document.find({});
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch documents' });
    }
})

// Create new document
app.post('/api/todo', async (req, res) => {
    try {
        const newDocument = new Document(req.body);
        await newDocument.save();
        res.status(201).json(newDocument);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add document', error });
    }
})

// delete document by custom ID
app.delete('/api/todo/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Document.findOneAndDelete({ id: id });
        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete the document', error });
    }
})

// Update document by custom ID
app.put('/api/todo/:id', async (req, res) => {

    const { id } = req.params;
    const { text, priority } = req.body;

    try {
        const updatedDocument = await Document.findOneAndUpdate(
            { id: id }, // or simply { id }
            { text, priority },
            { new: true } // Returns the updated document
        )

        if (!updatedDocument) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(updatedDocument);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update the task', error });
    }
})


// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));