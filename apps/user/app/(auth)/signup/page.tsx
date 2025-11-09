"use client";

import React from "react";
import styled from "@emotion/styled";
import { Input, Checkbox } from "@components/index";
import colors from "@styles/theme";
import Button from "@components/ui/button/Button";
import ScrollModal from "./components/ScrollModal"; // 약관 상세 내용을 보여주는 스크롤 모달
import { useSignup } from "./hooks/useSignup"; // 회원가입 로직 및 상태 관리 훅

import {
  TERMS_OF_SERVICE_HTML,
  PRIVACY_POLICY_HTML,
} from "@user/lib/constants/terms"; // 약관 HTML 내용 상수
import SearchModal from "./components/SearchModal"; // 회사명 검색 모달
import { isValidEmail } from "@user/lib/validators/email"; // 이메일 유효성 검사
import { isValidPassword } from "@user/lib/validators/password"; // 비밀번호 유효성 검사

/**
 * SignupPage 컴포넌트
 * ----------------------
 * 사용자 회원가입 페이지의 메인 컴포넌트.
 *
 * @remarks
 * - useSignup 훅을 통해 모든 폼 상태, 유효성 검사, API 호출 로직을 가져와 사용.
 * - 회사명 검색, 필수 입력, 약관 동의, 비밀번호 검증 등을 처리.
 */
export default function SignupPage() {
  const {
    companyName,
    name,
    email,
    password,
    confirmPassword,

    isShinhan,
    isAllAgreed,
    isTermsOpen,
    isSearchOpen,

    isTermsChecked,
    isPrivacyChecked,
    isEmailAgreed,

    termsContent,
    errors,

    setCompanyName,
    setIsSearchOpen,
    setIsTermsOpen,

    handleCompanyName,
    handleName,
    handleEmailChange,
    handlePasswordChange,
    handleConfirmPasswordChange,

    handleTermsToggle,
    handlePrivacyToggle,
    handleEmailToggle,

    handleScrollModal,
    handleShinhanCheck,
    handleAllAgreeChange,
    handleSignUpClick,
    isFormValid,
  } = useSignup();

  return (
    <Container>
      <TitleText>회원가입</TitleText>
      <SignupForm>
        {/* 회사명 입력 및 신한 재단 여부 체크 */}
        <Wrapper>
          <CompanyWrapper onClick={() => setIsSearchOpen(true)}>
            <Input
              placeholder="회사명"
              value={companyName}
              onChange={handleCompanyName}
              disabled={isShinhan} // 신한 재단 체크 시 비활성화
            />
          </CompanyWrapper>

          <Checkbox
            checked={isShinhan}
            onChange={handleShinhanCheck}
            label="신한금융희망재단이십니까?"
          />
        </Wrapper>
        {/* 이름 입력 */}
        <Wrapper>
          <Input placeholder="이름" value={name} onChange={handleName} />
        </Wrapper>
        {/* 이메일 입력 및 유효성 검사 */}
        <Wrapper>
          <Input
            placeholder="이메일"
            infoMessage={
              !email ? "정확한 이메일 주소를 입력해주세요." : undefined
            }
            value={email}
            onChange={handleEmailChange}
            errorMessage={
              email && !isValidEmail(email) // 입력값이 있고 형식이 맞지 않으면 에러 표시
                ? "이메일 형식이 맞지 않습니다."
                : ""
            }
          />
        </Wrapper>
        {/* 비밀번호 입력 및 유효성 검사 */}
        <Wrapper>
          <Input
            type="password"
            value={password}
            placeholder="비밀번호"
            onChange={handlePasswordChange}
            errorMessage={
              password && !isValidPassword(password) // 입력값이 있고 형식이 맞지 않으면 에러 표시
                ? "비밀번호는 숫자와 특수문자를 포함한 8자리 이상이어야 합니다."
                : ""
            }
            autoComplete="off"
          />
        </Wrapper>
        {/* 비밀번호 확인 및 일치 여부 검사 */}
        <Wrapper>
          <Input
            type="password"
            value={confirmPassword}
            placeholder="비밀번호 확인"
            onChange={handleConfirmPasswordChange}
            errorMessage={errors.confirmPassword} // useSignup 훅에서 처리된 일치 여부 에러 메시지 사용
            autoComplete="off"
          />
        </Wrapper>

        {/* --- 약관 동의 섹션 --- */}
        <CheckboxWrapper>
          <Checkbox
            checked={isAllAgreed}
            onChange={handleAllAgreeChange}
            label="아래 약관에 모두 동의합니다"
          />
        </CheckboxWrapper>

        <Divider />

        {/* 서비스 이용약관 (필수) */}
        <CheckboxWrapper>
          <Checkbox
            checked={isTermsChecked}
            onChange={handleTermsToggle}
            label="서비스 이용약관 (필수)"
            isUnderlined={true}
            labelClickable={true}
            onLabelClick={() => {
              handleScrollModal(TERMS_OF_SERVICE_HTML); // 약관 내용으로 모달 열기
            }}
          />
        </CheckboxWrapper>
        {/* 개인정보 수집이용 (필수) */}
        <CheckboxWrapper>
          <Checkbox
            checked={isPrivacyChecked}
            onChange={handlePrivacyToggle}
            label="개인정보 수집이용 (필수)"
            isUnderlined={true}
            labelClickable={true}
            onLabelClick={() => {
              handleScrollModal(PRIVACY_POLICY_HTML); // 약관 내용으로 모달 열기
            }}
          />
        </CheckboxWrapper>

        {/* 예약 알림 메일 수신 (선택) */}
        <CheckboxWrapper>
          <Checkbox
            checked={isEmailAgreed}
            onChange={handleEmailToggle}
            label="예약 알림 메일 수신 (필수)"
          />
        </CheckboxWrapper>

        {/* 회원가입 버튼 */}
        <ButtonWrapper>
          <Button
            type="button"
            isActive={isFormValid} // 유효성 검사 통과 시 활성화
            onClick={handleSignUpClick} // 회원가입 API 호출 핸들러
          >
            회원가입
          </Button>
        </ButtonWrapper>
      </SignupForm>
      {/* 약관 상세 내용을 보여주는 스크롤 모달 */}
      <ScrollModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)}>
        {termsContent}
      </ScrollModal>
      {/* 회사명 검색 모달 */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCompany={(name) => setCompanyName(name)} // 선택된 회사명을 상태에 반영
      />
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
  display: flex;
  margin-bottom: 12px;
  flex-direction: column;
  width: 22rem;
`;

const CompanyWrapper = styled.div`
  margin-bottom: 4px;
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
