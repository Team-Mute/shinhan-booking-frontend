import styled from "@emotion/styled";
import { IoCloseOutline } from "react-icons/io5";
import Button from "@components/ui/button/Button";
import {
  formatDate,
  formatTimeRange,
  getStatusStyle,
} from "@admin/lib/utils/reservationUtils";
import { Reservation } from "@admin/types/reservationAdmin";

/** 
 * 선택 승인 모달 창
 */
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
            선택 승인
          </ModalTitle>
          <CloseButton onClick={onCancel}>
            <IoCloseOutline size={24} color="#6b7280" />
          </CloseButton>
        </ModalHeader>

        <ReservationListContainer>
          {reservations.length > 0 ? ( 
            reservations.map((res) => (
              <ReservationItem> 
                <ReservationHeader>
                  <StatusTag 
                    $statusId={res.statusId}
                    isApprovable={false}
                  >
                    {res.reservationStatusName}
                  </StatusTag>
                  {res.isShinhan && <ShinhanTag>신한</ShinhanTag>}
                  {res.isEmergency && <EmergencyTag>긴급</EmergencyTag>}
                  <UserNameText>
                    예약자명: {res.userName}
                  </UserNameText>
                </ReservationHeader>
                
                <SpaceNameText>
                  {res.spaceName}
                </SpaceNameText>
                
                <TimeInfoContainer>
                  <ReservationTimeText>
                    <span>{formatDate(res.reservationFrom)}</span>
                  </ReservationTimeText>
                  <Separator>|
                  </Separator>
                  <ReservationTimeText>
                    <span>
                      {formatTimeRange(res.reservationFrom, res.reservationTo)}
                    </span>
                  </ReservationTimeText>
                </TimeInfoContainer>

                {res.previsits && res.previsits.length > 0 && (
                  <TimeInfoContainer>
                    <PrevisitText>
                      <span>
                        사전답사 {formatDate(res.previsits[0]?.previsitFrom)}
                      </span>
                    </PrevisitText>
                    <Separator>|
                    </Separator>
                    <PrevisitText>
                      <span>
                        {formatTimeRange(
                          res.previsits[0]?.previsitFrom,
                          res.previsits[0]?.previsitTo
                        )}
                      </span>
                    </PrevisitText>
                  </TimeInfoContainer>
                )}
              </ReservationItem>
            ))
          ) : (
            <p>선택된 예약이 없습니다.</p>
          )}
        </ReservationListContainer>

        <ButtonWrapper>
          <Button onClick={onConfirm} isActive={true} width={"98%"}>
           전체 승인하기
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

const StatusTag = styled('span', {
  shouldForwardProp: (prop) => prop !== '$statusId' && prop !== 'isApprovable',
})<{
  $statusId?: number;
  isApprovable: boolean;
}>`
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  white-space: nowrap;

  /* 기본 색상 먼저 */
  background-color: ${(p) => (p.isApprovable ? '#d1fae5' : '#e5e7eb')};
  color: ${(p) => (p.isApprovable ? '#065f46' : '#4b5563')};

  /* 마지막에 status 색상으로 덮어쓰기 */
  ${({ $statusId }) => $statusId != null && getStatusStyle($statusId)};
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

const UserNameText = styled.span`
  /* 기존 인라인 스타일: color: "#6b7280", fontSize: "0.75rem" */
  color: #6b7280;
  font-size: 0.75rem;
`;

const SpaceNameText = styled.span`
  /* 기존 인라인 스타일: fontWeight: "bold", color: "#333", wordBreak: "break-all" */
  font-weight: bold;
  color: #333;
  word-break: break-all;
`;

const TimeInfoContainer = styled.div`
  /* 기존 인라인 스타일: display: "flex", gap: "0.25rem", marginTop: "0.1rem" */
  display: flex;
  gap: 0.25rem;
  margin-top: 0.1rem;
`;

const ReservationTimeText = styled.span`
  /* 기존 인라인 스타일: fontSize: "0.875rem", fontWeight: "bold", color: "#333" */
  font-size: 0.875rem;
  font-weight: bold;
  color: #333;
`;

const PrevisitText = styled.span`
  /* 기존 인라인 스타일: fontSize: "0.875rem", color: "#4b5563" */
  font-size: 0.875rem;
  color: #4b5563;
`;

const Separator = styled.span`
  /* 스타일은 TimeInfoContainer에 의해 상속받거나 필요한 경우 추가 */
`;

