'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Alle Todos abrufen
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/todos`);
      if (!response.ok) throw new Error('Fehler beim Abrufen der Todos');
      const data = await response.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Neues Todo erstellen
  const addTodo = async (title) => {
    try {
      const response = await fetch(`${API_URL}/api/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!response.ok) throw new Error('Fehler beim Erstellen des Todos');
      const newTodo = await response.json();
      setTodos([newTodo, ...todos]);
      return newTodo;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Todo aktualisieren
  const updateTodo = async (id, updates) => {
    try {
      const response = await fetch(`${API_URL}/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Fehler beim Aktualisieren des Todos');
      const updatedTodo = await response.json();
      setTodos(todos.map(t => t._id === id ? updatedTodo : t));
      return updatedTodo;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Todo löschen
  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Fehler beim Löschen des Todos');
      setTodos(todos.filter(t => t._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    refetch: fetchTodos,
  };
}
