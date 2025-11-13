// 초대장 API body 타입
/**
 * getInvitationDetails 인터페이스
 * ------------------------------
 * 기업 검색 API 응답 시 사용하는 DTO(Data Transfer Object).
 *
 * @property {string} userName - 예약자 이름
 * @property {string} spaceName - 예약 공간 이름
 * @property {string} addressRoad - 예약 공간 도로명 주소
 * @property {string} reservationFrom - 예약 시작 일시
 * @property {string} reservationTo - 예약 종료 일시
 * @property {string} reservationPurpose - 예약 목적
 * @property {string[]} reservationAttachment - 예약 첨부파일 URL 목록
 */
export interface InvitationDetails {
    userName: string;
    spaceName: string;
    addressRoad: string;
    reservationFrom: string;
    reservationTo: string;
    reservationPurpose: string;
    reservationAttachment: string[];
}