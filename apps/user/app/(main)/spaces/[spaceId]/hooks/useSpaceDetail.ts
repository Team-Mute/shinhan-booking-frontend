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

  const baseDate = reservationStore.startDate || new Date();
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth() + 1;
  const day = baseDate.getDate();

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

    const initialStartDate =
      toDateFromFilter(filterStore.startDate) || toDateFromFilter(new Date());
    const initialEndDate = toDateFromFilter(filterStore.endDate);
    const initialTime = filterStore.time;

    const isFilterRange =
      initialStartDate &&
      initialEndDate &&
      initialStartDate.toISOString().split("T")[0] !==
        initialEndDate.toISOString().split("T")[0];

    setReservation({
      capacity: filterStore.capacity ?? 1,
      startDate: initialStartDate,
      endDate: isFilterRange ? initialEndDate : null,
      time: isFilterRange
        ? { start: "00:00", end: "23:59" }
        : initialTime?.start && initialTime.end
        ? initialTime
        : { start: undefined, end: undefined },
    });

    if (initialStartDate)
      handleMonthChange(
        initialStartDate.getFullYear(),
        initialStartDate.getMonth() + 1
      );

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

      const isUnavailableInRange = (start: Date, end: Date) => {
        if (!availableDates || availableDates.length === 0) return false;
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dayNumber = d.getDate();
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
