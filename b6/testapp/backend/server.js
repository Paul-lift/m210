const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Verbindung
const mongoUri = process.env.MONGODB_URI || 'mongodb://mongo:27017/nextjs-app';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✓ MongoDB verbunden');
}).catch(err => {
  console.error('✗ MongoDB Fehler:', err);
});

// Schema Definition
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Todo = mongoose.model('Todo', todoSchema);

// API Routes
// GET - Alle Todos abrufen
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Neues Todo erstellen
app.post('/api/todos', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Titel erforderlich' });
    }
    const todo = new Todo({ title });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Todo aktualisieren
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    const todo = await Todo.findByIdAndUpdate(
      id,
      { title, completed },
      { new: true }
    );
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Todo löschen
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id);
    res.json({ message: 'Todo gelöscht' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Server starten
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✓ Backend läuft auf Port ${PORT}`);
});
