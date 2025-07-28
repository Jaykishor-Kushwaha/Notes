import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from '../models/User'; 

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: 'http://localhost:5000/api/auth/google/callback', 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error('Email not found in profile'), false);

        let user = await User.findOne({ email });

        if (!user) {
          user = new User({
            email,
            name: profile.displayName,
            googleId: profile.id,
            dob: '', 
          });
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error, false);
      }
    }
  )
);

// Serialize user ID to session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session using ID
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user || false);
  } catch (err) {
    done(err, false);
  }
});

export { passport };
