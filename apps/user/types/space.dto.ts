/**
 * 공간 관련 DTO 모음
 *
 * 📌 네이밍 규칙:
 * - 요청 파라미터: XXXParams
 * - 요청 바디: XXXBody
 * - 응답 데이터: XXXResponse
 *
 * ===============================
 *
 * - 공간 검색 요청: SpaceListParams
 * - 공간 검색 응답: SpaceListResponse
 *
 * - 공간 단건조회 요청: SpaceDetailParams
 * - 공간 단건조회 응답: SpaceDetailResponse
 *
 * - 태그 조회 응답: TagsResponse
 * - 지역 리스트 조회 응답: RegionListResponse
 * - 지역 아이디로 주소 조회 요청 파라미터: AddressByRegionIdParams
 * - 지역 아이디로 주소 조회 응답: AddressByRegionIdResponse
 * - 카테고리 리스트 조회 응답: CategoryListResponse
 *
 */

export type Space = {
  spaceId: number;
  spaceName: string;
  spaceDescription: string;
  spaceCapacity: number;
  categoryId: number;
  categoryName: string;
  tagNames: string[];
  location: {
    // 예시: {@code {"locationName":"신한 스퀘어브릿지 서울", "addressRoad":"서울특별시 명동10길 52 (충무로2가 65-4)", "accessInfo":"명동역 도보 2분"}}
    locationName: string;
    addressRoad: string;
    addressInfo: string;
  };
  spaceImageUrl: string;
};

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

// 공간 담당자
type Manager = {
  managerName: string;
  managerPhone: string;
};

/** 공간 검색 요청 파라미터 DTO */
export type SpaceListParams = {
  regionId: number;
  people: number;
  tagNames: string[];
  startDateTime: string; // YYYY-MM-DDTHH:mm:ss
  endDateTime: string;
};

/** 공간 검색 응답 DTO */
export type SpaceListResponse = {
  meetingRoom: [Space];
  eventHall: [Space];
};

/** 공간 단건조회 요청 파라미터 DTO */
export type SpaceDetailParams = Pick<Space, "spaceId">;

/** 공간 단건조회 응답 DTO */
export type SpaceDetailResponse = Space & {
  regionName: string; // 지역 이름 (Space의 location 정보와 중복되지만, 응답 형태를 따름)
  reservationWay: string; // 예약 방식
  spaceRules: string; // 공간 이용 규칙
  manager: Manager; // 공간 관리자 정보
  detailImageUrls: string[]; // 상세 이미지 URL 목록
  operations: Operation[]; // 주간 운영 시간 정보
  closedDays: ClosedDay[]; // 휴무일 정보
};

type Tag = {
  tagId: number;
  tagName: string;
};

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
