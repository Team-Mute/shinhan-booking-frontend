import { redirect } from "next/navigation";

/**
 * ---------------------------------------------
 * 관리자 루트 페이지
 *
 * 기본 메인 페이지가 /dashboard이므로 별도의 콘텐츠 렌더링 없이 비워둠
 * AdminProvider에서 라우팅 로직이 처리됨
 *
 */

export default function AdminHomePage() {
  return null;
}
