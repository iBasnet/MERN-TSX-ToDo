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

// Document Schema and Model
const documentSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Document = mongoose.model('Document', documentSchema);

// Routes

// Fetch all documents
app.get('/api/db', async (req, res) => {
    try {
        const documents = await Document.find();
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch documents' });
    }
});

// Create new document
app.post('/api/db', async (req, res) => {
    try {
        const { value } = req.body;
        const newDocument = new Document({ value });
        await newDocument.save();
        res.status(201).json(newDocument);
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit document' });
    }
});

// Delete document by ID
app.delete('/api/db/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Document.findByIdAndDelete(id);
        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete the document' });
    }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));