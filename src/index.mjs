import express from 'express';
import { checkSchema, matchedData, validationResult } from 'express-validator';
import { createUserValidationSchema } from './utils/validationSchemas.mjs';

const PORT = process.env.PORT || 3000;
const users = [
  { id: 1, username: 'ognjen', displayName: 'Ognjen' },
  { id: 2, username: 'dave', displayName: 'Dave' },
  { id: 3, username: 'john', displayName: 'John' },
  { id: 4, username: 'jason', displayName: 'Jason' },
  { id: 5, username: 'henry', displayName: 'Henry' },
  { id: 6, username: 'jean', displayName: 'Jean' },
];

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const loggingMiddleWare = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
};

const resolveIndexUserById = (req, res, next) => {
  const {
    params: { id },
  } = req;
  const userId = parseInt(id);
  if (isNaN(userId)) {
    return res.status(400).send({ mgs: 'Invalid user id' });
  }

  const findUserIndex = users.findIndex((user) => user.id === userId);
  if (findUserIndex === -1) {
    return res.status(404).send({ mgs: 'User does not exist' });
  }

  req.findUserIndex = findUserIndex;
  next();
};

app.use(loggingMiddleWare);

app.get('/', (req, res) => {
  res.status(201).send({ msg: 'hello' });
});

app.get('/api/users', checkSchema(createUserValidationSchema), (req, res) => {
  const {
    query: { filter, value },
  } = req;

  if (filter && value)
    return res.send(users.filter((user) => user[filter].includes(value)));

  return res.send(users);
});

app.post('/api/users', checkSchema(createUserValidationSchema), (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) return res.status(400).send({ error: result.array() });

  const data = matchedData(req);

  const newUser = {
    id: users.length + 1,
    ...data,
  };

  users.push(newUser);

  return res.status(201).send(users);
});

app.get('/api/users/:id', resolveIndexUserById, (req, res) => {
  const { findUserIndex } = req;

  const findUser = users[findUserIndex];

  if (!findUser) {
    return res.status(404).send({ mgs: 'User does not exist' });
  }

  return res.status(200).send(findUser);
});

app.put('/api/users/:id', resolveIndexUserById, (req, res) => {
  const { body, findUserIndex } = req;

  users[findUserIndex] = {
    id: users[findUserIndex].id,
    ...body,
  };

  return res.sendStatus(200);
});

app.patch('/api/users/:id', (req, res) => {
  const { body, findUserIndex } = req;

  users[findUserIndex] = { ...users[findUserIndex], ...body };

  return res.sendStatus(200);
});

app.delete('/api/users/:id', (req, res) => {
  const { findUserIndex } = req;

  users.splice(findUserIndex, 1);

  return res.sendStatus(200);
});

app.get('/api/products', (req, res) => {
  res.send([{ id: 123, name: 'apple', price: 12.99 }]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
