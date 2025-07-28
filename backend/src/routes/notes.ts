import express from 'express';
import { authMiddleware } from '../middlewares/auth';
import Note from '../models/Note';

const router = express.Router();

// Apply auth middleware to all notes routes
router.use(authMiddleware);

// Get all notes for the authenticated user
router.get('/', async (req: any, res) => {
  try {
    const notes = await Note.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notes' });
  }
});

// Create a new note
router.post('/', async (req: any, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const note = new Note({
      title,
      content,
      userId: req.userId,
    });

    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create note' });
  }
});

// Delete a note
router.delete('/:id', async (req: any, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete note' });
  }
});

export default router; 