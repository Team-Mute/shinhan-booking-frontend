export const DAYS: ("월" | "화" | "수" | "목" | "금" | "토" | "일")[] = [
  "월",
  "화",
  "수",
  "목",
  "금",
  "토",
  "일",
];

export const TIME_OPTIONS: { label: string; value: string }[] = Array.from(
  { length: 48 },
  (_, i) => {
    const h = String(Math.floor(i / 2)).padStart(2, "0");
    const m = i % 2 === 0 ? "00" : "30";
    const time = `${h}:${m}`;
    return { label: time, value: time };
  }
);

export const SEARCH_OPTIONS = [
  { label: "전체", value: "" },
  { label: "서울", value: "1" },
  { label: "인천", value: "2" },
  { label: "대구", value: "3" },
  { label: "대전", value: "4" },
];
