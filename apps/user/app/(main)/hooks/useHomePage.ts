import { useState, useEffect, useMemo, useCallback } from "react";
import { format } from "date-fns";
import {
  getRegionMenuListApi,
  getSpaceListApi,
  getTagsApi,
} from "@user/lib/api/space";
import {
  Region,
  RegionListResponse,
  Space,
  SpaceListResponse,
} from "@user/types/space.dto";
import { useFilterStore } from "@user/store/filterStore";

/** 모달 타입 정의 */
type ModalType = "people" | "date" | "tags" | null;

/** 시간 옵션 상수 (30분 단위) */
export const TIME_OPTIONS = [
  ...Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2)
      .toString()
      .padStart(2, "0");
    const minute = i % 2 === 0 ? "00" : "30";
    const value = `${hour}:${minute}`;
    return { label: value, value };
  }),
  { label: "23:59", value: "23:59" },
];

/** 시간 선택 초기 레이블 상수 */
export const INITIAL_START_LABEL = "시작시간";
export const INITIAL_END_LABEL = "종료시간";

/**
 * useHomePage 훅
 * 메인 페이지(공간 검색)에서 필요한 모든 상태와 필터링 로직을 관리하는 커스텀 훅
 * @description 지역, 인원, 날짜/시간, 편의시설 등 필터 상태 관리 및 공간 목록 조회 로직 포함
 */
