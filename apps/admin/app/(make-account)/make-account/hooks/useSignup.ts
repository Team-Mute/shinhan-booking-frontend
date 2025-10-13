"use client";

import { useEffect, useState } from "react";
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
 * SignupPage와 SignupRolePage의 상태 및 로직(ViewModel)을 관리.
 *
 * 책임:
 * 1. 권한(role)과 지역(region) 상태 관리.
 * 2. 권한 변경에 따른 지역 옵션 자동 업데이트.
 * 3. 회원가입 완료 처리 (API 연동 및 라우팅).
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
  const [region, setRegion] = useState("");
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
        const options = res.map((r: Region) => ({
          label: r.regionName,
          value: r.regionName,
        }));
        setRegionOptions(options);
        setFirstLevelRegions(options);
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
      setRegionOptions(firstLevelRegions);
    } else if (role === "1") {
      setRegionOptions(secondLevelRegions);
      setRegion("전지역");
    }
  }, [role]);

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
      const updatedAdminSignupData = {
        ...adminSignUpData,
        roleId: Number(role),
        regionName: region,
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
