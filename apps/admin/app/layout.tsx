import { ReactNode } from "react";
import EmotionProvider from "./_providers/EmotionProvider";
import HeaderDesktop from "../components/HeaderDesktop";
import HeaderMobile from "../components/HeaderMobile";
import LayoutManager from "./_providers/LayoutManager";

/**
 * 페이지 메타데이터
 * ----------------
 * title: 브라우저 탭 제목
 * description: 페이지 설명 (SEO용)
 * icons: 사이트/페이지 아이콘 경로
 */
export const metadata = {
  title: "신한금융희망재단 공간 예약 관리자 페이지",
  description: "admin",
  icons: { icon: "/logo/shc_symbol.svg" },
};

/**
 * RootLayout 컴포넌트
 * -------------------
 * 앱 전체의 HTML 구조를 정의하고,
 * 모든 페이지에서 공통적으로 사용되는 레이아웃과 스타일 제공.
 *
 * 1. <html>/<body> : 최상위 DOM 구조
 * 2. EmotionProvider : Emotion CSS-in-JS 환경 제공
 * 3. HeaderDesktop : 데스크탑 전용 헤더 렌더링
 * 4. HeaderMobile  : 모바일 전용 헤더 렌더링
 * 5. LayoutManager : 페이지별 레이아웃 관리
 * 6. {children} : 실제 페이지 콘텐츠가 여기에 들어감
 *
 * @param children - 각 페이지의 실제 콘텐츠
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <EmotionProvider>
          <HeaderDesktop />
          <HeaderMobile />
          <LayoutManager>{children}</LayoutManager>
        </EmotionProvider>
      </body>
    </html>
  );
}
