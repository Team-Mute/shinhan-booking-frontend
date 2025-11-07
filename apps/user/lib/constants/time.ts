/**
 * TIME_OPTIONS 상수
 * -------------------
 * 예약 시간 선택 드롭다운에 사용되는 시간 옵션 목록.
 *
 * @description
 * - 00:00부터 23:30까지 30분 간격의 시간 문자열 배열을 생성.
 * - 총 48개의 항목 ({ label: 'HH:MM', value: 'HH:MM' })으로 구성됨.
 */

export const TIME_OPTIONS: { label: string; value: string }[] = Array.from(
  { length: 48 }, // 24시간 * 2 (30분 간격) = 48개 항목 생성
  (_, i) => {
    const h = String(Math.floor(i / 2)).padStart(2, "0"); // 인덱스를 2로 나눈 몫 = 시간 (00 ~ 23)
    const m = i % 2 === 0 ? "00" : "30"; // 인덱스를 2로 나눈 나머지 = 분 (00 또는 30)
    const time = `${h}:${m}`; // "HH:MM" 형식의 시간 문자열 생성
    return { label: time, value: time }; // { label: "HH:MM", value: "HH:MM" } 객체 반환
  }
);
