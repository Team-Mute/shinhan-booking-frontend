import React from "react";
import styled from "@emotion/styled";
import colors from "@styles/theme";
import { useConfirmModalStore } from "@admin/store/confirmModalStore";

const ConfirmModal = () => {
  const { 
    isOpen, 
    title, 
    subtitle, 
    onConfirm, 
    onCancel, 
    close 
  } = useConfirmModalStore();

  if (!isOpen) return null;

  // 확인 버튼 핸들러
  const handleConfirm = () => {
    onConfirm(); // 전달받은 onConfirm 콜백 실행
    close();     // 모달 닫기
  };

  // 취소 버튼 핸들러
  const handleCancel = () => {
    onCancel(); // 전달받은 onCancel 콜백 실행
    close();    // 모달 닫기
  };

  return (
    <Overlay>
      <ModalContainer>
        <TitleWrapper>
          <Title>{title}</Title>
        </TitleWrapper>
        <SubtitleWrapper>
          <SubTitle>{subtitle}</SubTitle>
        </SubtitleWrapper>

        <TwoButtonWrapper>
          <CancelButton onClick={handleCancel}>
            취소
          </CancelButton>
          <ConfirmButton onClick={handleConfirm}>
            확인
          </ConfirmButton>
        </TwoButtonWrapper>
      </ModalContainer>
    </Overlay>
  );
};

export default ConfirmModal;

const maxWidth = "22rem";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  width: ${maxWidth};
  background-color: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 2.25rem 3.25rem;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-weight: 600;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 600;
  line-height: 145%;
  letter-spacing: -0.01238rem;
`;

const SubtitleWrapper = styled.div`
  text-align: center;
  white-space: pre-wrap;
  word-break: break-word;
  width: 100%;
  box-sizing: border-box;
`;

const SubTitle = styled.h5`
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: 145%;
  letter-spacing: -0.00963rem;
  color: ${colors.graycolor50};
`;

const TwoButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  width: 100%;
`;

const CancelButton = styled.button`
  width: 48%;
  height: 46px;
  border-radius: 8px;
  border: none;
  background-color: ${colors.graycolor10};
  color: ${colors.graycolor100};
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
`

const ConfirmButton = styled.button`
 width: 48%;
 height: 46px;
 border-radius: 8px;
 border: none;
 background-color: ${colors.maincolor};
 color: white;
 cursor: pointer;
 font-size: 14px;
 transition: background-color 0.3s ease;
`