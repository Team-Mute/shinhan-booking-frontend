// JSON 데이터에 맞는 타입 정의
export interface Previsit {
    previsitId: number;
    previsitFrom: string;
    previsitTo: string;
}

export interface Reservation {
    reservationId: number;
    reservationStatusName: string;
    spaceName: string;
    userName: string;
    reservationHeadcount: number;
    reservationFrom: string;
    reservationTo: string;
    regDate: string;
    isShinhan: boolean;
    isEmergency: boolean;
    isApprovable: boolean;
    isRejectable: boolean;
    previsits: Previsit[];
    regionId: number;
    statusId: number;
}

export interface ReservationResponse {
    content: Reservation[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}


export interface ReservationsParams {
    page: number;
    size: number;
    keyword?: string;
    statusId?: number | null;
    regionId?: number | null;
    isShinhan?: boolean;
    isEmergency?: boolean;
}

/**
 * 상세 보기 API 응답에 대한 타입
 * 이전에 사용하던 Reservation 타입과 구조가 다름
 */
export interface ReservationDetail {
  reservationId: number;
  spaceName: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
    company: string;
  };
  reservationPurpose: string;
  reservationHeadcount: number;
  reservationFrom: string;
  reservationTo: string;
  orderId: string;
  reservationStatusName: string;
  isApprovable: boolean;
  isRejectable: boolean;
  previsits?: {
    previsitFrom: string;
    previsitTo: string;
  }[];
  statusId: number;
}

export interface ApproveResponse {
    total: number;
    successCount: number;
    failureCount: number;
    results: {
        reservationId: number;
        success: boolean;
        message: string;
    }[];
}

// 필터링 드롭다운
export interface StatusOption {
  id: number;
  label: string;
}

export interface RegionOption {
  regionId: number;
  regionName: string;
}

export interface FlagOption {
  key: string;
  label: string;
}