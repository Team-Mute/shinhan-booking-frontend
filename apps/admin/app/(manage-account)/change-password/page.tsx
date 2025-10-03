"use client";

import React, { useState } from "react";
import styled from "@emotion/styled";
import Input from "@components/ui/input/Input";
import Button from "@components/ui/button/Button";
import Loader from "@admin/components/Loader";
import { useRouter } from "next/navigation";
import { useModalStore } from "@admin/store/modalStore";
import { isValidPassword } from "@admin/lib/validators/password";

import { updateAdminPasswordApi } from "@admin/lib/api/admin";
import { useLogout } from "@admin/lib/hooks/useLogout";

export default function ChangePWPage() {
  const { open } = useModalStore();
  const { logout } = useLogout();

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  };
  const router = useRouter();
  const isFormValid =
    password.trim() !== "" &&
    isValidPassword(newPassword) &&
    newPassword === confirmPassword;

  const handleSubmit = async () => {
    try {
      const response = await updateAdminPasswordApi({
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

    if (!isFormValid) return;
  };

  return (
    <Container>
      <Loader>
        <GreetingText>비밀번호 재설정</GreetingText>

        <LoginForm onSubmit={(e) => e.preventDefault()}>
          <InputWrapper>
            <Input
              type="password"
              placeholder="현재 비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputWrapper>
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

          <Button
            type="submit"
            isActive={isFormValid}
            disabled={!isFormValid}
            onClick={handleSubmit}
          >
            비밀번호 재설정하기
          </Button>
        </LoginForm>
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

const GreetingText = styled.h2`
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

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 12px;
`;
