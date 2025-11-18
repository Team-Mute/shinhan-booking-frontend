"use client";

import React from "react";
import styled from "@emotion/styled";
import { Button, Selectbox2 } from "@components";
import Loader from "@admin/components/Loader";
import { useSignup } from "../hooks/useSignup";
import { ROLES } from "@admin/lib/constants/roles";

/**
 * SignupRolePage 컴포넌트
 * ----------------------------
 * 회원가입 두 번째 페이지
 *
 * @description
 * - 권한과 지역을 설정
 * - 상태 및 비즈니스 로직은 useSignup 훅에서 관리.
 */
export default function SignupRolePage() {
  const { role, setRole, region, setRegion, regionOptions, handleComplete } =
    useSignup();

  // 버튼 활성화 조건: role이 설정되었고, region이 빈 문자열이 아닐 때만 활성화 (null 또는 "전지역"은 활성화)
  const isButtonActive = !!role && region !== "";

  return (
    <Container>
      <Loader>
        <TitleText>관리할 권한과 지역을 설정하세요</TitleText>
        <RoleForm>
          {/* 권한 설정 */}
          <Selectbox2
            options={ROLES}
            value={role}
            onChange={setRole}
            placeholder="권한 설정"
          />

          <Gap />
          {/* 관리 지역 선택 */}
          {role === "0" ? (
            <DisabledText>관리 지역 없음</DisabledText>
          ) : (
            <Selectbox2
              options={regionOptions}
              value={region}
              onChange={setRegion}
              placeholder="관리지역 선택"
              // 2차 승인자(role === "1")는 지역 선택이 "전지역"으로 고정되어야 함
              disabled={role === "1"}
            />
          )}
          {/* 완료 버튼 */}
          <ButtonWrapper>
            <Button
              type="button"
              isActive={isButtonActive}
              onClick={handleComplete}
              disabled={!isButtonActive}
            >
              회원가입 완료
            </Button>
          </ButtonWrapper>
        </RoleForm>
      </Loader>
    </Container>
  );
}

// --- styled ---
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

const DisabledText = styled.div`
  padding: 12px;
  background-color: #f5f5f5;
  color: #999;
  border-radius: 8px;
  text-align: center;
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
