import express from 'express';
import routes from './routes/index.mjs';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
// import './strategies/local-strategy.mjs';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import './strategies/github-strategy.mjs';

const PORT = process.env.PORT || 3000;
const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to Database'))
  .catch((error) => console.log(`Error: ${error}`));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser(process.env.COOKIE_PARSER));
app.use(
  session({
    secret: `${process.env.SECRET}`,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.post('/api/auth', passport.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

app.get('/api/auth/status', (req, res) => {
  return req.user ? res.send(req.user) : res.sendStatus(401);
});

app.post('/api/auth/logout', (req, res) => {
  if (!req.user) return res.sendStatus(401);

  req.logout((error) => {
    if (error) return res.sendStatus(400);
    res.send(200);
  });
});

app.get('/api/auth/github', passport.authenticate('github'));
app.get(
  '/auth/github/callback',
  passport.authenticate('github'),
  (req, res) => {
    res.sendStatus(200);
  }
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
