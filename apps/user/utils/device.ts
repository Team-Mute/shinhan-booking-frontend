/**
 * getDeviceType 함수
 * -------------------
 * 현재 접속한 사용자 기기의 유형을 판별합니다. (로그인 시 사용)
 *
 * @returns {"Mobile" | "PC"} 사용자 에이전트 문자열에 'Mobi', 'Android', 'iPhone' 등이 포함되면 "Mobile", 아니면 "PC" 반환.
 */
export function getDeviceType() {
  const ua = navigator.userAgent;
  return /Mobi|Android|iPhone/i.test(ua) ? "Mobile" : "PC";
}

/**
 * getDeviceInfo 함수
 * -------------------
 * 기기 유형과 전체 사용자 에이전트 문자열을 결합하여 반환합니다. (로그인 시 사용)
 *
 * @returns {string} 예: "Mobile - Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) ..."
 */
export function getDeviceInfo() {
  const ua = navigator.userAgent;
  const deviceType = getDeviceType();
  return `${deviceType} - ${ua}`;
}
