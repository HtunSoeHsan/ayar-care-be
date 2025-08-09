import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({
          where: { email: profile.emails?.[0].value },
        });

        console.log("profile:", profile)
        if (!user) {
          // Create user if not exists
          const password = await bcrypt.hash(profile.id, 10); // Use Google ID as password seed
          user = await prisma.user.create({
            data: {
              email: profile.emails![0].value,
              name: profile.displayName,
              password,
              role: 'USER',
            },
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
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;