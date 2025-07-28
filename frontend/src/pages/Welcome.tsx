import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notesAPI } from '../services/api';
import { Note, User } from '../types';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromURL = urlParams.get('token');
    const userFromURL = urlParams.get('user');

    if (tokenFromURL && userFromURL) {
      localStorage.setItem('token', tokenFromURL);
      localStorage.setItem('user', userFromURL);

      // Clean the URL
      window.history.replaceState({}, document.title, '/welcome');
    }

    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/signin');
      return;
    }

    setUser(JSON.parse(userData));
    fetchNotes();
  }, [navigate]);

  const fetchNotes = async () => {
    try {
      const response = await notesAPI.getNotes();
      setNotes(response.data);
    } catch (err: any) {
      setError('Failed to fetch notes');
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    setLoading(true);
    try {
      const response = await notesAPI.createNote(newNote);
      setNotes([...notes, response.data]);
      setNewNote({ title: '', content: '' });
      setShowCreateForm(false);
    } catch (err: any) {
      setError('Failed to create note');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await notesAPI.deleteNote(id);
      setNotes(notes.filter(note => note._id !== id));
    } catch (err: any) {
      setError('Failed to delete note');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/assets/logo.svg" alt="Logo" className="h-6 w-6" />
            <span className="text-lg font-bold text-gray-800">Dashboard</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-blue-600 hover:text-blue-700 font-medium underline"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome, {user.name}!
          </h1>
          <p className="text-gray-600">
            Email: {user.email.replace(/(.{2}).*(@.*)/, '$1****$2')}
          </p>
        </div>

        {/* Create Note Button */}
        <button
          onClick={() => setShowCreateForm(true)}
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Create Note
        </button>

        {/* Create Note Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Create New Note</h2>
              <form onSubmit={handleCreateNote} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Note title"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Note content"
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Notes Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Notes</h2>
          {notes.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-500">No notes yet. Create your first note above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note, index) => (
                <div 
                  key={note._id} 
                  className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between"
                >
                  <span className="font-medium text-gray-900">Note {index + 1}</span>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scroll Indicator */}
        <div className="w-16 h-1 bg-gray-300 rounded-full mx-auto"></div>
      </div>
    </div>
  );
};

export default Welcome;



