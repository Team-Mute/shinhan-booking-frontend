import { css } from "@emotion/react";
import colors from "./theme";

export const globalStyles = css`
  :root {
    --header-height: 3.75rem;
  }

  /* 폰트 설정 */
  @font-face {
    font-family: "Pretendard";
    src: url("/fonts/Pretendard-Thin.woff2") format("woff2");
    font-weight: 100;
    font-style: normal;
  }

  @font-face {
    font-family: "Pretendard";
    src: url("/fonts/Pretendard-ExtraLight.woff2") format("woff2");
    font-weight: 200;
    font-style: normal;
  }

  @font-face {
    font-family: "Pretendard";
    src: url("/fonts/Pretendard-Light.woff2") format("woff2");
    font-weight: 300;
    font-style: normal;
  }

  @font-face {
    font-family: "Pretendard";
    src: url("/fonts/Pretendard-Regular.woff2") format("woff2");
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: "Pretendard";
    src: url("/fonts/Pretendard-Medium.woff2") format("woff2");
    font-weight: 500;
    font-style: normal;
  }

  @font-face {
    font-family: "Pretendard";
    src: url("/fonts/Pretendard-SemiBold.woff2") format("woff2");
    font-weight: 600;
    font-style: normal;
  }

  @font-face {
    font-family: "Pretendard";
    src: url("/fonts/Pretendard-Bold.woff2") format("woff2");
    font-weight: 700;
    font-style: normal;
  }

  @font-face {
    font-family: "Pretendard";
    src: url("/fonts/Pretendard-ExtraBold.woff2") format("woff2");
    font-weight: 800;
    font-style: normal;
  }

  @font-face {
    font-family: "Pretendard";
    src: url("/fonts/Pretendard-Black.woff2") format("woff2");
    font-weight: 900;
    font-style: normal;
  }

  /* reset 기본 세팅 */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html,
  body {
    height: 100%;
    font-family: "Pretendard", sans-serif;
    color: ${colors.graycolor100};
    line-height: 1.5;
  }

  body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    font: inherit;
    background: none;
    border: none;
    cursor: pointer;
  }
`;
