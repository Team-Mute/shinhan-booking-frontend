import { StatusFilter, ReservationStatusInfo } from "@admin/types/dashBoardAdmin";
import { 
  STATUS_COLORS_BY_NAME, 
  DOT_COLORS 
} from "@styles/statusStyles";

/**
 * 상태 매니저 클래스
 * - API에서 받은 상태 정보를 관리
 * - 싱글톤 패턴으로 앱 전체에서 공유
 */
class StatusManager {
  private static instance: StatusManager;
  private statusMap: Map<number, ReservationStatusInfo> = new Map();
  private labelToIdMap: Map<string, number> = new Map();
  private initialized: boolean = false;

  private constructor() {}

  static getInstance(): StatusManager {
    if (!StatusManager.instance) {
      StatusManager.instance = new StatusManager();
    }
    return StatusManager.instance;
  }

  /**
   * API에서 받은 상태 정보로 초기화
   */
  initialize(apiFilters: StatusFilter[]): void {
    this.statusMap.clear();
    this.labelToIdMap.clear();

    apiFilters
      .filter(filter => filter.type === 'STATUS')
      .forEach(filter => {
        const statusInfo: ReservationStatusInfo = {
          id: filter.id,
          key: this.generateStatusKey(filter.description),
          label: filter.description,
          color: DOT_COLORS[filter.description as keyof typeof DOT_COLORS] || '#8C8F93',
          bgColor: STATUS_COLORS_BY_NAME[filter.description as keyof typeof STATUS_COLORS_BY_NAME]?.bg || '#F3F4F4',
        };

        this.statusMap.set(filter.id, statusInfo);
        this.labelToIdMap.set(filter.description, filter.id);
      });

    this.initialized = true;
  }

  /**
   * description으로부터 상태 키 생성
   */
  private generateStatusKey(description: string): string {
    const keyMap: Record<string, string> = {
      "1차 승인 대기": "FIRST_APPROVAL_PENDING",
      "2차 승인 대기": "SECOND_APPROVAL_PENDING",
      "최종 승인 완료": "FINAL_APPROVED",
      "이용 완료": "COMPLETED",
      "예약 취소": "CANCELLED",
      "반려": "REJECTED",
    };

    return keyMap[description] || description.toUpperCase().replace(/\s+/g, '_');
  }

  /**
   * 상태 ID로 정보 조회
   */
  getStatusById(id: number): ReservationStatusInfo | undefined {
    return this.statusMap.get(id);
  }

  /**
   * 상태 레이블로 ID 조회
   */
  getIdByLabel(label: string): number | undefined {
    return this.labelToIdMap.get(label);
  }

  /**
   * 모든 상태 정보 조회
   */
  getAllStatuses(): ReservationStatusInfo[] {
    return Array.from(this.statusMap.values());
  }

  /**
   * 초기화 여부 확인
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * 상태 색상 조회
   */
  getStatusColor(label: string): string {
    const id = this.labelToIdMap.get(label);
    if (!id) return '#8C8F93';
    
    const status = this.statusMap.get(id);
    return status?.color || '#8C8F93';
  }

  /**
   * 상태 배경색 조회
   */
  getStatusBgColor(label: string): string {
    const id = this.labelToIdMap.get(label);
    if (!id) return '#F3F4F4';
    
    const status = this.statusMap.get(id);
    return status?.bgColor || '#F3F4F4';
  }
}

export const statusManager = StatusManager.getInstance();