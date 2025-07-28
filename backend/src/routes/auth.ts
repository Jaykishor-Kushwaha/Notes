import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User';
import { sendOtp } from '../utils/sendOtp';

dotenv.config();

const router = express.Router();

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * Send OTP to email — works for both SignUp and SignIn
 */
router.post('/send-otp', async (req, res) => {
  const { email, name, dob } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  let user = await User.findOne({ email });

  if (!user) {
    // Signup case — require name and dob
    if (!name || !dob) {
      return res.status(400).json({ message: 'Name and DOB are required for new users' });
    }

    user = new User({ email, name, dob });
  } else {
    // Existing user — update optional data if sent
    if (name) user.name = name;
    if (dob) user.dob = dob;
  }

  const otp = generateOtp();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  user.otp = otp;
  user.otpExpires = otpExpires;

  try {
    await user.save();
    await sendOtp(email, otp);
    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

/**
 * Verify OTP
 */
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP required' });
  }

  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  // Clear OTP
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      dob: user.dob,
      googleId: user.googleId
    }
  });
});

/**
 * Google OAuth
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/signin' }),
  (req, res) => {
    const user = req.user as any;

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.redirect(`http://localhost:3000/auth-success?token=${token}`);
  }
);

export default router;
