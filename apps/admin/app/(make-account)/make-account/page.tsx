"use client";

import React from "react";
import styled from "@emotion/styled";
import colors from "@styles/theme";
import { Button, Input } from "@components";
import { isValidEmail } from "@admin/lib/validators/email";
import { isValidPhone } from "@admin/lib/validators/phone";
import { useSignupRole } from "./hooks/useSignupRole";

/**
 * SignupPage 컴포넌트
 * ----------------------------
 * 회원가입 첫 페이지(UI)
 * - 이름, 전화번호, 이메일 입력
 * - 입력값 검증 및 다음 버튼 활성화
 *
 * @remarks
 * - 상태 및 로직은 useSignupRole 훅에서 관리
 * - View는 UI 렌더링에만 집중
 */
export default function SignupPage() {
  const {
    name,
    handleNameChange,
    phone,
    handlePhoneChange,
    email,
    handleEmailChange,
    isFormValid,
    handleSignUpClick,
  } = useSignupRole();

  return (
    <Container>
      <TitleText>회원가입</TitleText>

      <SignupForm>
        {/* 이름 입력 */}
        <Wrapper>
          <Input placeholder="이름" value={name} onChange={handleNameChange} />
        </Wrapper>
        {/* 전화번호 입력 */}
        <Wrapper>
          <Input
            placeholder="전화번호 ( - 제외)"
            infoMessage={isValidPhone(phone) ? "" : undefined}
            value={phone}
            onChange={handlePhoneChange}
            errorMessage={
              phone && !isValidPhone(phone)
                ? "전화번호는 11자리 이하 숫자만 적어주세요"
                : ""
            }
          />
        </Wrapper>
        {/* 이메일 입력 */}
        <Wrapper>
          <Input
            placeholder="이메일"
            infoMessage={isValidEmail(email) ? "" : undefined}
            value={email}
            onChange={handleEmailChange}
            errorMessage={
              email && !isValidEmail(email)
                ? "이메일 형식이 맞지 않습니다."
                : ""
            }
          />
        </Wrapper>
        {/* 다음 버튼 */}
        <ButtonWrapper>
          <Button
            type="button"
            isActive={isFormValid()}
            onClick={handleSignUpClick}
            disabled={!isFormValid()}
          >
            다음
          </Button>
        </ButtonWrapper>
      </SignupForm>
    </Container>
  );
}

// --- styled ---
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  //   padding: 40px 20px;
  padding-top: 24px;
`;

const TitleText = styled.h2`
  font-size: 24px;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 24px;
  font-weight: 500;
`;

const SignupForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 12px;
  flex-direction: column;
`;

const ButtonWrapper = styled.div`
  margin-top: 32px;
  margin-bottom: 24px;
`;
