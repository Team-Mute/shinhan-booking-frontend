import { useCallback, useEffect, useMemo, useState } from "react";
import { useReservationStore } from "@user/store/reservationStore";
import { getAccountApi } from "@user/lib/api/user";
import {
  createReservationApi,
  getAvailableDatesApi,
  getAvailableTimesApi,
} from "@user/lib/api/reservation";
import { combineDateAndTime } from "@user/utils/combineDateTime";
import { useImgUpload } from "@user/hooks/useImgUpload";
import {
  format,
  addMinutes,
  parse,
  differenceInCalendarDays,
  isAfter,
  isBefore,
  startOfDay,
} from "date-fns";
import { ko } from "date-fns/locale";
import { useModalStore } from "@user/store/modalStore";
import { ReservPayload, ReservCreateBody } from "@user/types/reservation.dto";

export interface TimeOption {
  time: string; // "HH:mm" 형식 (예: "09:00")
  isAvailable: boolean;
}

/**
 * useReservationConfirm
 * - ReservationConfirmPage 의 모든 상태/비즈니스 로직을 분리
 * - 기존 페이지와 동일한 API 호출/흐름을 유지
 */
export function useReservationConfirm() {
  const reservationStore = useReservationStore();
  const { open } = useModalStore();

  // 사용자 정보
  const [user, setUser] = useState<{
    userName: string;
    userEmail: string;
    userPhone: string;
  } | null>(null);

  // 목적
  const [purpose, setPurpose] = useState("");

  // 예약 성공 모달
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // file upload 훅
  const {
    files,
    isDragging,
    inputRef,
    openPicker,
    onChange,
    onDrop,
    onDragOver,
    onDragEnter,
    onDragLeave,
    removeAt,
  } = useImgUpload(5);

  // availableDates for calendar
  const [availableDates, setAvailableDates] = useState<number[]>([]);

  // Previsit (사전답사) 상태
  const [isPrevisitChecked, setIsPrevisitChecked] = useState(false);
  const [selectedPrevisitDate, setSelectedPrevisitDate] = useState<Date | null>(
    null
  );
  const [availablePrevisitTimes, setAvailablePrevisitTimes] = useState<
    { startTime: string; endTime: string }[]
  >([]);
  const [selectedPrevisitTime, setSelectedPrevisitTime] = useState<string>("");

  // -------------------- fetch user on mount --------------------
  useEffect(() => {
    const fetch = async () => {
      try {
        const u = await getAccountApi();
        setUser({
          userName: u.userName,
          userEmail: u.userEmail,
          userPhone: u.userPhone,
        });
      } catch (err) {
        console.error("사용자 정보 로딩 실패:", err);
      }
    };
    fetch();
  }, []);

  // -------------------- initial availableDates load (current month) --------------------
  useEffect(() => {
    if (!reservationStore.spaceId) return;
    const baseDate = new Date();
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth() + 1;

    getAvailableDatesApi(Number(reservationStore.spaceId), year, month)
      .then((res) => setAvailableDates(res.availableDays))
      .catch((err) => console.error(err));
  }, [reservationStore.spaceId, reservationStore.startDate]);

  // -------------------- previsit: handle calendar month change (used by Calendar) --------------------
  const handleMonthChange = useCallback(
    (year: number, month: number) => {
      if (!reservationStore.spaceId) return;
      getAvailableDatesApi(Number(reservationStore.spaceId), year, month)
        .then((res) => setAvailableDates(res.availableDays))
        .catch((err) => {
          console.error("이용 가능일 조회 실패", err);
          setAvailableDates([]);
        });
    },
    [reservationStore.spaceId]
  );

  // 캘린더에 표시할 필터링된 이용 가능 날짜
  const filteredAvailableDates = useMemo(() => {
    // 예약 시작일이 없으면 필터링하지 않습니다.
    if (!reservationStore.startDate) {
      return availableDates;
    }

    // 예약 시작일의 00:00:00 시점을 기준으로 설정합니다.
    const reservStartDay = startOfDay(reservationStore.startDate);

    // API에서 받은 availableDates (숫자 배열)를 필터링합니다.
    return availableDates.filter((day) => {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const checkDate = new Date(currentYear, currentMonth, day);

      return isBefore(checkDate, reservStartDay);
    });
  }, [availableDates, reservationStore.startDate]);

  // -------------------- previsit: when user selects a date on Calendar --------------------
  const handleSelectPrevisitDate = useCallback(
    async (result: { single?: string; range?: [string, string] }) => {
      if (!reservationStore.spaceId || !reservationStore.startDate) return;
      if (!result.single) return;

      const dateParts =
        result.single.indexOf("-") > -1
          ? result.single.split("-")
          : result.single.split(":");
      const [year, month, day] = dateParts.map(Number);
      const dateObj = new Date(year, (month || 1) - 1, day);

      // 선택된 날짜가 예약 시작일보다 이후인지 확인 (이후는 선택 불가)
      // 예약 시작일과 같거나 이후는 선택할 수 없으므로, isAfter(선택일, 예약시작일)을 체크
      const reservStartDay = startOfDay(reservationStore.startDate);
      const selectedDay = startOfDay(dateObj);

      // 예약 시작일과 같거나 이후라면 선택을 무시
      if (
        isAfter(selectedDay, reservStartDay) ||
        selectedDay.getTime() === reservStartDay.getTime()
      ) {
        open(
          "날짜 선택 오류",
          "사전 답사일은 예약 시작일 이전의 날짜여야 합니다."
        );
        setSelectedPrevisitDate(null);
        setAvailablePrevisitTimes([]);
        setSelectedPrevisitTime("");
        return;
      }

      setSelectedPrevisitDate(dateObj);
      setSelectedPrevisitTime("");

      try {
        const res = await getAvailableTimesApi(
          reservationStore.spaceId!,
          year,
          month,
          day
        );
        setAvailablePrevisitTimes(res.availableTimes || []);
      } catch (err) {
        console.error("사전답사 가능 시간 조회 실패", err);
        setAvailablePrevisitTimes([]);
      }
    },
    [reservationStore.spaceId, reservationStore.startDate, open] // open 추가
  );

  // -------------------- previsit: create AM / PM options (30min slots) --------------------
  const { amOptions, pmOptions } = useMemo(() => {
    // 1. 00:00부터 23:30까지 모든 30분 슬롯을 생성(48개 슬롯 확보)
    const allPossibleSlots: string[] = [];

    let checkTime = parse("00:00", "HH:mm", new Date());
    const endHour = 24;

    while (checkTime.getHours() < endHour) {
      allPossibleSlots.push(format(checkTime, "HH:mm"));
      checkTime = addMinutes(checkTime, 30);

      if (checkTime.getHours() === 0 && checkTime.getMinutes() === 0) break;
    }

    // 2. API 응답의 시간 범위를 Date 객체로 파싱하여 비교하기 쉬운 형태로 준비합니다.
    const availableRanges = availablePrevisitTimes.map((slot) => {
      const start = parse(slot.startTime.substring(0, 5), "HH:mm", new Date());
      const end = parse(slot.endTime.substring(0, 5), "HH:mm", new Date());
      return { start, end };
    });

    // 3. 전체 슬롯을 순회하며 이용 가능 여부(isAvailable)를 판단하여 객체 배열을 생성합니다.
    const combinedSlots: TimeOption[] = allPossibleSlots.map((slotTime) => {
      const slotStart = parse(slotTime, "HH:mm", new Date());
      const slotEnd = addMinutes(slotStart, 30);

      let isAvailable = false;

      for (const range of availableRanges) {
        // 슬롯 시작 시간이 Range.start >= 이고 슬롯 종료 시간이 Range.end <= 이어야 함
        if (
          slotStart.getTime() >= range.start.getTime() &&
          slotEnd.getTime() <= range.end.getTime()
        ) {
          isAvailable = true;
          break;
        }
      }

      return {
        time: slotTime,
        isAvailable: isAvailable,
      };
    });

    // 4. AM/PM으로 분리합니다.
    const amSlots = combinedSlots.filter(
      (s) => Number(s.time.split(":")[0]) < 12
    );
    const pmSlots = combinedSlots.filter(
      (s) => Number(s.time.split(":")[0]) >= 12
    );

    return { amOptions: amSlots, pmOptions: pmSlots };
  }, [availablePrevisitTimes]);

  // -------------------- submit reservation --------------------
  const handleSubmit = useCallback(async () => {
    if (purpose.trim() === "") {
      open("입력 오류", "사용 목적을 입력해주세요.");
      return;
    }

    // 종료시간 가공 로직
    // 만약 종료 시간이 23:59이면, combineDateAndTime을 호출할 때 초(second) 정보를 59로 명시하도록 수정
    const endDateTime = reservationStore.endDate || reservationStore.startDate;
    const endTime = reservationStore.time?.end;

    let processedReservationTo;
    if (endTime === "23:59") {
        // 23:59일 경우, 날짜만 조합하고 시간을 23:59:59로 수동 설정
        const formattedDate = format(endDateTime, "yyyy-MM-dd");
        processedReservationTo = `${formattedDate}T23:59:59`;
    } else {
        // 그 외의 경우, combineDateAndTime 로직 사용 (예: 10:30:00)
        processedReservationTo = combineDateAndTime(
            endDateTime,
            endTime,
            "end"
        ) ?? "";
    }

    try {
      // ... (예약 페이로드 구성 및 API 호출) ...
      const reservationPayload: ReservPayload = {
        spaceId: reservationStore.spaceId || 0,
        reservationHeadcount: reservationStore.capacity || 0,
        reservationFrom:
          combineDateAndTime(
            reservationStore.startDate,
            reservationStore.time?.start,
            "start"
          ) ?? "",
        reservationTo: processedReservationTo,
        reservationPurpose: purpose,
        reservationAttachments: [],
        previsitInfo:
          isPrevisitChecked && selectedPrevisitDate && selectedPrevisitTime
            ? {
                previsitFrom: combineDateAndTime(
                  selectedPrevisitDate,
                  selectedPrevisitTime,
                  "start"
                )!,
                previsitTo: combineDateAndTime(
                  selectedPrevisitDate,
                  format(
                    addMinutes(
                      parse(selectedPrevisitTime, "HH:mm", new Date()),
                      30
                    ),
                    "HH:mm"
                  ),
                  "end"
                )!,
              }
            : null,
      };

      const request: ReservCreateBody = {
        requestDto: reservationPayload,
        files,
      };

      await createReservationApi(request);

      setIsSuccessModalOpen(true);
    } catch (err) {
      console.error("예약 생성 실패:", err);
      open("예약 실패", "예약에 실패했습니다. 다시 시도해주세요.");
    }
  }, [
    purpose,
    reservationStore.spaceId,
    reservationStore.capacity,
    reservationStore.startDate,
    reservationStore.endDate,
    reservationStore.time,
    isPrevisitChecked,
    selectedPrevisitDate,
    selectedPrevisitTime,
    files,
    open,
  ]);

  // -------------------- display: formatted date/time text --------------------
  const getReservationDisplay = useCallback(() => {
    const { startDate, endDate, time } = reservationStore;
    if (!startDate || !time?.start || !time?.end)
      return { dateText: "", timeText: "" };

    // ... (표시 로직 생략) ...
    if (!(time.start === "00:00" && time.end === "23:59")) {
      const dateText = format(startDate, "yyyy년 MM월 dd일 EEEE", {
        locale: ko,
      });
      const [startHour, startMin] = time.start.split(":").map(Number);
      const [endHour, endMin] = time.end.split(":").map(Number);
      const diffMinutes = endHour * 60 + endMin - (startHour * 60 + startMin);
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      const timeText = `${time.start}~${time.end}, ${hours}시간${
        minutes > 0 ? ` ${minutes}분` : ""
      }`;
      return { dateText, timeText };
    }

    const end = reservationStore.endDate || reservationStore.startDate;
    const dateText = `${format(
      reservationStore.startDate!,
      "yyyy년 MM월 dd일 EEEE",
      { locale: ko }
    )} ~ ${format(end!, "yyyy년 MM월 dd일 EEEE", { locale: ko })}`;
    const durationDays =
      differenceInCalendarDays(end!, reservationStore.startDate!) + 1;
    const timeText = `${durationDays}일`;
    return { dateText, timeText };
  }, [reservationStore]);

  const { dateText, timeText } = useMemo(
    () => getReservationDisplay(),
    [getReservationDisplay]
  );

  return {
    // data / state
    user,
    purpose,
    setPurpose,
    isPrevisitChecked,
    setIsPrevisitChecked,
    files,
    isDragging,
    inputRef,
    openPicker,
    onChange,
    onDrop,
    onDragOver,
    onDragEnter,
    onDragLeave,
    removeAt,

    reservationStore,
    availableDates: filteredAvailableDates,

    // previsit
    selectedPrevisitDate,
    amOptions,
    pmOptions,
    selectedPrevisitTime,
    setSelectedPrevisitTime,

    // display
    dateText,
    timeText,

    // handlers
    handleMonthChange,
    handleSelectPrevisitDate,
    handleSubmit,

    isSuccessModalOpen,
    setIsSuccessModalOpen,
  };
}
