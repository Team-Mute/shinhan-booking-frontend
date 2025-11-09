// 기업 검색 API 요청 body 타입
/**
 * SearchCompanyRequest 인터페이스
 * ------------------------------
 * 기업 검색 API 요청 시 사용하는 DTO(Data Transfer Object).
 *
 * @property {string} corpNm - 검색할 회사 이름 (Company Name).
 * @property {number} pageNo - 요청할 페이지 번호.
 */
export interface SearchCompanyRequest {
  corpNm: string;
  pageNo: number;
}

/**
 * SearchCompanyResponse 인터페이스
 * -------------------------------
 * 기업 검색 API 응답 시 사용하는 DTO.
 *
 * @property {string[]} item - 검색 결과로 반환된 회사 이름 목록.
 * @property {number} pageNo - 현재 응답된 페이지 번호 (다음 요청 시 pageNo + 1 사용).
 */
export interface SearchCompanyResponse {
  item: string[];
  pageNo: number;
}
