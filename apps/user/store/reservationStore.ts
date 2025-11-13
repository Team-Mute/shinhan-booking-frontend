import { create } from "zustand";

type ReservationTime = {
  start: string | undefined;
  end: string | undefined;
};

type ReservationStore = {
  capacity: number | undefined;
  // 💖 [수정] startDateTime -> startDate, 타입: Date | undefined
  startDate: Date | undefined;
  // 💖 [수정] endDateTime -> endDate, 타입: Date | undefined
  endDate: Date | undefined;

  time: ReservationTime | undefined;

  spaceImageUrl: string | undefined;
  spaceName: string | undefined;
  spaceId: number | undefined;

  setReservation: (
    reservation: Partial<
      Omit<
        ReservationStore,
        // 💖 [수정] Omit에서 startDateTime과 endDateTime 제거
        "setReservation" | "clearReservation"
      > & {
        // 💖 [추가] 외부에서 입력받는 속성으로 startDate, endDate 정의
        startDate?: Date | string | undefined;
        endDate?: Date | string | undefined;
      }
    >
  ) => void;
  clearReservation: () => void;
};

// 💖 [삭제] stringToDate 헬퍼 함수 추가 (ISO string 또는 Date를 Date 객체로 변환)
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

// 💖 [삭제] toISOString 헬퍼 함수는 더 이상 필요하지 않습니다.

export const useReservationStore = create<ReservationStore>((set) => ({
  capacity: undefined,
  startDate: undefined, // 💖 [수정] 초기값 유지 (타입은 Date)
  endDate: undefined, // 💖 [수정] 초기값 유지 (타입은 Date)
  time: undefined,

  spaceImageUrl: undefined,
  spaceName: undefined,
  spaceId: undefined,

  setReservation: (reservation) =>
    set((state) => {
      console.log(
        "🚀 [reservationStore] New Filters Applied:",
        reservation,
        state
      );

      // 1. 💖 [수정] startDate와 endDate를 임시 변수에 저장하고 원본 'reservation'에서 제외
      //    나머지 속성들은 Omit 처리되어 Type Safe 함
      const { startDate, endDate, ...restReservation } = reservation;

      // 2. 나머지 속성들을 안전하게 Partial<ReservationStore> 타입으로 복사
      const updates: Partial<ReservationStore> = { ...restReservation };

      // 3. 💖 [수정] 입력받은 값(Date | string)을 toDate 헬퍼 함수를 사용하여 Date 객체로 변환
      const newStart = toDate(startDate);
      const newEnd = toDate(endDate);

      // 4. 💖 [수정] 변환된 Date 객체 값을 updates 객체에 수동으로 할당
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
