import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import session from 'express-session';
import { passport } from './config/passport';
import authRoutes from './routes/auth';
import notesRoutes from './routes/notes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

app.get('/', (req, res) => {
  res.send('API is running!');
});

export default app;