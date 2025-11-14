import { useState, useEffect, useMemo } from "react";
import { getAvailableTimesApi } from "@user/lib/api/reservation";
import { useReservationStore } from "@user/store/reservationStore";

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface UseReservationTimesProps {
  spaceId: number;
  year: number;
  month: number;
  day: number;
  startDate?: Date | null;
}

// --- 시작 시간을 30분 단위로 올림 ---
const roundUpToNextHalfHour = (time: string) => {
  let [h, m, s] = time.split(":").map(Number);
  if (m === 0 || m === 30)
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  if (m < 30) m = 30;
  else {
    h += 1;
    m = 0;
  }
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

/**
 * useReservationTimes 훅
 * - 예약 가능 시간을 API 호출 후 30분 단위로 변환
 */
export function useReservationTimes({
  spaceId,
  year,
  month,
  day,
  startDate,
}: UseReservationTimesProps) {
  const [availableTimes, setAvailableTimes] = useState<TimeSlot[]>([]);
  const { time } = useReservationStore();

  // --- 예약 가능 시간 API 호출 ---
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

  // --- 시간 슬롯 생성 (30분 단위) ---
  const getTimeSlots = (startTime: string, endTime: string, interval = 30) => {
    const slots: string[] = [];
    const roundedStart = roundUpToNextHalfHour(startTime);
    let [startHour, startMin] = roundedStart.split(":").map(Number);
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

  // --- 시작 시간 옵션 ---
  const startTimeOptions = useMemo(() => {
    return availableTimes
      .flatMap((t) => {
        const slots = getTimeSlots(t.startTime, t.endTime);
        return slots.slice(0, -1); // 마지막 종료 슬롯 제외
      })
      .map((time) => ({ label: time, value: time }));
  }, [availableTimes]);

  // --- 종료 시간 옵션 ---
  const endTimeOptions = useMemo(() => {
    if (!time?.start) return [];

    // 선택한 시작 시간 포함 구간 찾기
    let targetSlot = availableTimes.find(
      (t) => t.startTime <= time.start && time.start < t.endTime
    );

    // 포함되는 구간이 없으면, 시작 시간보다 이후 구간 선택
    if (!targetSlot) {
      targetSlot = availableTimes.find((t) => t.startTime > time.start);
      if (!targetSlot) return [];
    }

    const slots = getTimeSlots(targetSlot.startTime, targetSlot.endTime);
    const startIndex = slots.findIndex((s) => s > time.start); // start보다 큰 것만
    if (startIndex === -1) return [];

    return slots.slice(startIndex).map((t) => ({ label: t, value: t }));
  }, [availableTimes, time?.start]);

  return {
    reservationTime: time,
    startTimeOptions,
    endTimeOptions,
  };
}
