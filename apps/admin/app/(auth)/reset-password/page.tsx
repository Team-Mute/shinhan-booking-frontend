"use client";

import React, { useState } from "react";
import styled from "@emotion/styled";
import Input from "@components/ui/input/Input";
import Button from "@components/ui/button/Button";
import Loader from "@admin/components/Loader";
import { useRouter } from "next/navigation";
import { useModalStore } from "@admin/store/modalStore";
import { resetAdminPasswordApi } from "@admin/lib/api/admin";

export default function ResetPWPage() {
  const { open } = useModalStore();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const router = useRouter();

  const validateEmail = (value: string) => {
    const isValid = /\S+@\S+\.\S+/.test(value);
    setIsEmailValid(isValid); // ✅ 여기 추가

    setEmailError(!value ? "" : isValid ? "" : "이메일 형식이 맞지 않습니다.");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handleResetPW = async () => {
    try {
      const response = await resetAdminPasswordApi({ userEmail: email });

      if (response.status === 200) {
        open(
          "안내",
          "임시 비밀번호가 발송되었습니다.\n다시 로그인해주세요.",
          () => {
            router.push("/");
          }
        );
      }
    } catch (err: any) {
      if (err) {
        open("안내", "비밀번호 재설정 링크 전송에 실패했습니다.");
      }
    } finally {
    }
  };

  return (
    <Container>
      <Loader>
        <GreetingText>비밀번호 찾기</GreetingText>

        <LoginForm onSubmit={(e) => e.preventDefault()}>
          <InputWrapper>
            <Input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && <ErrorText>{emailError}</ErrorText>}
          </InputWrapper>
          <InfoText>
            가입시 사용한 이메일 주소를 입력해주시면 비밀번호 재설정 링크를
            보내드려요.
          </InfoText>

          <Button
            type="submit"
            isActive={isEmailValid}
            disabled={!isEmailValid}
            onClick={handleResetPW}
          >
            비밀번호 재설정 링크 보내기
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

const ErrorText = styled.p`
  color: red;
  font-size: 12px;
  margin-top: 4px;
  padding-left: 4px;
`;
