/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { StatusOption } from '@admin/lib/constants/dashboard';

interface CalendarSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedStatuses: string[]) => void;
  initialSelectedStatuses: string[];
  statusOptions: StatusOption[];
}

export default function CalendarSettingModal({
  isOpen,
  onClose,
  onSave,
  initialSelectedStatuses,
  statusOptions,
}: CalendarSettingModalProps) {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(initialSelectedStatuses);

  useEffect(() => {
    if (isOpen) {
      setSelectedStatuses(initialSelectedStatuses);
    }
  }, [isOpen, initialSelectedStatuses]);

  const toggleStatus = (statusId: string) => {
    setSelectedStatuses((prev) => {
      // 이미 선택된 상태를 해제하려는 경우
      if (prev.includes(statusId)) {
        // 마지막 남은 항목이면 해제 불가
        if (prev.length === 1) {
          return prev; // 변경하지 않음
        }
        return prev.filter((id) => id !== statusId);
      }
      // 새로운 상태 추가
      return [...prev, statusId];
    });
  };

  const handleSave = () => {
    // 최소 1개 선택 확인
    if (selectedStatuses.length === 0) {
      alert('최소 1개 이상의 상태를 선택해 주세요.');
      return;
    }
    onSave(selectedStatuses);
    onClose();
  };

  const handleClose = () => {
    setSelectedStatuses(initialSelectedStatuses);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div css={overlayStyle} onClick={handleClose} />
      <div css={modalContainerStyle}>
        <div css={modalHeaderStyle}>
          <div css={headerContentStyle}>
            <h2 css={titleStyle}>캘린더 설정</h2>
            <button css={closeButtonStyle} onClick={handleClose}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div css={contentStyle}>
          <div css={descriptionStyle}>
            최소 1개 이상의 상태를 선택해 주세요.
          </div>
          <div css={optionsContainerStyle}>
            {statusOptions.map((option) => {
              const isSelected = selectedStatuses.includes(option.id);
              const isLastSelected = isSelected && selectedStatuses.length === 1;
              
              return (
                <div
                  key={option.id}
                  css={optionRowStyle(isLastSelected)}
                  onClick={() => !isLastSelected && toggleStatus(option.id)}
                >
                  <div
                    css={checkboxStyle(
                      option.color,
                      isSelected
                    )}
                  >
                    {isSelected && (
                      <svg
                        width="8"
                        height="6"
                        viewBox="0 0 8 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 3L3 5L7 1"
                          stroke="#FFFFFF"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span css={labelStyle(isLastSelected)}>{option.label}</span>
                  {isLastSelected && (
                    <span css={requiredBadgeStyle}>필수</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div css={footerStyle}>
          <button css={saveButtonStyle} onClick={handleSave}>
            설정 완료
          </button>
        </div>
      </div>
    </>
  );
}

// Styles
const overlayStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const modalContainerStyle = css`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 470px;
  max-height: 733px;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 12px;
  z-index: 1000;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);
`;

const modalHeaderStyle = css`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 24px 20px 16px 20px; // 하단 padding 줄임 (24px → 16px)
  gap: 7px;
  background: #ffffff;
  border-radius: 12px 12px 0px 0px;
`;

const headerContentStyle = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 353px;
`;

const titleStyle = css`
  font-family: 'Pretendard', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  letter-spacing: -0.011em;
  color: #191f28;
  margin: 0;
`;

const closeButtonStyle = css`
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.7;
  }
`;

const contentStyle = css`
  width: 100%;
  max-height: 559px;
  overflow-y: auto;
  background: #ffffff;
  padding: 8px 58px 24px 58px; // 상단 padding 줄임 (24px → 8px)

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d1d6;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background: #f2f2f7;
  }
`;

const descriptionStyle = css`
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  color: #8c8f93;
  margin-bottom: 20px;
  text-align: left; // 왼쪽 정렬
  padding-left: 0; // 왼쪽 여백 제거
`;

const optionsContainerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 353px;
`;

const optionRowStyle = (isDisabled: boolean) => css`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  cursor: ${isDisabled ? 'not-allowed' : 'pointer'};
  user-select: none;
  opacity: ${isDisabled ? 0.6 : 1};

  &:hover {
    opacity: ${isDisabled ? 0.6 : 0.8};
  }
`;

const checkboxStyle = (
  bgColor: string,
  isSelected?: boolean
) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 9px;
  flex-shrink: 0;
  background: ${isSelected ? bgColor : '#FFFFFF'};
  border: ${isSelected ? 'none' : '1px solid #E5E5EA'};
  box-sizing: border-box;
`;

const labelStyle = (isDisabled: boolean) => css`
  font-family: 'Pretendard', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 18px;
  text-align: center;
  color: ${isDisabled ? '#8c8f93' : '#191f28'};
`;

const requiredBadgeStyle = css`
  margin-left: auto;
  padding: 2px 8px;
  background: #FFF2F2;
  color: #FF0000;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
`;

const footerStyle = css`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 24px 20px;
  background: #ffffff;
  border-radius: 0px 0px 12px 12px;
`;

const saveButtonStyle = css`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px 12px;
  width: 353px;
  height: 46px;
  background: #0046ff;
  border-radius: 8px;
  border: none;
  cursor: pointer;

  font-family: 'Pretendard', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 46px;
  letter-spacing: -0.011em;
  color: #ffffff;

  &:hover {
    background: #0039cc;
  }

  &:active {
    background: #002d99;
  }
`;