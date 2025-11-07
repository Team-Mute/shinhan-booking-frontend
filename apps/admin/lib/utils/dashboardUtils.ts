import { RawReservationData, ProcessedReservation, ReservationStatus } from "@admin/types/dashBoardAdmin";

/**
 * 날짜 문자열을 로컬 시간으로 파싱
 */
export const parseLocalDate = (dateString: string): Date => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return new Date(year, month, day);
};

/**
 * 날짜를 YYYY-MM-DD 형식으로 변환 (타임존 오프셋 없이)
 */
export const formatDateOnly = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * 날짜 범위를 생성
 */
export const getDateRange = (startDate: Date, endDate: Date): string[] => {
  const dates: string[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(formatDateOnly(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

/**
 * API 데이터를 캘린더에 표시할 형식으로 변환
 */
export const processApiData = (rawData: RawReservationData[]): ProcessedReservation[] => {
  return rawData.map((item) => {
    const fromDate = new Date(item.reservationFrom);
    const toDate = new Date(item.reservationTo);

    const fromDateOnly = parseLocalDate(item.reservationFrom);
    const toDateOnly = parseLocalDate(item.reservationTo);

    const isSameDay = formatDateOnly(fromDateOnly) === formatDateOnly(toDateOnly);

    let time: string;
    let dates: string[];

    if (isSameDay) {
      // 같은 날: 실제 시간 표시
      const fromTime = `${String(fromDate.getHours()).padStart(2, "0")}:${String(
        fromDate.getMinutes()
      ).padStart(2, "0")}`;
      const toTime = `${String(toDate.getHours()).padStart(2, "0")}:${String(
        toDate.getMinutes()
      ).padStart(2, "0")}`;
      time = `${fromTime} ~ ${toTime}`;
      dates = [formatDateOnly(fromDateOnly)];
    } else {
      // 다른 날: 00:00 ~ 23:59 표시
      time = "00:00 ~ 23:59";
      dates = getDateRange(fromDateOnly, toDateOnly);
    }

    const status = item.reservationStatusName as ReservationStatus;

    return {
      id: item.reservationId,
      dates: dates,
      time: time,
      user: item.userName,
      status: status,
    };
  });
};