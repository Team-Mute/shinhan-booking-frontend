import styled from "@emotion/styled";
/**
 * GapBox 컴포넌트
 * ---------------
 * CSS의 '간격' 역할을 하는 스타일링된 `div` 컴포넌트.
 *
 * @remarks
 * - 주로 수직 간격(Spacer)을 만들 때 사용되며, props로 받은 'h' 값에 따라 높이가 결정됨.
 * @property {string} h 필수 props: 높이 (예: '1rem', '20px', '5vh' 등).
 */
export const GapBox = styled.div<{ h: string }>`
  height: ${(p) => p.h};
`;
