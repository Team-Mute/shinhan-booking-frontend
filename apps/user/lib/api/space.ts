/**
 * =======================
 * space.ts
 * 사용자 공간 관련 API 모음
 * =======================
 *
 * 공간 리스트 조회: getSpaceListApi
 * 공간 단건 조회: getDetailSpaceApi
 *
 * 태그(편의시설)조회: getTagsApi
 * 지역 리스트 조회: getRegionMenuListApi (사용자 화면에서 드롭다운 메뉴[서울, 대전 등])
 * 지역 아이디로 주소 조회: getAddressApi
 * 카테고리 리스트 조회: getCategoryListApi
 */

import {
  AddressByRegionIdParams,
  SpaceListParams,
} from "@user/types/space.dto";
import axiosClient from "./axiosClient";

// 공간 리스트 조회
export async function getSpaceListApi(paramsData: SpaceListParams) {
  const { data } = await axiosClient.get("/api/spaces-user", {
    params: paramsData,
  });
  return data;
}

// 공간 단건 조회
export async function getDetailSpaceApi(spaceId: number) {
  const { data } = await axiosClient.get(`/api/spaces-user/detail/${spaceId}`);
  return data;
}

// 태그(편의시설)조회
export async function getTagsApi() {
  const { data } = await axiosClient.get(`/api/spaces/tags`);
  return data;
}

// 지역 리스트 조회
export async function getRegionMenuListApi() {
  const { data } = await axiosClient.get(`/api/spaces/regions`);
  return data;
}

// 지역 아이디로 주소 조회
export async function getAddressApi(paramsData: AddressByRegionIdParams) {
  const { data } = await axiosClient.get(
    `/api/spaces/locations/${paramsData.regionId}`
  );
  return data;
}

// 카테고리 리스트 조회
export async function getCategoryListApi() {
  const { data } = await axiosClient.get(`/api/spaces/categories`);
  return data;
}
