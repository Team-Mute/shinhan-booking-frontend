import { redirect } from "next/navigation";

/**
 * ---------------------------------------------
 * 관리자 루트 페이지
 *
 * 역할:
 * 1. 관리자가 /admin 경로로 접근하면 자동으로 /dashboard로 리다이렉트
 * 2. 실제 UI는 없으며 서버 측에서 바로 리다이렉트 처리
 *
 * Next.js App Router의 redirect()를 사용하여 서버 측에서 즉시 이동
 */

export default function AdminHomePage() {
  redirect("/dashboard");
}
