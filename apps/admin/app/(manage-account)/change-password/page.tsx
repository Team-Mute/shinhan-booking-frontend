"use client";

import React from "react";
import styled from "@emotion/styled";
import Input from "@components/ui/input/Input";
import Button from "@components/ui/button/Button";
import Loader from "@admin/components/Loader";
import { isValidPassword } from "@admin/lib/validators/password";
import { useChangePW } from "./hooks/useChangePW";

/**
 * ChangePWPage 컴포넌트
 * ----------------------
 * 관리자 비밀번호 재설정 페이지.
 *
 * @description
 * - 관리자는 현재 비밀번호를 입력하고 새 비밀번호를 설정가능.
 * - 상태 및 비즈니스 로직은 useChangePW 훅에서 관리.
 */
export default function ChangePWPage() {
  const {
    password,
    setPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isFormValid,
    handleSubmit,
  } = useChangePW();

  return (
    <Container>
      <Loader>
        <TitleText>비밀번호 재설정</TitleText>

        <Form onSubmit={(e) => e.preventDefault()}>
          {/* 현재 비밀번호 입력 */}
          <InputWrapper>
            <Input
              type="password"
              placeholder="현재 비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputWrapper>

          {/* 새 비밀번호 입력 */}
          <InputWrapper>
            <Input
              type="password"
              placeholder="새 비밀번호 입력"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              errorMessage={
                newPassword && !isValidPassword(newPassword)
                  ? "8자 이상, 숫자와 특수문자를 입력해주세요"
                  : ""
              }
            />
          </InputWrapper>

          {/* 새 비밀번호 확인 */}
          <InputWrapper>
            <Input
              type="password"
              placeholder="새 비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              errorMessage={
                confirmPassword && newPassword !== confirmPassword
                  ? "비밀번호가 일치하지 않아요"
                  : undefined
              }
            />
          </InputWrapper>

          {/* 제출 버튼 */}
          <Button
            type="submit"
            isActive={isFormValid}
            disabled={!isFormValid}
            onClick={handleSubmit}
          >
            비밀번호 재설정하기
          </Button>
        </Form>
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

const Form = styled.form`
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

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 12px;
  width: 353px;
`;
