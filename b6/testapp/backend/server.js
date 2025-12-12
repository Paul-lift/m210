const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-Memory Datenspeicher (für Demo/Test ohne externe DB)
let todos = [];
let nextId = 1;

// Helper Funktion um ID zu generieren
function generateId() {
  return nextId++;
}

// API Routes
// GET - Alle Todos abrufen
app.get('/api/todos', async (req, res) => {
  try {
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
    const todo = {
      _id: String(generateId()),
      title,
      completed: false,
      createdAt: new Date(),
    };
    todos.push(todo);
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
    const todo = todos.find(t => t._id === id);
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo nicht gefunden' });
    }
    
    if (title !== undefined) todo.title = title;
    if (completed !== undefined) todo.completed = completed;
    
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Todo löschen
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const index = todos.findIndex(t => t._id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Todo nicht gefunden' });
    }
    
    todos.splice(index, 1);
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
  console.log(`✓ Nutzt In-Memory Datenspeicher (keine externe DB erforderlich)`);
});
