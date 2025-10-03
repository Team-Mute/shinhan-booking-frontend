import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import styled from "@emotion/styled";
import "react-datepicker/dist/react-datepicker.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { ko } from "date-fns/locale";
import colors from "@styles/theme";

const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}:${m}:${d}`;
};

interface CalendarProps {
  onSelectDate: (result: { single?: string; range?: [string, string] }) => void;
  selectedDate?: Date | [Date, Date] | null; // 단일 또는 구간
  availableDates?: number[]; // ✅ 추가 (1~31)
  onMonthChange?: (year: number, month: number) => void; // ✅ 추가
}

const Calendar = ({
  onSelectDate,
  selectedDate,
  availableDates,
  onMonthChange,
}: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState<Date | null>(
    selectedDate instanceof Date ? selectedDate : selectedDate?.[0] || null
  );

  const [range, setRange] = useState<[Date | null, Date | null]>(() => {
    if (!selectedDate) return [null, null];
    if (Array.isArray(selectedDate)) return [selectedDate[0], selectedDate[1]];
    return [selectedDate, selectedDate];
  });

  const [startDate, endDate] = range;

  // ✅ selectedDate props가 바뀔 때 currentDate와 range 동기화
  useEffect(() => {
    const newDate =
      selectedDate instanceof Date ? selectedDate : selectedDate?.[0] || null;
    setCurrentDate(newDate);
    setRange([newDate, newDate]); // startDate와 endDate 갱신
  }, [selectedDate]);

  const handleChange = (date: Date | null) => {
    if (!date) return;

    setCurrentDate(date); // ✅ currentDate 갱신
    setRange([date, date]); // ✅ startDate, endDate 갱신

    onSelectDate({ single: formatDate(date) }); // 단일 선택으로 전달
  };

  // const handleChange = (dates: Date | null) => {
  //   const start = dates;
  //   const end = dates;

  //   if (start && !end) {
  //     // 단일 선택처럼 보이게 (end를 start로 맞춤)
  //     setRange([start, null]);
  //     onSelectDate({ single: formatDate(start) });
  //   } else if (start && end) {
  //     // 구간 선택
  //     setRange([start, end]);
  //     onSelectDate({ range: [formatDate(start), formatDate(end)] });
  //   } else {
  //     setRange([null, null]);
  //   }
  // };

  return (
    <CalendarWrapper>
      <DatePicker
        locale={ko}
        // selectsRange
        openToDate={
          Array.isArray(selectedDate)
            ? selectedDate[0] || new Date() // 구간이면 첫 번째 날짜 사용
            : selectedDate || new Date() // 단일이면 그대로
        }
        minDate={new Date()}
        startDate={startDate}
        endDate={endDate}
        selected={currentDate} // ✅ 단일 선택 표시
        onChange={(update) => handleChange(update as Date | null)}
        dateFormat="yyyy-MM-dd"
        inline
        renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => {
          const year = date.getFullYear();
          const monthNumber = date.getMonth() + 1; // ✅ 숫자 (API 호출용)
          const monthLabel = (date.getMonth() + 1).toString().padStart(2, "0");
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                marginBottom: "1rem",
                gap: "0.5rem",
              }}
            >
              <button
                onClick={() => {
                  decreaseMonth();
                  onMonthChange?.(
                    date.getMonth() === 0 ? year - 1 : year,
                    date.getMonth() === 0 ? 12 : monthNumber - 1
                  );
                }}
                style={{ display: "flex" }}
              >
                <IoIosArrowBack size={20} />
              </button>
              <span style={{ fontSize: "1rem", fontWeight: "bold" }}>
                {year}, {monthLabel}월
              </span>
              <button
                onClick={() => {
                  increaseMonth();
                  onMonthChange?.(
                    date.getMonth() === 11 ? year + 1 : year,
                    date.getMonth() === 11 ? 1 : monthNumber + 1
                  );
                }}
                style={{ display: "flex" }}
              >
                <IoIosArrowForward size={20} />
              </button>
            </div>
          );
        }}
        // ✅ 선택 가능 날짜 제한
        filterDate={(date) => {
          if (!availableDates) return true; // 옵션 없으면 기본 동작
          return availableDates.includes(date.getDate());
        }}
        dayClassName={(date) => {
          let baseClass = "";
          const day = date.getDay();
          if (day === 0) baseClass = "sunday";
          if (day === 6) baseClass = "saturday";

          if (availableDates && !availableDates.includes(date.getDate())) {
            return `${baseClass} disabled-day`; // ✅ 회색 처리 클래스
          }
          return baseClass || "weekday";
        }}
      />
    </CalendarWrapper>
  );
};

export default Calendar;

const CalendarWrapper = styled.div`
  display: flex;
  justify-content: center;

  .react-datepicker {
    border: none;
    background: white;
  }

  /* 캘린더 날짜들 */
  .react-datepicker__month {
    margin: 0;
    // background: blue;
  }

  /* 연도, 월 헤더 & 요일 헤더 */
  .react-datepicker__header {
    background: white;
    border: none;
    padding-top: 0;

    font-family: "Pretendard", sans-serif;
    color: ${colors.graycolor100};
    font-size: 1.125rem;

    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  /* 요일 헤더 */
  .react-datepicker__day-names {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1.5rem;
    margin-bottom: 1rem;
    height: 1.875rem;

    align-items: center; /* 세로 가운데 정렬 */
    text-align: center; /* 글자 가운데 정렬 */
  }

  /* 요일 */
  .react-datepicker__day-name {
    font-family: Pretendard;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.125rem;
  }

  /* 일주일 */
  .react-datepicker__week {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1.5rem;
    margin-bottom: 0.32rem;
    // background: pink;

    font-family: "Pretendard", sans-serif;
    color: ${colors.graycolor100};
    font-size: 1.125rem;
  }

  /* 일자 */
  .react-datepicker__day {
    width: 1.875rem;
    height: 1.875rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin: 0;
    font-size: 0.9rem;
  }

  .react-datepicker__day--today {
    background: ${colors.graycolor20};
  }

  /* hover 중간 구간, 실제 확정된 중간 구간 */
  .react-datepicker__day--in-selecting-range:not(
      .react-datepicker__day--selecting-range-start
    ),
  .react-datepicker__day--in-range:not(
      .react-datepicker__day--selecting-range-start
    ) {
    background: ${colors.maincolor8} !important;
    color: black !important;
    border-radius: 50% !important;
  }

  /* ✅ 시작일/종료일은 in-range에 걸려도 파란 원 유지 */
  .react-datepicker__day--range-start.react-datepicker__day--in-range,
  .react-datepicker__day--range-end.react-datepicker__day--in-range {
    background: ${colors.maincolor} !important;
    color: white !important;
  }

  /* 단일 선택 상태 또는 첫 클릭 상태 */
  .react-datepicker__day--in-selecting-range,
  .react-datepicker__day--selecting-range-start,
  .react-datepicker__day--selected,
  .react-datepicker__day--range-start,
  .react-datepicker__day--range-end {
    background: ${colors.maincolor} !important;
    color: white !important;
    border-radius: 50% !important;
    z-index: 3 !important;
  }

  /* 요일 색상 */
  .sunday,
  .react-datepicker__day-name:nth-of-type(1) {
    color: red !important;
  }

  .saturday,
  .react-datepicker__day-name:nth-of-type(7) {
    color: blue !important;
  }

  .react-datepicker__day--outside-month {
    color: ${colors.graycolor100}; /* 흐린 색상 */
    opacity: 0.2; /* 살짝 투명하게 */
  }
  .disabled-day {
    color: ${colors.graycolor100} !important;
    opacity: 0.3;
    pointer-events: none; /* ✅ 클릭 불가 */
  }
`;
