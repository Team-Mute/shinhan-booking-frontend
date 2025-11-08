/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { RawReservationData } from '@admin/types/dashBoardAdmin';
import { getStatusBgColor, getStatusColor, STATUS_COLORS_BY_NAME } from '@styles/statusStyles';

interface DayDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string; // YYYY-MM-DD 형식
  reservations: RawReservationData[];
}

export default function DayDetailModal({
  isOpen,
  onClose,
  date,
  reservations,
}: DayDetailModalProps) {
  if (!isOpen) return null;

  // 날짜 포맷팅 함수
  const formatDisplayDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${year},${String(month).padStart(2, '0')},${String(day).padStart(2, '0')}`;
  };

  // 요일 구하기
  const getWeekDay = (dateStr: string) => {
    const d = new Date(dateStr);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[d.getDay()];
  };

  // 시간 포맷팅 (HH:mm)
  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  // 날짜와 시간 포맷팅 (상세)
  const formatDetailDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const weekDay = getWeekDay(dateStr);
    return `${year}년,${month}월 ${day}일 (${weekDay})`;
  };

  const handleConfirm = () => {
    onClose();
  };

  return (
    <>
      <div css={overlayStyle} onClick={onClose} />
      <div css={modalContainerStyle} onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div css={headerStyle}>
          <h2 css={titleStyle}>{formatDisplayDate(date)}</h2>
          <button css={closeButtonStyle} onClick={onClose}>
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

        {/* 예약 리스트 */}
        <div css={contentStyle}>
          <div css={reservationListStyle}>
            {reservations.length === 0 ? (
              <div css={emptyStateStyle}>해당 날짜에 예약이 없습니다.</div>
            ) : (
              reservations.map((reservation) => (
                <div key={reservation.reservationId} css={reservationItemStyle}>
                  <div css={leftSectionStyle}>
                    <div css={topRowStyle}>
                      <div css={badgesWrapperStyle}>
                        <div css={statusBadgeStyle(reservation.reservationStatusName)}>
                          {reservation.reservationStatusName}
                        </div>
                        {reservation.isShinhan && (
                          <div css={shinhanBadgeStyle}>신한</div>
                        )}
                        {reservation.isEmergency && (
                          <div css={emergencyBadgeStyle}>긴급</div>
                        )}
                      </div>
                      <div css={userNameStyle}>예약자명: {reservation.userName}</div>
                    </div>
                    <div css={spaceNameStyle}>{reservation.spaceName}</div>
                    <div css={dateTimeInfoStyle}>
                      <div css={mainDateTimeStyle}>
                        <span css={dateTextStyle}>{formatDetailDate(reservation.reservationFrom)}</span>
                        <div css={dividerStyle} />
                        <span css={timeTextStyle}>
                          {formatTime(reservation.reservationFrom)} ~ {formatTime(reservation.reservationTo)}
                        </span>
                      </div>
                      {reservation.previsits && reservation.previsits.length > 0 && (
                        <div css={previsitStyle}>
                          <span css={previsitLabelStyle}>
                            사전답사 {formatDetailDate(reservation.previsits[0].previsitFrom)}
                          </span>
                          <div css={dividerGrayStyle} />
                          <span css={previsitTimeStyle}>
                            {formatTime(reservation.previsits[0].previsitFrom)} ~ {formatTime(reservation.previsits[0].previsitTo)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 푸터 */}
        <div css={footerStyle}>
          <button css={confirmButtonStyle} onClick={handleConfirm}>
            확인
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
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const modalContainerStyle = css`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 470px;
  max-width: calc(100vw - 40px);
  max-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
`;

const headerStyle = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 24px 58px;
  background: #ffffff;
  border-radius: 12px 12px 0px 0px;
  flex-shrink: 0;
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
  flex-shrink: 0;

  &:hover {
    opacity: 0.7;
  }
`;

const contentStyle = css`
  width: 100%;
  flex: 1;
  overflow-y: auto;
  background: #ffffff;
  padding: 0 58px;

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

const reservationListStyle = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

const emptyStateStyle = css`
  width: 100%;
  padding: 60px 0;
  text-align: center;
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  color: #8c8f93;
`;

const reservationItemStyle = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  width: 353px;
  border-bottom: 1px solid #e8e9e9;
`;

const leftSectionStyle = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
`;

const topRowStyle = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  width: 100%;
  flex-wrap: wrap;
`;

const badgesWrapperStyle = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const statusBadgeStyle = (status: string) => css`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  background: ${getStatusBgColor(status)};
  border-radius: 4px;
  font-family: 'Pretendard', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 11px;
  line-height: 13px;
  text-align: center;
  letter-spacing: -0.011em;
  color: ${getStatusColor(status)};
  white-space: nowrap;
`;

// statusStyles.ts의 STATUS_COLORS_BY_NAME 활용
const shinhanBadgeStyle = css`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  background: ${STATUS_COLORS_BY_NAME['신한'].bg};
  border-radius: 4px;
  font-family: 'Pretendard', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 11px;
  line-height: 13px;
  text-align: center;
  letter-spacing: -0.011em;
  color: ${STATUS_COLORS_BY_NAME['신한'].text};
`;

const emergencyBadgeStyle = css`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  background: ${STATUS_COLORS_BY_NAME['긴급'].bg};
  border-radius: 4px;
  font-family: 'Pretendard', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 11px;
  line-height: 13px;
  text-align: center;
  letter-spacing: -0.011em;
  color: ${STATUS_COLORS_BY_NAME['긴급'].text};
`;

const userNameStyle = css`
  font-family: 'Pretendard', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: -0.011em;
  color: #8c8f93;
`;

const spaceNameStyle = css`
  font-family: 'Pretendard', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: -0.011em;
  color: #191f28;
  width: 100%;
`;

const dateTimeInfoStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 4px;
  width: 100%;
`;

const mainDateTimeStyle = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const dateTextStyle = css`
  font-family: 'Pretendard', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: -0.011em;
  color: #191f28;
`;

const dividerStyle = css`
  width: 0px;
  height: 12px;
  border: 1px solid #191f28;
`;

const timeTextStyle = css`
  font-family: 'Pretendard', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: -0.011em;
  color: #191f28;
`;

const previsitStyle = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const previsitLabelStyle = css`
  font-family: 'Pretendard', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: -0.011em;
  color: #8c8f93;
`;

const dividerGrayStyle = css`
  width: 0px;
  height: 12px;
  border: 1px solid #8c8f93;
`;

const previsitTimeStyle = css`
  font-family: 'Pretendard', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: -0.011em;
  color: #8c8f93;
`;

const footerStyle = css`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 24px 58px;
  background: #ffffff;
  border-radius: 0px 0px 12px 12px;
  flex-shrink: 0;
`;

const confirmButtonStyle = css`
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
