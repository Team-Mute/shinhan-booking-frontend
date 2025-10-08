/**
 * =======================
 * adminSpace.ts
 * 관리자 공간 관련 API 모음
 * =======================
 *
 * 공간등록: createSpaceApi
 * 태그(편의시설)등록: createTagsApi
 * 공간수정: updateSpaceApi
 * 공간삭제: deleteSpaceApi
 *
 * 공간 단건 조회: getSpaceApi
 * 공간 전체 리스트 조회: getAllSpaceListApi (마스터, 2차 승인자만 쓰는 api)
 * 지역별 공간 리스트 조회: getRegionSpaceListApi (1차 승인자용 api)
 * 담당자 리스트 조회: getManagerListApi (드롭다운 메뉴)
 *
 * 태그(편의시설)조회: getTagsApi
 * 지역 리스트 조회: getRegionMenuListApi (사용자 화면에서 드롭다운 메뉴[서울, 대전 등])
 * 지역 아이디로 주소 조회: getAddressApi
 * 카테고리 리스트 조회: getCategoryListApi
 *
 */

import adminAxiosClient from "./adminAxiosClient";
import {
  SpaceAllListParams,
  SpaceAllListResponse,
  SpaceDeleteParams,
  SpaceCreateBody,
  SpaceUpdateBody,
  SpaceUpdateParams,
  TagsCreateParams,
  SpaceDetailParams,
  ManagerListParams,
  AddressByRegionIdParams,
  SpaceRegionListParams,
} from "@admin/types/dto/space.dto";

// 공간 등록 API
export async function createSpaceApi(bodyData: SpaceCreateBody) {
  const formData = new FormData();

  formData.append("space", JSON.stringify(bodyData.space));
  bodyData.images.forEach((img) => formData.append("images", img));

  const { data: response } = await adminAxiosClient.post(
    "/api/spaces-admin/upload",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response;
}

// 태그(편의시설) 등록 API
export async function createTagsApi(paramsData: TagsCreateParams) {
  const { data: response } = await adminAxiosClient.post(
    "/api/spaces-admin/tags",
    null,
    { params: paramsData }
  );
  return response;
}

// 공간 수정 API
export async function updateSpaceApi(
  paramsData: SpaceUpdateParams,
  bodyData: SpaceUpdateBody
) {
  const formData = new FormData();
  formData.append("space", JSON.stringify(bodyData.space));
  bodyData.images.forEach((img) => formData.append("images", img));
  formData.append("keepUrlsOrder", JSON.stringify(bodyData.keepUrlsOrder));

  const { data } = await adminAxiosClient.put(
    `/api/spaces-admin/${paramsData.spaceId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return data;
}

// 공간 삭제 API
export async function deleteSpaceApi(paramsData: SpaceDeleteParams) {
  const { data } = await adminAxiosClient.delete(
    `/api/spaces-admin/${paramsData.spaceId}`
  );
  return data;
}

////////////

// 공간 단건 조회
export async function getSpaceApi(paramsData: SpaceDetailParams) {
  const { data } = await adminAxiosClient.get(
    `/api/spaces-admin/detail/${paramsData.spaceId}`
  );
  return data;
}

// 공간 전체 리스트 조회
export async function getAllSpaceListApi(
  paramsData: SpaceAllListParams
): Promise<SpaceAllListResponse> {
  const { data } = await adminAxiosClient.get("/api/spaces-admin/list", {
    params: paramsData,
  });
  return data;
}

// 지역별 공간 리스트 조회 (1차 승인자만 지역별로, 2차 승인자는 모두 나오게)
export async function getRegionSpaceListApi(paramsData: SpaceRegionListParams) {
  const { data } = await adminAxiosClient.get(
    `/api/spaces-admin/list/${paramsData.regionId}`
  );
  return data;
}

// 담당자 리스트 조회
export async function getManagerListApi(paramsData: ManagerListParams) {
  const { data } = await adminAxiosClient.get(
    `/api/spaces-admin/approvers/${paramsData.regionId}`
  );
  return data;
}

////////////

// 태그(편의시설)조회
export async function getTagsApi() {
  const { data } = await adminAxiosClient.get(`/api/spaces/tags`);
  return data;
}

// 지역 리스트 조회
export async function getRegionMenuListApi() {
  const { data } = await adminAxiosClient.get(`/api/spaces/regions`);
  return data;
}

// 지역 아이디로 주소 조회
export async function getAddressApi(paramsData: AddressByRegionIdParams) {
  const { data } = await adminAxiosClient.get(
    `/api/spaces/locations/${paramsData.regionId}`
  );
  return data;
}

// 카테고리 리스트 조회
export async function getCategoryListApi() {
  const { data } = await adminAxiosClient.get(`/api/spaces/categories`);
  return data;
}
