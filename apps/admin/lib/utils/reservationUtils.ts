/**
 * 주어진 날짜 문자열을 'YYYY년 MM월 DD일 (요일)' 형식의 문자열로 변환합니다.
 * 예: "2023-10-27T10:00:00Z" -> "2023년 10월 27일 (금)"
 *
 * @param dateStr ISO 8601 형식의 날짜 및 시간 문자열 (예: "2023-10-27T10:00:00Z").
 * @returns 'YYYY년 MM월 DD일 (요일)' 형식의 문자열.
 */
export const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    return `${year}년 ${month}월 ${day}일 (${weekday})`;
};

/**
 * 두 개의 날짜/시간 문자열에서 시간 정보만을 추출하여 'HH:MM~HH:MM' 형식의 시간 범위 문자열로 변환합니다.
 * 예: "2023-10-27T10:00:00Z", "2023-10-27T12:30:00Z" -> "10:00~12:30"
 *
 * @param fromStr 시작 날짜 및 시간 문자열 (ISO 8601 형식).
 * @param toStr 종료 날짜 및 시간 문자열 (ISO 8601 형식).
 * @returns '시작시:분~종료시:분' 형식의 문자열.
 */
export const formatTimeRange = (fromStr: string, toStr: string): string => {
    const fromDate = new Date(fromStr);
    const toDate = new Date(toStr);
    const fromHours = fromDate.getHours().toString().padStart(2, '0');
    const fromMinutes = fromDate.getMinutes().toString().padStart(2, '0');
    const toHours = toDate.getHours().toString().padStart(2, '0');
    const toMinutes = toDate.getMinutes().toString().padStart(2, '0');
    return `${fromHours}:${fromMinutes}~${toHours}:${toMinutes}`;
};