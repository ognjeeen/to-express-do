import passport from 'passport';
import { Strategy } from 'passport-github2';
import { GitHubUser } from '../mongoose/schemas/github-user.mjs';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await GitHubUser.findById(id);
    return findUser ? done(null, findUser) : done(null, null);
  } catch (error) {
    done(error, null);
  }
});

export default passport.use(
  new Strategy(
    {
      clientID: `${process.env.clientID}`,
      clientSecret: `${process.env.clientSecret}`,
      callbackURL: 'http://localhost:3000/auth/github/callback',
      scope: ['user'],
    },
    async (accessToken, refreshToken, profile, done) => {
      let findUser;
      try {
        findUser = await GitHubUser.findOne({
          githubId: profile.id,
        });
      } catch (error) {
        return done(error, null);
      }

      try {
        if (!findUser) {
          const newUser = new GitHubUser({
            username: profile.username,
            githubId: profile.id,
          });

          const newSaveUser = await newUser.save();
          return done(null, newSaveUser);
        }
        return done(null, findUser);
      } catch (error) {
        console.log(error);
        return done(error, null);
      }
    }
  )
);
