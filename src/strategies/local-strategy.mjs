import passport from 'passport';
import { Strategy } from 'passport-local';
import { User } from '../mongoose/schemas/userModel.mjs';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await User.findById(id);
    if (!findUser) throw new Error('User Not Found');

    done(null, findUser);
  } catch (error) {
    done(error, null);
  }
});

export default passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const findUser = await User.findOne({ username });
      if (!findUser) throw new Error('User not found');
      if (findUser.password !== password) throw new Error('Bad Credentials');
      done(null, findUser);
    } catch (error) {
      done(error, null);
    }
  })
);
