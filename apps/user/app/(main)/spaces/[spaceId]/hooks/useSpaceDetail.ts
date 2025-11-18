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

const toDateFromFilter = (
  value: string | Date | undefined
): Date | undefined => {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  const datePart = value.split("T")[0];
  return new Date(datePart + "T00:00:00.000Z");
};

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

  // 1. **수정:** reservationStore.startDate가 null일 경우, 오늘 날짜(new Date())를 사용하지 않음
  const baseDate = reservationStore.startDate; // startDate가 null 또는 Date 객체일 수 있음
  const today = new Date();

  // baseDate가 없으면 현재 년/월을 사용 (캘린더의 초기 뷰를 오늘 월로 설정)
  const year = baseDate?.getFullYear() || today.getFullYear();
  const month = (baseDate?.getMonth() ?? today.getMonth()) + 1;
  const day = baseDate?.getDate() || today.getDate();

  const { startTimeOptions, endTimeOptions } = useReservationTimes({
    spaceId,
    year,
    month,
    day,
    startDate: reservationStore.startDate,
  });

  const handleMonthChange = useCallback(
    (targetYear: number, targetMonth: number) => {
      if (!spaceId) return;
      getAvailableDatesApi(spaceId, targetYear, targetMonth)
        .then((res) => setAvailableDates(res.availableDays))
        .catch(() => setAvailableDates([]));
    },
    [spaceId]
  );

  // --- 초기 로딩
  useEffect(() => {
    if (!spaceId || !isInitialLoad) return;

    // 2. **수정:** 필터에 startDate가 없으면 today를 디폴트로 사용하지 않음
    const initialStartDate = toDateFromFilter(filterStore.startDate);
    const initialEndDate = toDateFromFilter(filterStore.endDate);
    const initialTime = filterStore.time;

    const isFilterRange =
      initialStartDate &&
      initialEndDate &&
      initialStartDate.toISOString().split("T")[0] !==
        initialEndDate.toISOString().split("T")[0];

    setReservation({
      capacity: filterStore.capacity ?? 1,
      // 필터 값이 없으면 null로 설정
      startDate: initialStartDate ?? null,
      endDate: isFilterRange ? initialEndDate : null,
      time: isFilterRange
        ? { start: "00:00", end: "23:59" }
        : initialTime?.start && initialTime.end
        ? initialTime
        : { start: undefined, end: undefined },
    });

    // startDate가 있을 때만 해당 월의 이용 가능 일자를 가져옴
    if (initialStartDate)
      handleMonthChange(
        initialStartDate.getFullYear(),
        initialStartDate.getMonth() + 1
      );
    // 선택된 날짜가 없는 경우, 현재 월의 이용 가능 일자를 미리 가져옴
    else {
      handleMonthChange(today.getFullYear(), today.getMonth() + 1);
    }

    setIsInitialLoad(false);
  }, [spaceId, isInitialLoad]);

  // --- 공간 상세 정보
  useEffect(() => {
    const fetchData = async () => {
      if (!spaceId) return;
      try {
        const res: SpaceDetailResponse = await getDetailSpaceApi(spaceId);
        setSpaceDetail(res);
        setReservation({
          spaceImageUrl: res.spaceImageUrl,
          spaceName: res.spaceName,
          spaceId: res.spaceId,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [spaceId]);

  // --- 날짜 선택 핸들러 (단일 / 기간 선택, 불가 날짜 체크)
  const handleSelectDate = useCallback(
    (result: { single?: string; range?: [string, string] }) => {
      if (!spaceId) return;

      if (!result.single && !result.range) {
        setReservation({
          startDate: null,
          endDate: null,
          time: { start: undefined, end: undefined },
        });
        return;
      }

      const isUnavailableInRange = (start: Date, end: Date) => {
        if (!availableDates || availableDates.length === 0) return false;
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dayNumber = d.getDate();
          // 현재 월이 아닐 경우 availableDates 체크를 건너뛰어야 하지만,
          // 현재 로직은 Calendar 컴포넌트에서 월이 변경될 때마다 availableDates를 업데이트하므로
          // 현재 표시된 달력 월에 대해서만 체크가 이루어집니다.
          // 하지만 기간 선택 시에는 선택한 기간 전체에 대한 체크가 필요할 수 있습니다.
          // (API 호출을 통해 전체 기간을 체크하는 것이 더 정확하지만, 현재 로직을 유지함)
          if (!availableDates.includes(dayNumber)) return true;
        }
        return false;
      };

      if (result.single) {
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
        const [startString, endString] = result.range;
        const start = toDateFromFilter(startString);
        const end = toDateFromFilter(endString);
        if (!start || !end) return;

        // **참고:** isUnavailableInRange 함수는 현재 표시되는 월의 availableDates만을 사용하여
        // 선택된 전체 기간의 유효성을 검사하는 데는 불완전할 수 있습니다.
        // 이 부분은 API 설계에 따라 추가적인 서버 체크 로직이 필요할 수 있습니다.
        if (isUnavailableInRange(start, end)) {
          alert("선택한 기간 내 이용 불가능한 날짜가 포함되어 있습니다.");
          return;
        }

        setReservation({
          startDate: start,
          endDate: end,
          time: { start: "00:00", end: "23:59" },
        });
        return;
      }
    },
    [spaceId, availableDates]
  );

  const handleChangeCapacity = useCallback(
    (count: number) => setReservation({ capacity: count }),
    [setReservation]
  );

  const handleReservationClick = useCallback(async () => {
    try {
      const data = await axiosClient.post("/api/auth/refresh");
      setAccessToken(data.data.accessToken);
      router.push(`/spaces/${spaceId}/reservation`);
    } catch (err) {
      open("로그인 필요", "예약을 진행하려면\n로그인이 필요합니다.");
    }
  }, [spaceId]);

  const selectedStartDate = reservationStore.startDate;
  const selectedEndDate = reservationStore.endDate;

  const isRangeSelected = useMemo(() => {
    if (!selectedStartDate || !selectedEndDate) return false;
    return (
      selectedStartDate.getFullYear() !== selectedEndDate.getFullYear() ||
      selectedStartDate.getMonth() !== selectedEndDate.getMonth() ||
      selectedStartDate.getDate() !== selectedEndDate.getDate()
    );
  }, [selectedStartDate, selectedEndDate]);

  const isReservable = useMemo(() => {
    const isSingleDayReady =
      !isRangeSelected &&
      !!selectedStartDate &&
      !!reservationStore.time?.start &&
      !!reservationStore.time?.end;
    const isRangeReady =
      isRangeSelected && !!selectedStartDate && !!selectedEndDate;
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

  const adjustedStartTimeOptions = useMemo(
    () =>
      isRangeSelected ? [{ label: "00:00", value: "00:00" }] : startTimeOptions,
    [isRangeSelected, startTimeOptions]
  );
  const adjustedEndTimeOptions = useMemo(
    () =>
      isRangeSelected ? [{ label: "23:59", value: "23:59" }] : endTimeOptions,
    [isRangeSelected, endTimeOptions]
  );

  return {
    spaceDetail,
    reservationStore,
    availableDates,
    spaceIdParam,
    selectedStartDate,
    selectedEndDate,
    isRangeSelected,
    isReservable,
    adjustedStartTimeOptions,
    adjustedEndTimeOptions,
    setReservation,
    handleMonthChange,
    handleSelectDate,
    handleChangeCapacity,
    handleReservationClick,
  };
}
