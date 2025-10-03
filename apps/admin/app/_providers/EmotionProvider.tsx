"use client";

import { Global } from "@emotion/react";
import { ReactNode } from "react";
import { globalStyles } from "@styles/global";

/**
 * EmotionProvider 컴포넌트
 * --------------------------
 * 앱 전체에서 Emotion 스타일을 적용하기 위한 최상위 프로바이더.
 * 모든 하위 컴포넌트에서 styled 또는 css prop을 사용할 수 있도록 환경을 제공.
 *
 * 1. <Global styles={globalStyles} /> : 전역 CSS 스타일 적용
 * 2. {children} : Emotion 환경이 적용된 하위 컴포넌트 렌더링
 *
 * @param children - Emotion 환경이 적용될 페이지 또는 하위 컴포넌트
 */
export default function EmotionProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <Global styles={globalStyles} />
      {children}
    </>
  );
}
