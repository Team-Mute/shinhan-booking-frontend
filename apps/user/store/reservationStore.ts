import { create } from "zustand";

type ReservationTime = {
  start: string | undefined;
  end: string | undefined;
};

// --- 예약 상태 타입 정의 ---
type ReservationStore = {
  capacity: number | undefined; // 선택된 인원 수
  startDate: Date | undefined; // 예약 시작 날짜
  endDate: Date | undefined; // 예약 종료 날짜

  time: ReservationTime | undefined; // 선택된 시간 범위

  spaceImageUrl: string | undefined; // 예약할 공간 이미지 URL
  spaceName: string | undefined; // 예약할 공간 이름
  spaceId: number | undefined; // 예약할 공간 ID

  // 예약 상태 업데이트 함수
  setReservation: (
    reservation: Partial<
      Omit<ReservationStore, "setReservation" | "clearReservation"> & {
        startDate?: Date | string | undefined;
        endDate?: Date | string | undefined;
      }
    >
  ) => void;
  clearReservation: () => void;
};

// stringToDate 헬퍼 함수 추가 (ISO string 또는 Date를 Date 객체로 변환)
const toDate = (
  dateOrString: Date | string | undefined | null
): Date | undefined => {
  if (dateOrString === undefined || dateOrString === null) return undefined;
  if (dateOrString instanceof Date) return dateOrString;

  // string인 경우 Date 객체로 변환
  if (typeof dateOrString === "string") {
    // 'YYYY-MM-DD' 문자열인 경우, T00:00:00.000Z를 붙여 UTC 0시 기준으로 Date 생성
    const datePart = dateOrString.split("T")[0];
    return new Date(datePart + "T00:00:00.000Z");
  }
  return undefined;
};

export const useReservationStore = create<ReservationStore>((set) => ({
  capacity: undefined,
  startDate: undefined, //초기값 유지 (타입은 Date)
  endDate: undefined, // 초기값 유지 (타입은 Date)
  time: undefined,

  spaceImageUrl: undefined,
  spaceName: undefined,
  spaceId: undefined,

  setReservation: (reservation) =>
    set((state) => {
      // 1. startDate와 endDate를 임시 변수에 저장하고 원본 'reservation'에서 제외
      //    나머지 속성들은 Omit 처리되어 Type Safe 함
      const { startDate, endDate, ...restReservation } = reservation;

      // 2. 나머지 속성들을 안전하게 Partial<ReservationStore> 타입으로 복사
      const updates: Partial<ReservationStore> = { ...restReservation };

      // 3. 입력받은 값(Date | string)을 toDate 헬퍼 함수를 사용하여 Date 객체로 변환
      const newStart = toDate(startDate);
      const newEnd = toDate(endDate);

      // 4. 변환된 Date 객체 값을 updates 객체에 수동으로 할당
      if (startDate !== undefined) {
        updates.startDate = newStart;
      }
      if (endDate !== undefined) {
        updates.endDate = newEnd;
      }

      // 5. time 업데이트 시 start/end가 모두 undefined이면 time 자체를 undefined로 설정
      if (
        updates.time &&
        updates.time.start === undefined &&
        updates.time.end === undefined
      ) {
        updates.time = undefined;
      }

      return { ...state, ...updates };
    }),

  clearReservation: () =>
    set({
      capacity: undefined,
      startDate: undefined,
      endDate: undefined,
      time: undefined,
      spaceImageUrl: undefined,
      spaceName: undefined,
      spaceId: undefined,
    }),
}));
