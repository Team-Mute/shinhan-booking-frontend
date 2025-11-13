import { useState, useEffect, useMemo } from "react";
import { getAvailableTimesApi } from "@user/lib/api/reservation";
import { useReservationStore } from "@user/store/reservationStore";

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface UseReservationTimesProps {
  /** 공간 ID */
  spaceId: number;
  /** 선택된 연도 */
  year: number;
  /** 선택된 월 */
  month: number;
  /** 선택된 일 */
  day: number;
  /** 선택된 시작일 (Date 객체, 선택 안 됐을 경우 null) */
  startDate?: Date | null;
}

/**
 * useReservationTimes 훅
 * ---------------------------------------------
 * - 특정 공간의 예약 가능 시간을 API로 불러와 관리
 * - 30분 단위의 시간 슬롯 생성 및 시작/종료 시간 옵션 제공
 * - 예약 상태(reservationStore)와 연동
 */
export function useReservationTimes({
  spaceId,
  year,
  month,
  day,
  startDate,
}: UseReservationTimesProps) {
  /** API로 불러온 예약 가능 시간 배열 */
  const [availableTimes, setAvailableTimes] = useState<TimeSlot[]>([]);

  /** 예약 상태 전역 store */
  const { time, setReservation } = useReservationStore();

  /**
   * 예약 가능 시간 API 호출
   * - startDate가 없으면 요청하지 않음
   */
  useEffect(() => {
    if (!startDate) {
      setAvailableTimes([]);
      return;
    }

    const fetchTimes = async () => {
      try {
        const data = await getAvailableTimesApi(spaceId, year, month, day);
        setAvailableTimes(data.availableTimes || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTimes();
  }, [spaceId, year, month, day, startDate]);

  /**
   * 시간 구간을 30분 단위로 나누는 함수
   * @param startTime - 시작 시각 (HH:mm)
   * @param endTime - 종료 시각 (HH:mm)
   * @param interval - 분 단위 간격 (기본값 30분)
   */
  const getTimeSlots = (startTime: string, endTime: string, interval = 30) => {
    const slots: string[] = [];
    let [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    const current = new Date();
    current.setHours(startHour, startMin, 0, 0);

    const end = new Date();
    end.setHours(endHour, endMin, 0, 0);

    while (current <= end) {
      const h = current.getHours().toString().padStart(2, "0");
      const m = current.getMinutes().toString().padStart(2, "0");
      slots.push(`${h}:${m}`);
      current.setMinutes(current.getMinutes() + interval);
    }

    return slots;
  };

  /**
   * 시작 시간 옵션 생성
   * - 예약 가능 구간의 시작~끝 사이를 30분 단위로 분할
   * - 각 슬롯을 옵션(label/value) 형태로 변환
   */
  const startTimeOptions = useMemo(() => {
    return availableTimes
      .flatMap((t) => {
        const slots = getTimeSlots(t.startTime, t.endTime);
        return slots.slice(0, -1); // 마지막 슬롯(종료 시간)은 제외
      })
      .map((time) => ({ label: time, value: time }));
  }, [availableTimes]);

  /**
   * 종료 시간 옵션 생성
   * - 사용자가 선택한 시작 시간 이후의 시간만 표시
   * - 시작 시간 이후 최소 30분부터 선택 가능
   */
  const endTimeOptions = useMemo(() => {
    if (!time?.start) {
      return [];
    }

    // 사용자가 선택한 시작 시간이 포함된 구간 찾기
    const targetSlot = availableTimes.find(
      (t) => t.startTime <= time.start && time.start <= t.endTime
    );

    if (!targetSlot) {
      return [];
    }

    const slots = getTimeSlots(targetSlot.startTime, targetSlot.endTime);

    // 시작 시간 인덱스 확인
    const startIndex = slots.findIndex((s) => s >= time.start);
    if (startIndex === -1) {
      return [];
    }

    // 시작 시간 이후의 슬롯만 종료 시간으로 표시
    return slots.slice(startIndex + 1).map((t) => ({ label: t, value: t }));
  }, [availableTimes, time?.start]);

  /**
   * 시간 선택 핸들러
   * - 시작/종료 시간을 reservationStore에 저장
   */
  const handleSelectTime = (start: string, end: string) => {
    setReservation({
      time: { start, end },
    });
  };

  return {
    reservationTime: time,
    startTimeOptions,
    endTimeOptions,
    handleSelectTime,
  };
}
