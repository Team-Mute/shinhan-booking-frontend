"use client";

import React, { useState } from "react";
import styled from "@emotion/styled";
import Input from "@components/ui/input/Input";
import Button from "@components/ui/button/Button";
import Loader from "@admin/components/Loader";
import { adminLoginApi } from "@admin/lib/api/adminAuth";
import { useRouter } from "next/navigation";
import { useModalStore } from "@admin/store/modalStore";
import { useApiErrorHandler } from "@admin/lib/hooks/useApiErrorHandler";
import { isValidEmail } from "@admin/lib/validators/email";

export default function LoginPage() {
  const { open } = useModalStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleError = useApiErrorHandler();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  };

  const handleLogin = async () => {
    try {
      await adminLoginApi(email, password);
      router.push("/");
    } catch (err: any) {
      if (err?.status === 401) {
        open("안내", "로그인에 실패했습니다.");
      } else {
        handleError(err);
      }
    }
  };

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

          <InputWrapper>
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={handlePasswordChange}
            />
          </InputWrapper>

          <FindPasswordButton
            type="button"
            onClick={() => {
              router.push("/reset-password");
            }}
          >
            비밀번호 찾기
          </FindPasswordButton>
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
