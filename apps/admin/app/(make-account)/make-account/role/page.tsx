"use client";

import React, { useState } from "react";
import styled from "@emotion/styled";
import { Button, Selectbox2 } from "@components";
import { useRouter } from "next/navigation";
import { adminSignUpApi } from "@admin/lib/api/adminAuth";
import { useAdminAuthStore } from "@admin/store/adminAuthStore";
import Loader from "@admin/components/Loader";
import { useModalStore } from "@admin/store/modalStore";

export default function SignupRolePage() {
  const router = useRouter();
  const { open } = useModalStore();

  const [region, setRegion] = useState("");
  const [role, setRole] = useState("");

  // 관리 지역
  const regions = [
    { label: "서울", value: "서울" },
    { label: "인천", value: "인천" },
    { label: "대구", value: "대구" },
    { label: "대전", value: "대전" },
  ];

  // 권한
  const roles = [
    { label: "1차 승인자", value: "2" },
    { label: "2차 승인자", value: "1" },
    { label: "마스터", value: "0" },
  ];

  const adminSignUpData = useAdminAuthStore((state) => state.adminSignUpData);
  const clearAdminSignUpData = useAdminAuthStore(
    (state) => state.clearAdminSignUpData
  );

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
          "회원가입 완료",
          "환영합니다!\n이제 공간과 예약 관리를 시작해보세요.",
          () => {
            router.push("/make-account"); // 모달 닫히면 이동
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
    } finally {
    }
  };

  return (
    <Container>
      <Loader>
        <TitleText>관리할 지역과 권한을 설정하세요</TitleText>
        <RoleForm>
          <Selectbox2
            options={regions}
            value={region}
            onChange={setRegion}
            placeholder="관리지역 선택"
          />
          <Gap />
          <Selectbox2
            options={roles}
            value={role}
            onChange={setRole}
            placeholder="권한 설정"
          />

          <ButtonWrapper>
            <Button
              type="button"
              isActive={!!region && !!role}
              onClick={handleComplete}
            >
              회원가입 완료
            </Button>
          </ButtonWrapper>
        </RoleForm>
      </Loader>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
`;

const TitleText = styled.h2`
  font-size: 24px;
  line-height: 1.5;
  text-align: center;
  margin-top: 120px;
  margin-bottom: 24px;
  font-weight: 500;
`;

const RoleForm = styled.form`
  display: flex;
  flex-direction: column;
  background-color: white;
`;

const Gap = styled.div`
  display: flex;
  height: 12px;
`;

const ButtonWrapper = styled.div`
  margin-top: 32px;
`;
