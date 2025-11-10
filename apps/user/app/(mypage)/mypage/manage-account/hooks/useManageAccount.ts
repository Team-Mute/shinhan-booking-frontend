import { getAccountApi } from "@user/lib/api/user";
import { AccountResponse } from "@user/types/user.dto";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * useManageAccount 훅
 * ----------------------------
 * 사용자 계정 정보 확인 페이지 훅
 *
 * @description
 * - ManageAccountPage의 상태 및 로직(ViewModel)을 관리.
 * - 계정 정보 조회 및 비밀번호 변경 처리.
 */
export function useManageAccount() {
  const [accountInfo, setAccountInfo] = useState<AccountResponse | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await getAccountApi();
        setAccountInfo(response);
      } catch (err) {
        console.error("계정 정보 불러오기 실패:", err);
      }
    };
    fetchAccount();
  }, []);

  const handleChangePassword = () => {
    router.push("/mypage/change-password");
  };

  const mapRoleId = (roleId: number) => {
    switch (roleId) {
      case 0:
        return "마스터 계정";
      case 1:
        return "2차 관리자";
      case 2:
        return "1차 관리자";
      default:
        return "알 수 없음";
    }
  };

  return {
    accountInfo,
    handleChangePassword,
    mapRoleId,
  };
}
