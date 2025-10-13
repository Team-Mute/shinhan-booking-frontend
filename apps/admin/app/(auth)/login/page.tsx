"use client";

import React from "react";
import styled from "@emotion/styled";
import Input from "@components/ui/input/Input";
import Button from "@components/ui/button/Button";
import Loader from "@admin/components/Loader";
import { useRouter } from "next/navigation";
import { isValidEmail } from "@admin/lib/validators/email";
import { useLogin } from "./hooks/useLogin";

export default function LoginPage() {
  const {
    password,
    email,
    handleEmailChange,
    handlePasswordChange,
    handleLogin,
  } = useLogin();
  const router = useRouter();

  return (
    <Container>
      <Loader>
        <GreetingText>
          안녕하세요,
          <br />
          신한금융희망재단입니다.
        </GreetingText>

        <LoginForm
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
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

          {/* 비밀번호 입력 */}
          <InputWrapper>
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={handlePasswordChange}
            />
          </InputWrapper>

          {/* 비밀번호 찾기 버튼 */}
          <FindPasswordButton
            type="button"
            onClick={() => {
              router.push("/reset-password");
            }}
          >
            비밀번호 찾기
          </FindPasswordButton>

          {/* 로그인 버튼 */}
          <Button
            type="submit"
            isActive={isValidEmail(email) && !!password}
            disabled={!(isValidEmail(email) && !!password)}
          >
            로그인
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

const FindPasswordButton = styled.button`
  background: none;
  border: none;
  color: #555;
  font-size: 14px;
  cursor: pointer;
  align-self: flex-end;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 12px;
  width: 22rem;
`;
