/**
 * 공간 관련 DTO 모음
 *
 * 📌 네이밍 규칙:
 * - 요청 파라미터: XXXParams
 * - 요청 바디: XXXBody
 * - 응답 데이터: XXXResponse
 *
 * - 공간 등록 요청: SpaceCreateBody
 * - 태그(편의시설) 등록 요청: TagsCreateParams
 * - 공간 수정 요청 파라미터: SpaceUpdateParams
 * - 공간 수정 요청 바디: SpaceUpdateBody
 * - 공간 삭제 요청: SpaceDeleteParams
 *
 * - 단건 조회 요청: SpaceDetailParams
 * - 단건 조회 응답: SpaceDetailResponse
 * - 전체 공간 리스트 조회 요청: SpaceAllListParams
 * - 전체 공간 리스트 조회 응답: SpaceAllListResponse
 * - 지역별 공간 리스트 조회 요청: SpaceRegionListParams
 * - 지역별 공간 리스트 조회 응답: SpaceRegionListResponse
 * - 담당자 리스트 조회 요청 파라미터: ManagerListParams
 * - 담당자 리스트 조회 응답: ManagerListResponse
 *
 * - 태그 조회 응답: TagsResponse
 * - 지역 리스트 조회 응답: RegionListResponse
 * - 지역 아이디로 주소 조회 요청 파라미터: AddressByRegionIdParams
 * - 지역 아이디로 주소 조회 응답: AddressByRegionIdResponse
 * - 카테고리 리스트 조회 응답: CategoryListResponse
 *
 */

// 운영 시간 타입
export type Operation = {
  day: number; // 1 ~ 7
  from: string; // HH:mm ex) 09:00
  to: string;
  isOpen: boolean;
};

// 휴무일 타입
type ClosedDay = {
  from: string; // ex) 2025-10-03T00:00:00
  to: string;
};

// 공간 등록/수정 타입
export type SpacePayload = {
  spaceName: string;
  spaceDescription: string;
  spaceCapacity: number;
  spaceIsAvailable: boolean;
  regionId: number;
  categoryId: number;
  locationId: number;
  tagNames: string[];
  adminId: number;
  reservationWay: string;
  spaceRules: string;
  operations: Operation[];
  closedDays: ClosedDay[];
};

/** 공간 등록 DTO */
export type SpaceCreateBody = {
  space: SpacePayload;
  images: File[];
};

/** 태그 등록 DTO */
export type TagsCreateParams = {
  tagName: string[];
};

/** 공간 수정 요청 파라미터 DTO */
export type SpaceUpdateParams = Pick<SpaceListItem, "spaceId">;

/** 공간 수정 요청 바디 DTO */
export type SpaceUpdateBody = SpaceCreateBody & {
  /**
   * 최종 이미지 순서 배열 (기존 URL + "new:i" 혼합)
   * 예시: ["https://.../E1.jpg", "new:0", "new:1", "https://.../E2.jpg", "new:2"]
   *
   * - 업로드한 새 파일 수 == new:0..new:(n-1) 토큰과 정확히 일치해야 함
   * - 빈 배열([])이면 모든 이미지 삭제로 간주
   */
  keepUrlsOrder: string[];
};

/** 공간 삭제 요청 DTO */
export type SpaceDeleteParams = Pick<SpaceDetailResponse, "spaceId">;

// 지역 타입
export type Region = {
  regionId: number;
  regionName: string;
};

// 카테고리 타입
type Category = {
  categoryId: number;
  categoryName: string;
};

// 주소 타입
type Location = {
  locationId: number;
  addressRoad: string;
};

// 관리자 권한 타입
type Admin = {
  adminId: number;
  adminNameWithRole: string;
};

/** 공간 단건 조회 요청 DTO */
export type SpaceDetailParams = Pick<SpaceListItem, "spaceId">;

/** 공간 단건 조회 응답 DTO */
export type SpaceDetailResponse = Omit<
  SpacePayload,
  "regionId" | "categoryId" | "locationId" | "adminId"
> & {
  spaceId: number;
  region: Region;
  category: Category;
  location: Location;
  admin: Admin;
  spaceImageUrl: string;
  detailImageUrls: string[];
};

// 공간 리스트 중 한 요소를 나타내는 타입
export type SpaceListItem = {
  spaceId: number;
  spaceName: string;
  regionName: string;
  regionId: number;
  adminName: string;
  spaceImageUrl: string;
  spaceIsAvailable: boolean;
};

// 페이지네이션 타입
type Pagination = {
  page: number;
  size: number;
};

/** 전체 공간 리스트 조회 요청 DTO */
export type SpaceAllListParams = Pagination;

/** 전체 공간 리스트 조회 응답 DTO */
export type SpaceAllListResponse = {
  content: SpaceListItem[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

/** 지역별 공간 리스트 조회 요청 DTO */
export type SpaceRegionListParams = Pick<Region, "regionId">;

/** 지역별 공간 리스트 조회 응답 DTO */
export type SpaceRegionListResponse = SpaceListItem[];

/** 담당자 리스트 조회 요청 DTO */
export type ManagerListParams = Pick<Region, "regionId">;

/** 담당자 리스트 조회 응답 DTO */
export type ManagerListResponse = Admin[];

type Tag = {
  tagId: number;
  tagName: string;
};

/** 태그 조회 응답 DTO */
export type TagsResponse = Tag[];

/** 지역 리스트 조회 응답 DTO */
export type RegionListResponse = Region[];

/** 지역 아이디로 주소 조회 요청 DTO */
export type AddressByRegionIdParams = Pick<Region, "regionId">;

/** 지역 아이디로 주소 조회 응답 DTO */
export type AddressByRegionIdResponse = {
  locationId: number;
  locationName: string;
  addressRoad: string;
  postalCode: string;
  accessInfo: string;
};

/** 카테고리 리스트 조회 응답 DTO */
export type CategoryListResponse = Category[];