export function useHomePage() {
  // --- 상태: 필터 및 모달 관리 ---
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const {
    setFilters,
    regionId: storeRegionId,
    capacity: storeCapacity,
    startDate: storeStartDate,
    time: storeTime,
    tagNames: storeTagNames,
  } = useFilterStore();

  // regions, selected region
  const [regions, setRegions] = useState<Region[]>([]); // 지역 목록
  const [regionId, setRegionId] = useState<number>(storeRegionId ?? 1); // 선택된 지역 ID

  // 전체 태그 리스트
  const [tagNames, setTagNames] = useState<
    { tagId: number; tagName: string }[]
  >([]);

  // --- 상태: 실제(커밋된) 필터 값들 ---
  const [capacity, setCapacity] = useState<number>(storeCapacity ?? 0);

  // FilterStore 값으로 초기 startDateTime 구성
  const initialStartDateTime =
    storeStartDate && storeTime?.start
      ? `${storeStartDate}T${storeTime.start}:00`
      : undefined;

  // FilterStore 값으로 초기 endDateTime 구성 (23:59 시 초 설정 반영)
  const initialEndDateTime =
    storeStartDate && storeTime?.end
      ? `${storeStartDate}T${storeTime.end}:${
          storeTime.end === "23:59" ? "59" : "00"
        }`
      : undefined;

  const [startDateTime, setStartDateTime] = useState<string | undefined>(
    initialStartDateTime
  );
  const [endDateTime, setEndDateTime] = useState<string | undefined>(
    initialEndDateTime
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    storeTagNames ?? []
  );

  // --- 상태: 임시값 (모달에서만 바뀜) ---
  const [tempCapacity, setTempCapacity] = useState(capacity); // 임시 인원
  const [tempStartDate, setTempStartDate] = useState<Date | null>(null); // 임시 날짜(시작)
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null); // 임시 날짜(종료)
  const [tempStartTime, setTempStartTime] =
    useState<string>(INITIAL_START_LABEL);
  const [tempEndTime, setTempEndTime] = useState<string>(INITIAL_END_LABEL);
  const [tempTagNames, setTempTagNames] = useState<string[]>([]); // 임시 태그
  const [showTimePicker, setShowTimePicker] = useState(false); // 시간 선택기 표시 여부

  // --- 상태: 공간 목록 ---
  const [meetingRoomList, setMeetingRoomList] = useState<Space[]>([]);
  const [eventHallList, setEventHallList] = useState<Space[]>([]);

  // -------------------------------------------------------------
  // 비즈니스 로직: 공간 검색 (API 호출 및 FilterStore 저장)
  // -------------------------------------------------------------
  /**
   * @description 현재 설정된 필터 조건 또는 인자로 받은 조건으로 공간을 조회합니다.
   * @param params 검색 조건 객체 (선택적)
   */
  const fetchSpaces = useCallback(
    async (params?: {
      regionId?: number;
      capacity?: number;
      tagNames?: string[];
      startDateTime?: string;
      endDateTime?: string;
    }) => {
      try {
        const res: SpaceListResponse = await getSpaceListApi({
          regionId: params?.regionId ?? regionId ?? undefined,
          people: params?.capacity ?? capacity ?? undefined,
          tagNames: params?.tagNames ?? selectedTags ?? [],
          startDateTime: params?.startDateTime ?? startDateTime ?? undefined,
          endDateTime: params?.endDateTime ?? endDateTime ?? undefined,
        });

        setMeetingRoomList(res.meetingRoom);
        setEventHallList(res.eventHall);

        // 시간 (HH:mm) 추출
        const newStartTime = params?.startDateTime
          ?.split("T")[1]
          ?.substring(0, 5);
        const newEndTime = params?.endDateTime?.split("T")[1]?.substring(0, 5);

        // 날짜 (YYYY-MM-DD) 추출
        const newStartDate = params?.startDateTime?.split("T")[0];
        const newEndDate = params?.endDateTime?.split("T")[0];

        // 검색할 때마다 필터값 저장 (FilterStore 업데이트)
        setFilters({
          regionId: params?.regionId ?? regionId,
          capacity: params?.capacity ?? capacity,
          tagNames: params?.tagNames ?? selectedTags,
          startDate: newStartDate,
          endDate: newEndDate,
          time: {
            start: newStartTime,
            end: newEndTime,
          },
        });
      } catch (err) {
        console.error("공간 조회 실패", err);
      }
    },
    [regionId, capacity, selectedTags, startDateTime, endDateTime, setFilters]
  );

  // -------------------------------------------------------------
  // Effect: 초기 데이터 로드 및 검색
  // -------------------------------------------------------------

  // 페이지 진입 시 초기 검색 (FilterStore에 저장된 값 기반)
  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  // 지역 목록 가져오기
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res: RegionListResponse = await getRegionMenuListApi();
        // regionId가 1~4인 것만 필터링
        const filtered = res.filter((r) => r.regionId >= 1 && r.regionId <= 4);
        setRegions(filtered);
      } catch (err) {
        console.error("지역 불러오기 실패", err);
      }
    };
    fetchRegions();
  }, []);

  // 태그 목록 가져오기
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await getTagsApi();
        setTagNames(res);
      } catch (err) {
        console.error("태그 불러오기 실패", err);
      }
    };
    fetchTags();
  }, []);

  // -------------------------------------------------------------
  // 유틸: 임시값을 커밋된 값으로 초기화 (모달 열기/취소 시 사용)
  // -------------------------------------------------------------
  const resetTempsFromCommitted = useCallback(() => {
    // 1. 인원
    setTempCapacity(capacity);

    // 2. 날짜/시간
    if (startDateTime) {
      const d = new Date(startDateTime);
      setTempStartDate(d);
      setTempStartTime(startDateTime.slice(11, 16)); // "HH:mm"만 추출
    } else {
      setTempStartDate(null);
      setTempStartTime(INITIAL_START_LABEL); // 초기값으로 설정
    }

    if (endDateTime) {
      const d2 = new Date(endDateTime);
      setTempEndDate(d2);
      setTempEndTime(endDateTime.slice(11, 16));
    } else {
      setTempEndDate(null);
      setTempEndTime(INITIAL_END_LABEL); // 초기값으로 설정
    }

    // 3. 태그
    setTempTagNames(selectedTags.slice());

    // 4. 시간 선택기 표시 여부
    setShowTimePicker(Boolean(startDateTime || endDateTime));
  }, [capacity, startDateTime, endDateTime, selectedTags]);

  // -------------------------------------------------------------
  // 이벤트 핸들러: 모달 제어
  // -------------------------------------------------------------
  /**
   * @description 모달을 열거나 닫습니다. 닫을 때 '취소'로 간주하여 임시값을 리셋합니다.
   * @param key 열거나 닫을 모달의 타입
   */
  const handleToggle = useCallback(
    (key: ModalType) => {
      if (openModal === key) {
        // 열려있으면 닫기 (취소)
        resetTempsFromCommitted();
        setOpenModal(null);
        return;
      }
      // 닫혀있으면 열기 (초기값 세팅)
      resetTempsFromCommitted();
      setOpenModal(key);
    },
    [openModal, resetTempsFromCommitted]
  );

  // -------------------------------------------------------------
  // 이벤트 핸들러: 지역 선택
  // -------------------------------------------------------------
  /**
   * @description 지역 변경 시 지역 ID 상태를 업데이트하고 즉시 검색을 실행합니다.
   * @param selectedRegionId 선택된 지역 ID
   */
  const handleRegionSelect = useCallback(
    (selectedRegionId: number) => {
      setRegionId(selectedRegionId);
      fetchSpaces({ regionId: selectedRegionId });
    },
    [fetchSpaces]
  );

  // -------------------------------------------------------------
  // 이벤트 핸들러: 날짜/시간 선택
  // -------------------------------------------------------------
  /**
   * @description 캘린더에서 날짜를 선택했을 때 임시 날짜 상태를 업데이트합니다.
   * @param result 캘린더 선택 결과 ({single: string} 또는 {range: [string, string]})
   */
  const handleSelectDate = useCallback(
    (result: { single?: string; range?: [string, string] }) => {
      if (result.single) {
        const date = new Date(result.single);
        setTempStartDate(date);
        setTempEndDate(null); // 하루 선택 시 종료일은 null

        // 하루 선택 시 시간 초기화
        setTempStartTime(INITIAL_START_LABEL);
        setTempEndTime(INITIAL_END_LABEL);
        setShowTimePicker(true);
      } else if (result.range) {
        const start = new Date(result.range[0]);
        const end = new Date(result.range[1]);
        setTempStartDate(start);
        setTempEndDate(end); // 기간 선택 완료 시 종료일 설정

        // 기간 선택 시 00:00 ~ 23:59 고정
        setTempStartTime("00:00");
        setTempEndTime("23:59");
        setShowTimePicker(true);
      }
    },
    []
  );

  // -------------------------------------------------------------
  // 유틸: 시간 옵션 계산 (컴퓨티드 값)
  // -------------------------------------------------------------
  const parseTime = useCallback((time: string) => {
    if (!time || time === INITIAL_START_LABEL || time === INITIAL_END_LABEL)
      return null;
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  }, []);

  const startMinutes = parseTime(tempStartTime);
  const endMinutes = parseTime(tempEndTime);

  // 시작 시간 옵션 (모든 시간대 포함)
  const startOptions = useMemo(
    () => TIME_OPTIONS.map(({ label, value }) => ({ label, value })),
    []
  );

  // 종료 시간 옵션 (시작 시간 이후만)
  const endOptions = useMemo(() => {
    if (startMinutes === null) {
      return []; // 시작 시간 선택 전엔 종료 목록 비어있게
    }
    return TIME_OPTIONS.filter(({ value }) => {
      const minutes = parseTime(value)!;
      return minutes > startMinutes; // 시작 시간 이후만
    }).map(({ label, value }) => ({ label, value }));
  }, [startMinutes, parseTime]);

  // -------------------------------------------------------------
  // 이벤트 핸들러: 모달 적용 (커밋 및 검색)
  // -------------------------------------------------------------
  /** @description 인원 선택 모달의 '적용' 버튼 처리. 임시 인원을 커밋하고 검색합니다. */
  const handleApplyCapacity = useCallback(() => {
    setCapacity(tempCapacity);
    fetchSpaces({ capacity: tempCapacity });
    setOpenModal(null);
  }, [tempCapacity, fetchSpaces]);

  /** @description 날짜 선택 모달의 '적용' 버튼 처리. 임시 날짜/시간을 커밋하고 검색합니다. */
  const handleApplyDate = useCallback(() => {
    if (tempStartDate) {
      // 1. 시작 시간/날짜 구성
      const start = `${format(
        tempStartDate,
        "yyyy-MM-dd"
      )}T${tempStartTime}:00`;

      // 2. 종료 시간/날짜 구성 (tempEndDate가 null이면 tempStartDate와 동일하게 처리)
      const endDateToUse = tempEndDate || tempStartDate; // null이면 시작 날짜 사용
      const endTimeToUse = tempEndTime;
      const secondValue = endTimeToUse === "23:59" ? "59" : "00";
      const end = `${format(
        endDateToUse,
        "yyyy-MM-dd"
      )}T${endTimeToUse}:${secondValue}`;

      // 3. 커밋
      setStartDateTime(start);
      setEndDateTime(end);

      // 4. 검색 실행
      fetchSpaces({ startDateTime: start, endDateTime: end });
    }
    setOpenModal(null);
  }, [tempStartDate, tempEndDate, tempStartTime, tempEndTime, fetchSpaces]);

  /** @description 편의시설 모달의 '적용' 버튼 처리. 임시 태그를 커밋하고 검색합니다. */
  const handleApplyFacilities = useCallback(() => {
    setSelectedTags(tempTagNames.slice());
    fetchSpaces({ tagNames: tempTagNames.slice() });
    setOpenModal(null);
  }, [tempTagNames, fetchSpaces]);

  // -------------------------------------------------------------
  // 컴퓨터드 값: 렌더링에 필요한 추가 값
  // -------------------------------------------------------------
  /** @description 날짜 선택 모달의 적용 버튼 활성화 여부 */
  const isDateApplyActive = useMemo(
    () =>
      !!tempStartDate &&
      (!!tempEndDate || // Case 1: 기간이 선택된 경우
        (tempStartTime !== INITIAL_START_LABEL && // Case 2: 하루만 선택된 경우 & 시간 설정 완료
          tempEndTime !== INITIAL_END_LABEL)),
    [tempStartDate, tempEndDate, tempStartTime, tempEndTime]
  );

  /** @description 날짜 선택 모달에서 기간(Range) 선택 모드 여부 */
  const isDateRangeSelected = useMemo(
    () =>
      !!tempStartDate &&
      !!tempEndDate &&
      tempStartDate.toDateString() !== tempEndDate.toDateString(),
    [tempStartDate, tempEndDate]
  );

  // --- 반환 값 ---
  return {
    // 상태
    openModal,
    regions,
    regionId,
    tagNames,
    meetingRoomList,
    eventHallList,
    tempCapacity,
    tempStartDate,
    tempEndDate,
    tempStartTime,
    tempEndTime,
    tempTagNames,
    showTimePicker,

    // 컴퓨터드 값
    startOptions,
    endOptions,
    isDateApplyActive,
    isDateRangeSelected,

    // 설정 함수
    setTempCapacity,
    setTempStartTime,
    setTempEndTime,
    setTempTagNames,
    setOpenModal,

    // 핸들러
    handleToggle,
    handleRegionSelect,
    handleSelectDate,
    handleApplyCapacity,
    handleApplyDate,
    handleApplyFacilities,
    resetTempsFromCommitted,
  };
}
