"use client";

import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import colors from "@styles/theme";
import { Button, Input } from "@components";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@admin/store/adminAuthStore";

export default function SignupPage() {
  const router = useRouter();

  // 입력 값
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [emailInfoMsg, setEmailInfoMsg] = useState(
    "정확한 이메일 주소를 입력해주세요."
  );

  const [phoneErrorMsg, setPhoneErrorMsg] = useState("");
  const [phoneInfoMsg, setPhoneInfoMsg] =
    useState("전화번호는 숫자만 적어주세요.");

  const setAdminSignUpData = useAdminAuthStore(
    (state) => state.setAdminSignUpData
  );

  // 버튼 클릭 핸들러
  const handleSignUpClick = () => {
    // 1. 입력한 정보를 store에 저장
    setAdminSignUpData({
      roleId: 0,
      regionName: "",
      userEmail: email,
      userName: name,
      userPhone: phone,
    });

    // 2. 권한 생성 페이지로 이동
    router.push("/make-account/role");
  };

  // 이메일 검증
  const validateEmail = (value: string) => {
    const isValid = /\S+@\S+\.\S+/.test(value);
    setEmailErrorMsg(!isValid ? "이메일 형식이 올바르지 않아요" : "");
    if (isValid) {
      setEmailInfoMsg("");
    }
  };

  // 휴대번호 검증
  const validatePhone = (value: string) => {
    const isValid = /^\d{10,11}$/.test(value);
    setPhoneErrorMsg(!isValid ? "전화번호는 숫자만 적어주세요" : "");
    if (isValid) {
      setPhoneInfoMsg("");
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    validatePhone(value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  // 폼 유효성 검사
  const isFormValid = () => {
    // 모든 필수 입력값이 채워졌는지 확인
    // 에러 메시지가 없는지 확인

    return Boolean(name && email && phone);
  };

  return (
    <Container>
      <TitleText>회원가입</TitleText>
      <SignupForm>
        <Wrapper>
          <Input
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Wrapper>
        <Wrapper>
          <Input
            placeholder="전화번호"
            infoMessage={!phoneErrorMsg ? phoneInfoMsg : undefined}
            value={phone}
            onChange={handlePhoneChange}
            errorMessage={phoneErrorMsg}
          />
        </Wrapper>
        <Wrapper>
          <Input
            placeholder="이메일"
            infoMessage={!emailErrorMsg ? emailInfoMsg : undefined}
            value={email}
            onChange={handleEmailChange}
            errorMessage={emailErrorMsg}
          />
        </Wrapper>

        <ButtonWrapper>
          <Button
            type="button"
            isActive={isFormValid()}
            onClick={handleSignUpClick}
          >
            다음
          </Button>
        </ButtonWrapper>
      </SignupForm>
    </Container>
  );
}

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
  display: flex;
  margin-bottom: 12px;
  flex-direction: column;
`;

const CheckboxWrapper = styled.div`
  width: 100%;
  max-width: 353px;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 8px;
`;

const Divider = styled.hr`
  width: 353px;
  height: 1px;
  background-color: ${colors.graycolor10}; // 테마에 정의된 얇은 회색 선
  border: none;
  margin-top: 3px;
  margin-bottom: 12px;
`;

const ButtonWrapper = styled.div`
  margin-top: 32px;
  margin-bottom: 24px;
`;
