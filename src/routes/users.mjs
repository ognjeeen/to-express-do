import { Router } from 'express';
import { checkSchema, matchedData, validationResult } from 'express-validator';
import { User } from '../mongoose/schemas/userModel.mjs';
import { createUserValidationSchema } from '../utils/validationSchemas.mjs';

const router = Router();
const isIdValid = (id) => id.length === 24;

router.get('/api/users', async (req, res) => {
  const users = await User.find();

  return res.send(users);
});

router.post(
  '/api/users',
  checkSchema(createUserValidationSchema),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send(result.array());

    const data = matchedData(req);

    const newUser = new User(data);
    try {
      const savedUser = await newUser.save();
      return res.status(201).send(savedUser);
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
  }
);

router.get('/api/users/:id', async (req, res) => {
  const id = req.params.id;

  const findUser = await User.findById(id);
  if (!findUser) {
    return res.status(404).send({ mgs: 'User does not exist' });
  }

  return res.status(200).send(findUser);
});

router.put('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  const userData = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, userData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user', error);
    return res.statusSend(500);
  }
});

router.delete('/api/users/:id', async (req, res) => {
  const id = req.params.id;

  if (!isIdValid(id)) {
    res.send(404);
    return;
  }

  await User.deleteOne({ _id: id });

  return res.sendStatus(200);
});

export default router;
