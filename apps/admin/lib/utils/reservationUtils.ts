import { css } from '@emotion/react';

export const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    return `${year}년 ${month}월 ${day}일 (${weekday})`;
};

export const formatTimeRange = (fromStr: string, toStr: string): string => {
    const fromDate = new Date(fromStr);
    const toDate = new Date(toStr);
    const fromHours = fromDate.getHours().toString().padStart(2, '0');
    const fromMinutes = fromDate.getMinutes().toString().padStart(2, '0');
    const toHours = toDate.getHours().toString().padStart(2, '0');
    const toMinutes = toDate.getMinutes().toString().padStart(2, '0');
    return `${fromHours}:${fromMinutes}~${toHours}:${toMinutes}`;
};

export const getStatusStyle = (statusId: number) => {
    switch (statusId) {
        case 1: // 1차 승인 대기
            return css`background-color: #FFFCF2; color: #FFBB00;`;
        case 2: // 2차 승인 대기
            return css`background-color: #FFF8F2; color: #FF7300;`;
        case 3: // 최종 승인 완료
            return css`background-color: #F2FBF8; color: #34C759;`;
        case 4: // 반려
            return css`background-color: #FCF2FF; color: #C800FF;`;
        case 5: // 예약 취소
            return css`background-color: #F3F4F4; color: #8E8E93;`;
        case 6: // 이용 완료
            return css`background-color: #F0F1F5; color: #8496C5;`;
        default:
            return css`background-color: #f5f5f5; color: #757575;`;
    }
};