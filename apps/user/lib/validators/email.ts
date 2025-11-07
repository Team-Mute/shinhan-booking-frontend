/**
 * isValidEmail 유틸 함수
 * ----------------------------
 * 이메일 주소의 형식이 올바른지 정규식을 사용해 검사함.
 *
 * @param email - 검사할 이메일 문자열
 * @returns {boolean} 이메일 형식이 유효하면 `true`, 그렇지 않으면 `false`
 *
 * - ^[^\s@]+ → 공백(\s)이나 @을 제외한 문자로 시작해야 함
 * - @[^\s@]+ → 중간에 @ 포함, 뒤에도 유효한 문자 있어야 함
 * - \.[^\s@]+$ → 마지막에 .과 함께 도메인 확장자 존재해야 함
 *
 */
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
