/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';

interface CalendarSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedStatuses: string[]) => void;
  initialSelectedStatuses: string[];
}

interface StatusOption {
  id: string;
  label: string;
  color: string;
}

export const statusOptions: StatusOption[] = [
  { id: 'FIRST_APPROVAL_PENDING', label: '1차 승인 대기', color: '#FFBB00' },
  { id: 'SECOND_APPROVAL_PENDING', label: '2차 승인 대기', color: '#FF7300' },
  { id: 'FINAL_APPROVED', label: '최종 승인 완료', color: '#34C759' },
  { id: 'COMPLETED', label: '이용 완료', color: '#8496C5' },
  { id: 'CANCELLED', label: '예약 취소', color: '#8E8E93' },
  { id: 'REJECTED', label: '반려', color: '#C800FF' },
];

export default function CalendarSettingModal({
  isOpen,
  onClose,
  onSave,
  initialSelectedStatuses,
}: CalendarSettingModalProps) {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(initialSelectedStatuses);

  useEffect(() => {
    if (isOpen) {
      setSelectedStatuses(initialSelectedStatuses);
    }
  }, [isOpen, initialSelectedStatuses]);

  const toggleStatus = (statusId: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(statusId)
        ? prev.filter((id) => id !== statusId)
        : [...prev, statusId]
    );
  };

  const handleSave = () => {
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
          <div css={optionsContainerStyle}>
            {statusOptions.map((option) => (
              <div
                key={option.id}
                css={optionRowStyle}
                onClick={() => toggleStatus(option.id)}
              >
                <div
                  css={checkboxStyle(
                    option.color,
                    selectedStatuses.includes(option.id)
                  )}
                >
                  {selectedStatuses.includes(option.id) && (
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
                <span css={labelStyle}>{option.label}</span>
              </div>
            ))}
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
  padding: 24px 20px;
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
  padding: 24px 58px;

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

const optionsContainerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 353px;
`;

const optionRowStyle = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;

  &:hover {
    opacity: 0.8;
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

const labelStyle = css`
  font-family: 'Pretendard', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 18px;
  text-align: center;
  color: #191f28;
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
