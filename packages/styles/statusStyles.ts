// apps/admin/styles/statusStyles.ts

import { css } from '@emotion/react';

/**
 * 예약 상태 ID별 색상 정의
 */
export const STATUS_COLORS = {
  1: { bg: '#FFFCF2', text: '#FFBB00' }, // 1차 승인 대기
  2: { bg: '#FFF8F2', text: '#FF7300' }, // 2차 승인 대기
  3: { bg: '#F2FBF8', text: '#34C759' }, // 최종 승인 완료
  4: { bg: '#FCF2FF', text: '#C800FF' }, // 반려
  5: { bg: '#F0F1F5', text: '#8496C5' }, // 이용 완료
  6: { bg: '#F3F4F4', text: '#8E8E93' }, // 예약 취소
} as const;

/**
 * 예약 상태 이름별 색상 정의 (정적 폴백)
 */
export const STATUS_COLORS_BY_NAME = {
  '1차 승인 대기': { bg: '#FFFCF2', text: '#FFBB00' },
  '2차 승인 대기': { bg: '#FFF8F2', text: '#FF7300' },
  '최종 승인 완료': { bg: '#F2FBF8', text: '#34C759' },
  '반려': { bg: '#FCF2FF', text: '#C800FF' },
  '이용 완료': { bg: '#F0F1F5', text: '#8496C5' },
  '예약 취소': { bg: '#F3F4F4', text: '#8E8E93' },
  '긴급': { bg: '#FFF2F2', text: '#FF0000' },
  '신한': { bg: '#F2F6FF', text: '#0046FF' },
} as const;

/**
 * Dot 색상만 필요한 경우 (CalendarGrid 등)
 */
export const DOT_COLORS = {
  '1차 승인 대기': '#FFBB00',
  '2차 승인 대기': '#FF7300',
  '최종 승인 완료': '#34C759',
  '이용 완료': '#8496C5',
  '긴급': '#FF0000',
  '신한': '#0046FF',
  '예약 취소': '#8E8E93',
  '반려': '#C800FF',
} as const;

/**
 * 예약 상태 ID에 따라 배경색과 텍스트 색상을 포함하는 CSS 스타일을 반환합니다.
 * 이 스타일은 주로 상태 태그/뱃지 UI 컴포넌트에 사용됩니다.
 *
 * @param statusId 예약 상태를 나타내는 숫자 ID (1: 1차 승인 대기, 2: 2차 승인 대기 등).
 * @returns Styled Components의 `css` 템플릿 리터럴.
 */
export const getStatusStyle = (statusId: number) => {
  const colors = STATUS_COLORS[statusId as keyof typeof STATUS_COLORS];
  if (!colors) {
    return css`background-color: #f5f5f5; color: #757575;`;
  }
  return css`background-color: ${colors.bg}; color: ${colors.text};`;
};

/**
 * 상태 이름으로 배경색 반환
 */
export const getStatusBgColor = (statusName: string): string => {
  const colors = STATUS_COLORS_BY_NAME[statusName as keyof typeof STATUS_COLORS_BY_NAME];
  return colors?.bg || '#F3F4F4';
};

/**
 * 상태 이름으로 텍스트 색상 반환
 */
export const getStatusColor = (statusName: string): string => {
  const colors = STATUS_COLORS_BY_NAME[statusName as keyof typeof STATUS_COLORS_BY_NAME];
  return colors?.text || '#8C8F93';
};

/**
 * 상태 이름으로 Dot 색상 반환
 */
export const getDotColor = (statusName: string): string => {
  return DOT_COLORS[statusName as keyof typeof DOT_COLORS] || '#8C8F93';
};