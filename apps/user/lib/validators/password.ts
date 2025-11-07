/**
 * isValidPassword 유틸 함수
 * ----------------------------
 * 비밀번호의 유효성을 검사하는 함수
 *
 * 다음 조건을 모두 만족해야 유효한 비밀번호로 판정
 * 1. 최소 8자 이상
 * 2. 숫자 포함
 * 3. 특수문자 포함
 *
 * @param password - 검사할 비밀번호 문자열
 * @returns {boolean} 비밀번호가 유효하면 `true`, 그렇지 않으면 `false`
 *
 */
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
