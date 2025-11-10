import { useModalStore } from "@user/store/modalStore";

export function useApiErrorHandler() {
  const { open } = useModalStore();

  return (error: any) => {
    // axios에서 붙인 customMessage 사용
    const message = error.customMessage || "알 수 없는 오류가 발생했습니다.";
    open("안내", message);
  };
}
