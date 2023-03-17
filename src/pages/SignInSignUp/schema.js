const signInSchema = {
  userId: {
    isValid(input) {
      return /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/.test(input);
    },
    error: 'Please enter a valid email address.',
  },
  password: {
    isValid(input) {
      return /^[0-9a-zA-Z]{6,12}$/.test(input);
    },
    error: 'Password must be 6-12 characters consisting of numbers and alphabet.',
  },
};

const signUpSchema = {
  ...signInSchema,
  user: {
    error: 'Name cannot be empty.',
  },
  confirmPassword: {
    error: 'Password and Confirm Password do not match.',
  },
};

export { signInSchema, signUpSchema };
