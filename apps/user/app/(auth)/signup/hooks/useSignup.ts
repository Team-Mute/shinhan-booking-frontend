import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useModalStore } from "@user/store/modalStore";
import { signUpApi } from "@user/lib/api/userAuth";

/**
 * useSignup 훅
 * ----------------------------
 * 사용자 회원가입 화면에서 사용할 상태와 로직을 관리하는 커스텀 훅
 *
 * @description
 * - 회사명, 이름, 이메일, 비밀번호, 약관 동의 상태 관리.
 *
 */
export function useSignup() {
  const router = useRouter();
  const { open } = useModalStore();

  // --- 입력 상태 관리 ---
  // 신한금융희망재단 여부
  const [isShinhan, setIsShinhan] = useState(false);

  // 약관 동의 상태
  const [isAllAgreed, setIsAllAgreed] = useState(false);
  const [isTermsChecked, setIsTermChecked] = useState(false);
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);
  const [isEmailAgreed, setIsEmailAgreed] = useState(false);

  // 모달 상태 (약관창, 검색창)
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // 모달 내용
  const [termsContent, setTermsContent] = useState("");

  // 입력 값
  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");

  // 회원가입 버튼 클릭 핸들러
  const handleSignUpClick = async () => {
    try {
      const response = await signUpApi({
        userName: name,
        userEmail: email,
        userPwd: password,
        companyName: companyName,
        agreeEmail: true,
      });

      if (response.status === 201) {
        open(
          "회원가입 완료!",
          "신한금융희망재단에서 무료로\n공간을 이용해보세요!",
          () => {
            router.push("/login");
          }
        );
      }
    } catch (error: any) {
      console.error("회원가입 실패:", error);
      if (error.response?.status === 400 && error.response?.data?.message) {
        open("안내", error.response.data.message);
      } else {
        open("안내", "회원가입 중 오류가 발생했습니다.", () => {
          router.push("/login");
        });
      }
    }
  };

  // 에러 메시지 (비밀번호 규칙, 일치 여부)
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  /**
   * @description 전체 약관 동의 체크박스 변경 핸들러
   */
  const handleAllAgreeChange = () => {
    const newValue = !isAllAgreed;
    setIsAllAgreed(newValue);
    setIsTermChecked(newValue);
    setIsPrivacyChecked(newValue);
    setIsEmailAgreed(newValue);
  };

  /**
   * @description 신한금융희망재단 여부 체크박스 변경 핸들러
   */
  const handleShinhanCheck = () => {
    const newValue = !isShinhan;
    setIsShinhan(newValue);
    setCompanyName(newValue ? "신한금융희망재단" : "");
  };

  // 폼 유효성 검사 (가입 버튼 활성화 여부 판단)
  const isFormValid = useMemo(() => {
    return Boolean(
      companyName &&
        name &&
        password &&
        confirmPassword &&
        errors.password === "" &&
        errors.confirmPassword === "" &&
        isTermsChecked &&
        isPrivacyChecked &&
        isEmailAgreed
    );
  }, [
    companyName,
    name,
    password,
    confirmPassword,
    errors,
    isTermsChecked,
    isPrivacyChecked,
    isEmailAgreed,
  ]);

  // 하위 항목이 바뀌면 모두 동의 상태 업데이트
  useEffect(() => {
    const allChecked = isTermsChecked && isPrivacyChecked && isEmailAgreed;
    setIsAllAgreed(allChecked);
  }, [isTermsChecked, isPrivacyChecked, isEmailAgreed]);

  // 비밀번호 확인 검증
  useEffect(() => {
    if (confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          password === confirmPassword ? "" : "비밀번호가 일치하지 않습니다",
      }));
    }
  }, [password, confirmPassword]);

  /**
   * @description 회사명 직접 입력 시 상태 업데이트
   */
  const handleCompanyName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(e.target.value);
  };

  /**
   * @description 이름 입력 시 상태 업데이트
   */
  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  /**
   * @description 이메일 입력 시 상태 업데이트
   */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  /**
   * @description 비밀번호 입력 시 상태 업데이트
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  /**
   * @description 확인용 비밀번호 입력 시 상태 업데이트
   */
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  // --- 약관 모달 핸들러 ---

  /**
   * @description 스크롤 모달(약관 상세)을 열고 내용 설정
   */
  const handleScrollModal = (content: string) => {
    setTermsContent(content);
    setIsTermsOpen(true);
  };

  // --- 개별 약관 토글 핸들러 ---
  const handleTermsToggle = () => {
    setIsTermChecked((prev) => !prev);
  };

  const handlePrivacyToggle = () => {
    setIsPrivacyChecked((prev) => !prev);
  };

  const handleEmailToggle = () => {
    setIsEmailAgreed((prev) => !prev);
  };

  return {
    // 입력 값
    companyName,
    name,
    email,
    password,
    confirmPassword,

    // 체크 상태
    isShinhan,
    isAllAgreed,
    isTermsChecked,
    isPrivacyChecked,
    isEmailAgreed,

    // 모달 오픈 여부
    isTermsOpen,
    isSearchOpen,

    termsContent,
    errors,
    isFormValid,

    // 상태 설정 함수
    setCompanyName,
    setIsSearchOpen,
    setIsTermsOpen,

    // 체크박스 핸들러
    handleShinhanCheck,
    handleAllAgreeChange,
    handleTermsToggle,
    handlePrivacyToggle,
    handleEmailToggle,

    // 입력값 변경 핸들러
    handleCompanyName,
    handleName,
    handleEmailChange,
    handlePasswordChange,
    handleConfirmPasswordChange,

    // 액션 핸들러
    handleScrollModal,
    handleSignUpClick,
  };
}
