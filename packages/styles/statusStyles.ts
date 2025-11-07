import { css } from '@emotion/react';

/**
 * 예약 상태 ID에 따라 배경색과 텍스트 색상을 포함하는 CSS 스타일을 반환합니다.
 * 이 스타일은 주로 상태 태그/뱃지 UI 컴포넌트에 사용됩니다.
 *
 * @param statusId 예약 상태를 나타내는 숫자 ID (1: 1차 승인 대기, 2: 2차 승인 대기 등).
 * @returns Styled Components의 `css` 템플릿 리터럴.
 */
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