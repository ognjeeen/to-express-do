import express from 'express';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const PORT = process.env.PORT || 3000;

const users = [
  { id: 1, username: 'ognjen', displaName: 'Ognjen' },
  { id: 2, username: 'dave', displaName: 'Dave' },
  { id: 3, username: 'john', displaName: 'John' },
  { id: 4, username: 'jason', displaName: 'Jason' },
  { id: 5, username: 'henry', displaName: 'Henry' },
  { id: 6, username: 'jean', displaName: 'Jean' },
];

app.get('/', (req, res) => {
  res.status(201).send({ msg: 'hello' });
});

app.get('/api/users', (req, res) => {
  const {
    query: { filter, value },
  } = req;

  if (filter && value)
    return res.send(users.filter((user) => user[filter].includes(value)));

  return res.send(users);
});

app.post('/api/users', (req, res) => {
  const { body } = req;

  const newUser = {
    id: users.length + 1,
    ...body,
  };

  users.push(newUser);

  return res.status(201).send(users);
});

app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    return res.status(400).send({ mgs: 'Invalid user id' });
  }

  const findUser = users.find((user) => user.id === userId);

  if (!findUser) {
    return res.status(404).send({ mgs: 'User does not exist' });
  }

  return res.status(200).send(findUser);
});

app.put('/api/users/:id', (req, res) => {
  const {
    body,
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

  users[findUserIndex] = {
    id: userId,
    ...body,
  };

  return res.sendStatus(200);
});

app.patch('/api/users/:id', (req, res) => {
  const {
    body,
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

  users[findUserIndex] = { ...users[findUserIndex], ...body };

  return res.sendStatus(200);
});

app.delete('/api/users/:id', (req, res) => {
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

  users.splice(findUserIndex, 1);

  return res.sendStatus(200);
});

app.get('/api/products', (req, res) => {
  res.send([{ id: 123, name: 'apple', price: 12.99 }]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
