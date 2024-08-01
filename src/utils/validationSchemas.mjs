export const createUserValidationSchema = {
  username: {
    notEmpty: {
      errorMessage: 'Username cannot be empty',
    },
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage:
        'Username must be at least 5 characters with a max of 32 characters',
    },
    isString: {
      errorMessage: 'Username must be string',
    },
  },
  displayName: {
    notEmpty: true,
  },
  filter: {
    isString: true,
    notEmpty: {
      errorMessage: 'Must not be empty',
    },
    isLength: {
      options: {
        min: 3,
        max: 10,
      },
      errorMessage: 'Must be at least 3-10 characters',
    },
  },
};
