import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcrypt';
import { User, UserRole } from '../models';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          email: profile.emails?.[0].value
        });

        console.log("profile:", profile)
        if (!user) {
          // Create user if not exists
          const password = await bcrypt.hash(profile.id, 10); // Use Google ID as password seed
          user = await User.create({
            email: profile.emails![0].value,
            name: profile.displayName,
            password,
            role: UserRole.USER,
          });
        }

        return done(null, user);
      } catch (error) {
        console.log("error:", error)
        return done(error, undefined);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;