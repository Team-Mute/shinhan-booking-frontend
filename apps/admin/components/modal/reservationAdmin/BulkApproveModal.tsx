import styled from "@emotion/styled";
import { IoCloseOutline } from "react-icons/io5";
import Button from "@components/ui/button/Button";
import {
  formatDate,
  formatTimeRange,
  getStatusStyle,
} from "@admin/lib/utils/reservationUtils";
import { Reservation } from "@admin/types/reservationAdmin";

// 모달 컴포넌트 props의 타입을 `Reservation`에 맞게 수정
interface BulkApproveModalProps {
  isOpen: boolean;
  reservations: Reservation[];
  onConfirm: () => void;
  onCancel: () => void;
}

const BulkApproveModal = ({
  isOpen,
  reservations,
  onConfirm,
  onCancel,
}: BulkApproveModalProps) => {
  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>
            {reservations.length > 1 ? "선택 승인" : "예약 승인"}
          </ModalTitle>
          <CloseButton onClick={onCancel}>
            <IoCloseOutline size={24} color="#6b7280" />
          </CloseButton>
        </ModalHeader>

        <ReservationListContainer>
          {reservations.length > 0 ? (
            reservations.map((res) => (
              <ReservationItem key={res.reservationId}>
                <ReservationHeader>
                  <StatusTag
                    // css={getStatusStyle(res.statusId)}
                    isApprovable={false}
                  >
                    {res.reservationStatusName}
                  </StatusTag>
                  {res.isShinhan && <ShinhanTag>신한</ShinhanTag>}
                  {res.isEmergency && <EmergencyTag>긴급</EmergencyTag>}
                  <span style={{ color: "#6b7280", fontSize: "0.75rem" }}>
                    예약자명: {res.userName}
                  </span>
                </ReservationHeader>
                <span
                  style={{
                    fontWeight: "bold",
                    color: "#333",
                    wordBreak: "break-all",
                  }}
                >
                  {res.spaceName}
                </span>
                <div
                  style={{
                    display: "flex",
                    gap: "0.25rem",
                    fontSize: "0.875rem",
                    fontWeight: "bold",
                    color: "#333",
                    marginTop: "0.1rem",
                  }}
                >
                  <span>{formatDate(res.reservationFrom)}</span>
                  <span>|</span>
                  <span>
                    {formatTimeRange(res.reservationFrom, res.reservationTo)}
                  </span>
                </div>

                {res.previsits && res.previsits.length > 0 && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.25rem",
                        fontSize: "0.875rem",
                        color: "#4b5563",
                        marginTop: "0.1rem",
                      }}
                    >
                      <span>
                        사전답사 {formatDate(res.previsits[0]?.previsitFrom)}
                      </span>
                      <span>|</span>
                      <span>
                        {formatTimeRange(
                          res.previsits[0]?.previsitFrom,
                          res.previsits[0]?.previsitTo
                        )}
                      </span>
                    </div>
                  </>
                )}
              </ReservationItem>
            ))
          ) : (
            <p>선택된 예약이 없습니다.</p>
          )}
        </ReservationListContainer>

        <ButtonWrapper>
          <Button onClick={onConfirm} isActive={true} width={"98%"}>
            {reservations.length > 1 ? "전체 승인하기" : "승인하기"}
          </Button>
        </ButtonWrapper>
      </ModalContainer>
    </Overlay>
  );
};

export default BulkApproveModal;

// Modal 내부에서 사용되는 스타일 컴포넌트
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
`;

const ModalContainer = styled.div`
  max-width: 32rem; /* 최대 너비 설정 */
  width: 90%; /* 화면 크기에 따라 유동적으로 조절 */
  background-color: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 1.5rem;
  box-sizing: border-box; /* 패딩이 너비에 포함되도록 */

  @media (max-width: 768px) {
    width: 95%; /* 모바일에서 더 넓게 사용 */
    padding: 1rem;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;

const ReservationListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  max-height: 25rem; /* 최대 높이 유지 */

  @media (max-width: 768px) {
    max-height: 20rem; /* 모바일에서 높이 조정 */
  }
`;

const ReservationItem = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* 내부 요소 간 간격 */

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;

const ReservationHeader = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap; /* 내용이 길면 줄바꿈 */
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const SpaceName = styled.span`
  font-weight: bold;
  color: #333;
  word-break: break-all; /* 긴 이름 줄바꿈 처리 */
  flex-grow: 1; /* 남은 공간 최대한 차지 */
  min-width: 0; /* flex item이 넘치지 않도록 */
`;

const UserName = styled.span`
  color: #6b7280;
  font-size: 0.75rem;
  word-break: break-all;
  white-space: nowrap; /* 예약자명은 한 줄로 유지 (필요시 break-all) */
`;

const ReservationDetails = styled.div`
  display: flex;
  flex-wrap: wrap; /* 내용이 길면 줄바꿈 */
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #4b5563;
`;

const StatusTag = styled.span<{ isApprovable: boolean }>`
  background-color: ${(props) => (props.isApprovable ? "#d1fae5" : "#e5e7eb")};
  color: ${(props) => (props.isApprovable ? "#065f46" : "#4b5563")};
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap; /* 태그는 줄바꿈되지 않도록 */
`;

const ShinhanTag = styled.span`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  gap: 8px;

  background: #f2f6ff;
  border-radius: 4px;

  font-size: 0.75rem;
  font-weight: 700;
  color: #0046ff;
  white-space: nowrap; /* 태그는 줄바꿈되지 않도록 */
`;

const EmergencyTag = styled.span`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  gap: 8px;

  background: #fff2f2;
  border-radius: 4px;

  font-size: 0.75rem;
  font-weight: 700;
  color: #ff0000;
  /* 긴급 태그가 줄바꿈되지 않도록 */
  flex-shrink: 0;
  white-space: nowrap;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center; /* 버튼을 중앙으로 정렬 */
  margin-top: 1.5rem;
  width: 100%;
`;
