"use client";

import React, { useState } from "react";
import styled from "@emotion/styled";
import Input from "@components/ui/input/Input";
import Button from "@components/ui/button/Button";
import Loader from "@admin/components/Loader";
import { useModalStore } from "@admin/store/modalStore";
import { isValidPassword } from "@admin/lib/validators/password";

import { updatePasswordApi } from "@admin/lib/api/admin";
import { useLogout } from "@admin/lib/hooks/useLogout";

/**
 * ChangePWPage 컴포넌트
 * ----------------------
 * 관리자 비밀번호 재설정 페이지.
 * 사용자는 현재 비밀번호를 입력하고 새 비밀번호를 설정가능.
 *
 * 기능 요약:
 * 1. 비밀번호 유효성 검사 – `isValidPassword()`로 새 비밀번호 규칙(8자 이상, 숫자·특수문자 포함) 확인.
 * 2. 입력 폼 상태 관리 – 현재 비밀번호, 새 비밀번호, 새 비밀번호 확인 값을 `useState`로 관리.
 * 3. 비밀번호 일치 검사 – 새 비밀번호와 확인 비밀번호가 동일한지 비교.
 * 4. API 연동 – `updatePasswordApi` 호출로 서버에 비밀번호 변경 요청.
 * 5. 결과 안내 – `useModalStore`로 성공/오류 모달 표시 후, 성공 시 `logout()` 실행.
 *
 * @remarks
 * - 새 비밀번호는 보안 규칙에 맞아야 하며, 일치하지 않으면 오류 메시지를 표시.
 * - 변경 성공 시 로그인 페이지로 이동하도록 로그아웃 처리.
 */
export default function ChangePWPage() {
  const { open } = useModalStore();
  const { logout } = useLogout();

  // --- 폼 상태 관리 ---
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // --- 입력값 유효성 검사 ---
  const isFormValid =
    password.trim() !== "" &&
    isValidPassword(newPassword) &&
    newPassword === confirmPassword;

  /**
   * 비밀번호 변경 요청 처리
   * -----------------------
   * 1. `updatePasswordApi`로 서버에 변경 요청
   * 2. 성공 시 모달 표시 및 로그아웃 후 로그인 페이지로 이동
   * 3. 500 오류 시 "현재 비밀번호 불일치" 안내 모달 표시
   */
  const handleSubmit = async () => {
    // 폼 유효성 미충족 시 종료
    if (!isFormValid) return;

    try {
      await updatePasswordApi({
        password: password,
        newPassword: newPassword,
      });

      open(
        "비밀번호 재설정 완료",
        "비밀번호가 재설정 완료되었습니다.\n다시 로그인 해주세요.",
        () => {
          logout();
        }
      );
    } catch (err) {
      if (err.status === 500) {
        open("안내", "현재 비밀번호가 일치하지 않습니다.");
      }
    }
  };

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
