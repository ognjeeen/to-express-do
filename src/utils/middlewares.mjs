import { users } from './constants.mjs';

export const resolveIndexUserById = (req, res, next) => {
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
