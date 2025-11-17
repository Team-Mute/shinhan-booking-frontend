import axiosClient from "./axiosClient";
import {
  SearchCompanyRequest,
  SearchCompanyResponse,
} from "@user/types/company.dto";

/**
 * @description 기업 검색 API
 * ----------------------------
 * 회사명과 페이지 번호를 기준으로 기업 정보를 검색합니다.
 *
 * @param {SearchCompanyRequest} corpNm - 검색할 회사 이름
 * @param {SearchCompanyRequest} pageNo - 요청할 페이지 번호
 * @returns {Promise<SearchCompanyResponse>} API 응답 (검색 결과 목록 및 다음 페이지 번호 포함)
 */
export async function searchCompanyApi({
  corpNm, // 요청 본문(body)에 회사명 포함
  pageNo, // 요청 본문(body)에 페이지 번호 포함
}: SearchCompanyRequest) {
  const response = await axiosClient.post<SearchCompanyResponse>(
    "/api/corpName",
    {
      corpNm,
      pageNo,
    }
  );
  return response; // data.item, data.pageNo
}
