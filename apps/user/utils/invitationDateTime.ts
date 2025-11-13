// 전체 날짜 포맷 (년월일 + 요일)
export const formatFullDateTime = (isoString: string): string => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    return `${year}년 ${month}월 ${day}일 ${dayOfWeek}요일`;
};

// 시간 포맷 (HH:mm)
export const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
    });
};

// 시간 차이 계산
export const calculateDuration = (from: string, to: string): string => {
    const durationMs = new Date(to).getTime() - new Date(from).getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    return hours > 0 ? ` (${hours}시간)` : '';
};

// 같은 날짜 확인
export const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
};

// 날짜/시간 표시 문자열 생성
export const formatReservationPeriod = (from: string, to: string): string => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    
    if (isSameDay(fromDate, toDate)) {
        const dateStr = formatFullDateTime(from);
        const startTime = formatTime(from);
        const endTime = formatTime(to);
        const duration = calculateDuration(from, to);
        return `${dateStr}\n${startTime} ~ ${endTime}${duration}`;
    }
    
    const fromDateStr = formatFullDateTime(from);
    const toDateStr = formatFullDateTime(to);
    return `${fromDateStr}\n ~\n${toDateStr}`;
};
