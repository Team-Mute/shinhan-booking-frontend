/**
 * isValidPhone 유틸 함수
 * ----------------------------
 * 휴대폰 번호가 유효한지 검사하는 함수
 *
 * 검사 기준:
 * 1. 숫자만 포함
 * 2. 총 길이는 10자리 또는 11자리
 *
 * @param value - 검사할 휴대폰 번호 문자열
 * @returns {boolean} 유효한 번호면 `true`, 아니면 `false`
 *
 * @example
 * ```ts
 * isValidPhone("01012345678"); // true
 * isValidPhone("0101234567");  // true
 * isValidPhone("010-1234-5678"); // false (하이픈 포함)
 * isValidPhone("012345678");   // false (9자리)
 * ```
 */
export const isValidPhone = (value: string): boolean => {
  const isValid = /^\d{10,11}$/.test(value);
  return isValid;
};
