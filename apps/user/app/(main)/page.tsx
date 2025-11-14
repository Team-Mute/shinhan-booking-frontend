import { redirect } from "next/navigation";

export default function Home() {
  // 루트 접근 시 /spaces로 리다이렉트
  redirect("/spaces");

  // 이 컴포넌트 자체는 렌더링되지 않음
  return null;
}
