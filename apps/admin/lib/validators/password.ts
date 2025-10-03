export const isValidPassword = (password: string): boolean => {
  const minLength = 8;
  const hasNumber = /\d/;
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/;

  return (
    password.length >= minLength &&
    hasNumber.test(password) &&
    hasSpecial.test(password)
  );
};
