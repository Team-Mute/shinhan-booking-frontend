"use client";

import { useEffect, useState } from "react";
// ... (생략된 import 구문)
import { useRouter } from "next/navigation";
import { adminSignUpApi } from "@admin/lib/api/adminAuth";
import { useAdminAuthStore } from "@admin/store/adminAuthStore";
import { useModalStore } from "@admin/store/modalStore";
import { Region, RegionListResponse } from "@admin/types/dto/space.dto";
import { getRegionMenuListApi } from "@admin/lib/api/adminSpace";

/**
 * useSignup 훅
 * ----------------------------
 * 관리자 생성 페이지 관련 훅
 * - SignupPage와 SignupRolePage의 상태 및 로직(ViewModel)을 관리.
 *
 * @description
 * - 권한(role)과 지역(region) 상태 관리.
 * - 권한 변경에 따른 지역 옵션 자동 업데이트.
 * - 회원가입 완료 처리 (API 연동 및 라우팅).
 */
export function useSignup() {
  const router = useRouter();
  const { open } = useModalStore();
  const setAdminSignUpData = useAdminAuthStore(
    (state) => state.setAdminSignUpData
  );

  // --- 입력 상태 ---
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  /**
   * @description 이름 입력값 변경
   */
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  /**
   * @description 전화번호 입력값 변경
   */
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  /**
   * @description 이메일 입력값 변경
   */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  /**
   * @description 폼 유효성 검사
   * - 이름, 전화번호, 이메일이 모두 입력되어야 함
   */
  const isFormValid = (): boolean => {
    return Boolean(name && email && phone);
  };

  /**
   * @description 회원가입 버튼 클릭 시 실행
   * - 입력 데이터를 store에 저장
   * - 권한 설정 페이지로 이동
   */
  const handleSignUpClick = () => {
    setAdminSignUpData({
      roleId: 0,
      regionName: "",
      userEmail: email,
      userName: name,
      userPhone: phone,
    });
    router.push("/make-account/role");
  };

  // --- 상태 정의 ---
  const [region, setRegion] = useState(""); // 초기값은 빈 문자열
  const [role, setRole] = useState("");
  const [regionOptions, setRegionOptions] = useState<
    { label: string; value: string }[]
  >([]);

  // --- 스토어 접근 ---
  const adminSignUpData = useAdminAuthStore((state) => state.adminSignUpData);
  const clearAdminSignUpData = useAdminAuthStore(
    (state) => state.clearAdminSignUpData
  );

  // --- 지역 옵션 정의 ---
  /**
   * @description
   * API로 지역 목록 불러오기
   */
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res: RegionListResponse = await getRegionMenuListApi();

        // ⭐️ 수정 사항: API 응답에서 '전지역'이 있다면 1차 승인자 목록에서 제외합니다.
        const filteredRegions = res.filter((r) => r.regionName !== "전지역");

        const options = filteredRegions.map((r: Region) => ({
          label: r.regionName,
          value: r.regionName,
        }));

        setRegionOptions(options);
        setFirstLevelRegions(options); // 1차 승인자 목록도 필터링된 목록으로 설정
      } catch (err) {
        console.error("지역 목록 로드 실패", err);
        setRegionOptions([]);
        setFirstLevelRegions([]);
      }
    };
    fetchRegions();
  }, []);

  const [firstLevelRegions, setFirstLevelRegions] = useState<
    { label: string; value: string }[]
  >([]);

  // 2차 승인자용 "전지역" 옵션 (서버에 regionName으로 "전지역"을 보냄)
  const secondLevelRegions = [{ label: "전지역", value: "전지역" }];

  /**
   * @description
   * 등급 선택 시 관리 지역 목록 업데이트
   */
  useEffect(() => {
    if (role === "0") {
      setRegion("관리 지역 없음");
      setRegionOptions([]);
    } else if (role === "2") {
      // 1차 승인자 (지역 선택 필요)
      // firstLevelRegions는 이미 "전지역"이 제거된 상태이므로 "전지역"이 보이지 않습니다.
      setRegionOptions(firstLevelRegions);
      setRegion(""); // 지역 선택 필드를 다시 비움
    } else if (role === "1") {
      // 2차 승인자 (전지역)
      setRegionOptions(secondLevelRegions);
      setRegion("전지역"); // 2차 승인자는 region을 "전지역"으로 설정
    } else {
      setRegion("");
      setRegionOptions(firstLevelRegions);
    }
  }, [role, firstLevelRegions]);

  /**
   * @description
   * 지역을 먼저 선택할 경우 기본적으로 1차 관리자 지역 표시
   */
  useEffect(() => {
    if (!role && regionOptions.length === 0) {
      setRegionOptions(firstLevelRegions);
    }
  }, [region, role, regionOptions]);

  /**
   * @description
   * 회원가입 완료 처리
   */
  const handleComplete = async () => {
    try {
      // 2차 승인자 (roleId: 1)의 경우 regionName은 "전지역"으로 확정됨
      const regionToSend = region === "전지역" ? "전지역" : region;

      const updatedAdminSignupData = {
        ...adminSignUpData,
        roleId: Number(role),
        regionName: regionToSend, // 수정된 region 값 사용
      };

      const response = await adminSignUpApi(updatedAdminSignupData);
      if (response.status === 201) {
        open(
          "회원 추가 완료",
          "임시 비밀번호가 발송되었습니다.\n관리자에게 이메일 확인을 안내해주세요.",
          () => {
            router.push("/make-account");
          }
        );
        clearAdminSignUpData();
      }
    } catch (error: any) {
      if (error.response?.status === 400 && error.response?.data?.message) {
        open("안내", error.response.data.message);
      } else {
        open("안내", "회원가입 중 오류가 발생했습니다.");
      }
    }
  };

  return {
    // --- SignupPage ---
    name,
    phone,
    email,
    handleNameChange,
    handlePhoneChange,
    handleEmailChange,
    isFormValid,
    handleSignUpClick,

    // --- SignupRolePage ---
    role,
    setRole,
    region,
    setRegion,
    regionOptions,
    handleComplete,
  };
}
