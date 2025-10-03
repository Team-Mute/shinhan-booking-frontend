const breakpoints = {
  mobile: "767px",
  tablet: "1023px",
  desktop: "1280px",
};

/*
 * - max-width: 해당 값 이하에서 스타일 적용 (mobile-first)
 * - min-width: 해당 값 이상에서 스타일 적용 (desktop-first)
 */

export const media = {
  // 화면 최대 너비가 breakpoints.mobile 이하일 때
  mobile: `@media (max-width: ${breakpoints.mobile})`,

  // 화면 최대 너비가 breakpoints.mobile 이상일 때
  mobileUp: `@media (min-width: ${breakpoints.mobile})`,

  // 화면 최대 너비가 breakpoints.tablet 이하일 때
  tablet: `@media (max-width: ${breakpoints.tablet})`,

  // 화면 최소 너비가 breakpoints.desktop 이상일 때
  desktop: `@media (min-width: ${breakpoints.desktop})`,
};

export default breakpoints;
