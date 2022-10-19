const signInSchema = {
  email: {
    isValid(input) {
      return /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/.test(input);
    },
    error: '이메일 형식에 맞게 입력해 주세요.',
  },
  password: {
    isValid(input) {
      return /^[0-9a-zA-Z]{6,12}$/.test(input);
    },
    error: '영문 또는 숫자를 6~12자 입력하세요.',
  },
};

const signUpSchema = {
  ...signInSchema,
  name: {
    error: '이름을 입력해 주세요.',
  },
  confirmPassword: {
    error: '패스워드가 일치하지 않습니다.',
  },
};

export { signInSchema, signUpSchema };
