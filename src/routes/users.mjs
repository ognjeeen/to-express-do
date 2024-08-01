import { Router } from 'express';
import { checkSchema, matchedData, validationResult } from 'express-validator';
import {
  createUserValidationSchema,
  filterQueryValidation,
} from '../utils/validationSchemas.mjs';
import { users } from '../utils/constants.mjs';
import { resolveIndexUserById } from '../utils/middlewares.mjs';

const router = Router();

router.get('/api/users', checkSchema(filterQueryValidation), (req, res) => {
  const {
    query: { filter, value },
  } = req;

  if (filter && value)
    return res.send(users.filter((user) => user[filter].includes(value)));

  return res.send(users);
});

router.post(
  '/api/users',
  checkSchema(createUserValidationSchema),
  (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty())
      return res.status(400).send({ error: result.array() });

    const data = matchedData(req);

    const newUser = {
      id: users.length + 1,
      ...data,
    };

    users.push(newUser);

    return res.status(201).send(users);
  }
);

router.get('/api/users/:id', resolveIndexUserById, (req, res) => {
  const { findUserIndex } = req;

  const findUser = users[findUserIndex];

  if (!findUser) {
    return res.status(404).send({ mgs: 'User does not exist' });
  }

  return res.status(200).send(findUser);
});

router.put('/api/users/:id', resolveIndexUserById, (req, res) => {
  const { body, findUserIndex } = req;

  users[findUserIndex] = {
    id: users[findUserIndex].id,
    ...body,
  };

  return res.sendStatus(200);
});

router.patch('/api/users/:id', (req, res) => {
  const { body, findUserIndex } = req;

  users[findUserIndex] = { ...users[findUserIndex], ...body };

  return res.sendStatus(200);
});

router.delete('/api/users/:id', (req, res) => {
  const { findUserIndex } = req;

  users.splice(findUserIndex, 1);

  return res.sendStatus(200);
});

export default router;
