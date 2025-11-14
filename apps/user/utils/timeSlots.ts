/**
 * get30MinSlotsFromRanges
 * - API에서 받아온 { startTime: "HH:mm", endTime: "HH:mm" } 배열을 받아
 *   30분 단위 슬롯 문자열 배열로 변환
 *
 * 예: [{ startTime: "09:00", endTime: "10:30" }] => ["09:00","09:30","10:00","10:30"]
 */

export const get30MinSlotsFromRanges = (
  ranges: { startTime: string; endTime: string }[]
) => {
  const slots: string[] = [];

  const toMinutes = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  };
  const minutesToHHMM = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  ranges.forEach(({ startTime, endTime }) => {
    const start = toMinutes(startTime);
    const end = toMinutes(endTime);
    for (let t = start; t <= end; t += 30) {
      slots.push(minutesToHHMM(t));
    }
  });

  return slots;
};
