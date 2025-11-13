export function combineDateAndTime(
  date?: Date, // e.g. Thu Oct 30 2025 09:00:00 GMT+0900
  time?: string, // e.g. "15:30"
  mode: "start" | "end" = "start"
): string | undefined {
  if (!date) return undefined; // ✅ 날짜 없으면 undefined 반환

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 0-based → +1
  const day = String(date.getDate()).padStart(2, "0");

  let hours: number;
  let minutes: number;
  let seconds: number;

  if (time) {
    const [h, m] = time.split(":").map(Number);
    hours = h ?? 0;
    minutes = m ?? 0;
    seconds = 0;
  } else {
    if (mode === "start") {
      hours = 0;
      minutes = 0;
      seconds = 0;
    } else {
      hours = 23;
      minutes = 59;
      seconds = 59;
    }
  }

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return `${year}-${month}-${day}T${hh}:${mm}:${ss}`;
}
