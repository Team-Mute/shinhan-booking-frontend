import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFilterStore } from "@user/store/filterStore";
import { useReservationStore } from "@user/store/reservationStore";
import { useAuthStore } from "@user/store/authStore";
import { useModalStore } from "@user/store/modalStore";
import { getDetailSpaceApi } from "@user/lib/api/space";
import { getAvailableDatesApi } from "@user/lib/api/reservation";
import { useReservationTimes } from "./useReservationTimes";
import { SpaceDetailResponse } from "@user/types/space.dto";
import axiosClient from "@user/lib/api/axiosClient";

/**
 * FilterStore의 string 값을 Date 객체로 변환하는 헬퍼 함수
 * @param value 'YYYY-MM-DD' 형식의 문자열 또는 Date 객체
 * @returns UTC 00:00:00으로 설정된 Date 객체 또는 undefined
 */
const toDateFromFilter = (
  value: string | Date | undefined
): Date | undefined => {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  const datePart = value.split("T")[0];
  // UTC 00:00:00으로 설정하여 클라이언트 시간대 문제 방지
  return new Date(datePart + "T00:00:00.000Z");
};

/**
 * 공간 상세 페이지의 모든 상태 및 로직을 관리하는 커스텀 훅
 */
export function useSpaceDetail() {
  const router = useRouter();
  const { spaceId: spaceIdParam } = useParams<{ spaceId: string }>();
  const spaceId = Number(spaceIdParam);

  const { open } = useModalStore();
  const { setAccessToken } = useAuthStore();
  const filterStore = useFilterStore();
  const reservationStore = useReservationStore();
  const { setReservation } = useReservationStore();

  const [spaceDetail, setSpaceDetail] = useState<SpaceDetailResponse | null>(
    null
  );
  const [availableDates, setAvailableDates] = useState<number[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 현재 예약 상태를 기준으로 시간 옵션 조회를 위한 Date 정보 추출
  const baseDate = reservationStore.startDate || new Date();
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth() + 1;
  const day = baseDate.getDate();

  // 예약 가능 시간 옵션을 가져오는 훅
  const { startTimeOptions, endTimeOptions } = useReservationTimes({
    spaceId: spaceId,
    year,
    month,
    day,
    startDate: reservationStore.startDate,
  });

  // -------------------------------------------------------------
  // 캘린더 월 이동 시 이용 가능일 조회 (API 호출)
  // -------------------------------------------------------------
  const handleMonthChange = useCallback(
    (targetYear: number, targetMonth: number) => {
      if (!spaceId) return;

      getAvailableDatesApi(spaceId, targetYear, targetMonth)
        .then((res) => {
          setAvailableDates(res.availableDays);
        })
        .catch((err) => {
          console.error("이용 가능일 조회 에러", err);
          setAvailableDates([]);
        });
    },
    [spaceId]
  );

  // -------------------------------------------------------------
  // Effect 1: 초기 진입 시 filterStore 값 -> reservationStore로 반영
  // -------------------------------------------------------------
  useEffect(() => {
    if (!spaceId || !isInitialLoad) return;

    // 1. 날짜 데이터 준비 및 기간 선택 여부 확인
    const initialStartDate =
      toDateFromFilter(filterStore.startDate) || toDateFromFilter(new Date());
    const initialEndDate = toDateFromFilter(filterStore.endDate);
    const initialTime = filterStore.time;

    const isFilterRange =
      initialStartDate &&
      initialEndDate &&
      initialStartDate.toISOString().split("T")[0] !==
        initialEndDate.toISOString().split("T")[0];

    // 2. reservationStore에 값 반영
    setReservation({
      capacity: filterStore.capacity ?? 1,
      startDate: initialStartDate,
      endDate: isFilterRange ? initialEndDate : null, // 기간 선택 시에만 endDate 설정
      time: isFilterRange
        ? { start: "00:00", end: "23:59" } // 기간 선택이면 고정 시간 적용
        : initialTime?.start && initialTime.end
        ? initialTime // 단일 선택이고 time 값이 있으면 적용
        : { start: undefined, end: undefined }, // 아니면 초기화
    });

    // 3. 캘린더 초기 월 이용 가능일 조회
    if (initialStartDate) {
      handleMonthChange(
        initialStartDate.getFullYear(),
        initialStartDate.getMonth() + 1
      );
    }

    setIsInitialLoad(false);
  }, [spaceId, isInitialLoad]);

  // -------------------------------------------------------------
  // Effect 2: 공간 상세 정보 및 기본 예약 정보 설정
  // -------------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      if (!spaceId) return;
      try {
        const res: SpaceDetailResponse = await getDetailSpaceApi(spaceId);
        setSpaceDetail(res);

        // 예약 확인 페이지에서 쓰일 데이터 설정
        setReservation({
          spaceImageUrl: res.spaceImageUrl,
          spaceName: res.spaceName,
          spaceId: res.spaceId,
        });
      } catch (err) {
        console.error("공간 상세 정보 조회 실패", err);
      }
    };
    fetchData();
  }, [spaceId, setReservation]);

  // -------------------------------------------------------------
  // 이벤트 핸들러: 날짜 선택 시 예약 store 반영 (기간 선택 로직 포함)
  // -------------------------------------------------------------
  const handleSelectDate = useCallback(
    (result: { single?: string; range?: [string, string] }) => {
      if (!spaceId) return;

      if (result.single) {
        // 1. 단일 날짜 선택
        const selected = toDateFromFilter(result.single);
        if (!selected) return;

        setReservation({
          startDate: selected,
          endDate: null,
          time: { start: undefined, end: undefined },
        });
        return;
      }

      if (result.range) {
        // 2. 기간 선택
        const [startString, endString] = result.range;
        const start = toDateFromFilter(startString);
        const end = toDateFromFilter(endString);

        if (!start || !end) return;

        setReservation({
          startDate: start,
          endDate: end,
          time: { start: "00:00", end: "23:59" }, // 기간 선택 시 시간 고정
        });
        return;
      }
    },
    [spaceId, setReservation]
  );

  /** @description 인원 변경 핸들러 */
  const handleChangeCapacity = useCallback(
    (count: number) => {
      setReservation({ capacity: count });
    },
    [setReservation]
  );

  /** @description 예약 버튼 클릭 핸들러 (인증 및 페이지 이동) */
  const handleReservationClick = useCallback(async () => {
    try {
      // Refresh 토큰을 사용하여 새로운 Access Token 획득
      const data = await axiosClient.post("/api/auth/refresh");
      setAccessToken(data.data.accessToken);
      // 성공 → 예약 페이지로 이동
      router.push(`/spaces/${spaceId}/reservation`);
    } catch (err) {
      // 실패 → 로그인 필요 모달
      open("로그인 필요", "예약을 진행하려면\n로그인이 필요합니다.");
    }
  }, [spaceId, setAccessToken, router, open]);

  // -------------------------------------------------------------
  // 컴퓨터드 값 (useMemo)
  // -------------------------------------------------------------
  const selectedStartDate = reservationStore.startDate;
  const selectedEndDate = reservationStore.endDate;

  /** @description 현재 선택된 날짜가 기간 선택(Range)인지 확인하는 플래그 */
  const isRangeSelected = useMemo(() => {
    if (!selectedStartDate || !selectedEndDate) return false;

    // 년/월/일이 다르면 기간 선택으로 간주
    const isDifferentDate =
      selectedStartDate.getFullYear() !== selectedEndDate.getFullYear() ||
      selectedStartDate.getMonth() !== selectedEndDate.getMonth() ||
      selectedStartDate.getDate() !== selectedEndDate.getDate();

    return isDifferentDate;
  }, [selectedStartDate, selectedEndDate]);

  /** @description 예약 가능 여부 판단 플래그 */
  const isReservable = useMemo(() => {
    // 1. 단일 날짜: 날짜 O, 시작/종료 시간 O
    const isSingleDayReady =
      !isRangeSelected &&
      !!selectedStartDate &&
      !!reservationStore.time?.start &&
      !!reservationStore.time?.end;

    // 2. 기간 선택: 시작 날짜 O, 종료 날짜 O (시간은 고정됨)
    const isRangeReady =
      isRangeSelected && !!selectedStartDate && !!selectedEndDate;

    // 3. 인원 체크
    const hasCapacity =
      !!reservationStore.capacity && reservationStore.capacity > 0;

    return (isSingleDayReady || isRangeReady) && hasCapacity;
  }, [
    selectedStartDate,
    selectedEndDate,
    isRangeSelected,
    reservationStore.time?.start,
    reservationStore.time?.end,
    reservationStore.capacity,
  ]);

  /** @description 기간 선택 시 '00:00'으로 고정된 시작 시간 옵션 */
  const adjustedStartTimeOptions = useMemo(() => {
    if (isRangeSelected) {
      return [{ label: "00:00", value: "00:00" }];
    }
    return startTimeOptions;
  }, [isRangeSelected, startTimeOptions]);

  /** @description 기간 선택 시 '23:59'으로 고정된 종료 시간 옵션 */
  const adjustedEndTimeOptions = useMemo(() => {
    if (isRangeSelected) {
      return [{ label: "23:59", value: "23:59" }];
    }
    return endTimeOptions;
  }, [isRangeSelected, endTimeOptions]);

  // --- 훅 반환 값 ---
  return {
    // 상태 및 데이터
    spaceDetail,
    reservationStore,
    availableDates,
    spaceIdParam,

    // 컴퓨터드 값
    selectedStartDate,
    selectedEndDate,
    isRangeSelected,
    isReservable,
    adjustedStartTimeOptions,
    adjustedEndTimeOptions,

    // 핸들러
    setReservation,
    handleMonthChange,
    handleSelectDate,
    handleChangeCapacity,
    handleReservationClick,
  };
}
