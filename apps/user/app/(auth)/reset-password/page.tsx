"use client";

import React from "react";
import styled from "@emotion/styled";
import Input from "@components/ui/input/Input";
import Button from "@components/ui/button/Button";
import Loader from "@user/components/Loader";
import { isValidEmail } from "@user/lib/validators/email";
import { useResetPassword } from "./hooks/useResetPassword";

/**
 * ResetPWPage 컴포넌트
 * ----------------------------
 * 사용자 비밀번호 재설정 페이지
 * - 이메일 입력 폼 제공
 * - 상태 및 비즈니스 로직은 useResetPassword 훅에서 관리
 */
export default function ResetPWPage() {
  const { email, handleEmailChange, handleResetPW } = useResetPassword();
  return (
    <Container>
      <Loader>
        <TitleText>비밀번호 찾기</TitleText>

        <LoginForm onSubmit={(e) => e.preventDefault()}>
          {/* 이메일 입력 */}
          <InputWrapper>
            <Input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={handleEmailChange}
              errorMessage={
                email && !isValidEmail(email)
                  ? "이메일 형식이 맞지 않습니다."
                  : ""
              }
            />
          </InputWrapper>
          {/* 설명 텍스트 */}
          <InfoText>
            가입시 사용한 이메일 주소를 입력해주시면 비밀번호 재설정 링크를
            보내드려요.
          </InfoText>

          {/* 비밀번호 재설정 버튼 */}
          <Button
            type="submit"
            isActive={isValidEmail(email)}
            disabled={!isValidEmail(email)}
            onClick={handleResetPW}
          >
            비밀번호 재설정 링크 보내기
          </Button>
        </LoginForm>
      </Loader>
    </Container>
  );
}

// --- styled ---
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
`;

const TitleText = styled.h2`
  font-size: 24px;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 40px;
  font-weight: 500;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;

  & > input:nth-of-type(2) {
    margin-top: 12px; /* 이메일 → 비밀번호 */
  }

  & > button[type="button"]:first-of-type {
    margin-top: 12px; /* 비밀번호 → 비밀번호 찾기 */
  }

  & > button[type="submit"] {
    margin-top: 32px; /* 비밀번호 찾기 → 로그인 */
  }
`;

const InfoText = styled.p`
  font-size: 12px;
  margin-top: 0.5rem;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 12px;
  width: 353px;
`;
