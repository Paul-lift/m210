'use client';

import { useState } from 'react';
import { useTodos } from '@/hooks/useTodos';

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export default function Home() {
  const { todos, loading, error, addTodo, updateTodo, deleteTodo } = useTodos();
  const [input, setInput] = useState('');

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      await addTodo(input);
      setInput('');
    } catch (err) {
      console.error('Fehler beim Hinzufügen:', err);
    }
  };

  const handleToggle = async (todo: Todo) => {
    try {
      await updateTodo(todo._id, { completed: !todo.completed });
    } catch (err) {
      console.error('Fehler beim Aktualisieren:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
    } catch (err) {
      console.error('Fehler beim Löschen:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
      <main className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
              📝 Todo App
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Verwalte deine Aufgaben einfach und effizient
            </p>
          </div>

          {/* Input Form */}
          <form onSubmit={handleAdd} className="mb-6 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Neue Aufgabe eingeben..."
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              Hinzufügen
            </button>
          </form>

          {/* Status Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
              Fehler: {error}
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">Lade Todos...</p>
            </div>
          )}

          {/* Todo List */}
          {!loading && (
            <div className="space-y-2">
              {todos.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Keine Todos vorhanden. Erstelle eine neue Aufgabe!
                </div>
              ) : (
                todos.map((todo: Todo) => (
                  <div
                    key={todo._id}
                    className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors group"
                  >
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggle(todo)}
                      className="w-5 h-5 rounded border-gray-300 dark:border-slate-500 cursor-pointer"
                    />

                    {/* Title */}
                    <span
                      className={`flex-1 text-lg ${
                        todo.completed
                          ? 'line-through text-gray-400 dark:text-gray-500'
                          : 'text-gray-800 dark:text-white'
                      }`}
                    >
                      {todo.title}
                    </span>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(todo._id)}
                      className="px-3 py-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg opacity-0 group-hover:opacity-100 transition-all font-medium"
                    >
                      Löschen
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Stats */}
          {!loading && todos.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-600 flex gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>
                📊 Gesamt: <strong>{todos.length}</strong>
              </span>
              <span>
                ✅ Abgeschlossen:{' '}
                <strong>{todos.filter((t: Todo) => t.completed).length}</strong>
              </span>
              <span>
                ⏳ Offen:{' '}
                <strong>{todos.filter((t: Todo) => !t.completed).length}</strong>
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
