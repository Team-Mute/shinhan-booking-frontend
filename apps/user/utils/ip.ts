/**
 * getClientIp 함수
 * -----------------
 * 외부 API 호출을 통해 클라이언트의 공인 IP 주소를 비동기적으로 가져옵니다.
 *
 * @returns {Promise<string | undefined>} 성공 시 IP 주소 문자열을 반환하고, 실패 시 undefined를 반환합니다.
 */
export async function getClientIp() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch {
    return undefined;
  }
}
