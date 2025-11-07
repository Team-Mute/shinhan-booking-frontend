import React from "react";
import styled from "@emotion/styled";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { statusOptions } from "../components/CalendarSettingModal";

interface CalendarHeaderProps {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  onSettingsClick: () => void;
  visibleStatuses: string[];
}

/**
 * 캘린더 헤더 컴포넌트
 * - 월 네비게이션
 * - 설정 버튼
 * - 범례 표시
 */
const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  date,
  setDate,
  onSettingsClick,
  visibleStatuses,
}) => {
  /**
   * 월 변경 핸들러
   */
  const changeMonth = (amount: number) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + amount);
    setDate(newDate);
  };

  // 현재 표시중인 상태만 필터링
  const activeLegendItems = statusOptions.filter((option) =>
    visibleStatuses.includes(option.id)
  );

  return (
    <HeaderWrapper>
      <TopRow>
        {/* 월 네비게이션 */}
        <MonthNavigator>
          <button onClick={() => changeMonth(-1)} aria-label="이전 달">
            <IoIosArrowBack size={20} />
          </button>
          <span>
            {date.getFullYear()}, {date.getMonth() + 1}월
          </span>
          <button onClick={() => changeMonth(1)} aria-label="다음 달">
            <IoIosArrowForward size={20} />
          </button>
        </MonthNavigator>

        {/* 설정 버튼 */}
        <SettingsButton onClick={onSettingsClick} aria-label="캘린더 설정">
          <svg
            width="16"
            height="18"
            viewBox="0 0 16 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.68293 0.588116C9.19836 0.175506 8.57665 -0.00541516 7.9842 0.000123232C7.39266 0.00658469 6.77735 0.200429 6.29736 0.611193C5.80365 1.03396 5.48639 1.6598 5.48639 2.43609C5.48639 2.79978 5.25234 3.18193 4.85188 3.42193C4.45417 3.66008 4.02263 3.68039 3.7063 3.49393L3.68618 3.48193C3.00687 3.1127 2.31476 3.06839 1.70677 3.29362C1.11432 3.51331 0.660837 3.96377 0.381068 4.48438C-0.169327 5.51175 -0.118128 7.02373 1.1582 7.89234L1.19569 7.91634C1.48643 8.0871 1.69488 8.48125 1.6958 8.97786C1.6958 9.47355 1.48551 9.8677 1.19569 10.0385L1.18655 10.0449C0.528266 10.4474 0.149755 11.0372 0.0363849 11.6815C-0.0733284 12.3083 0.0729561 12.9387 0.369182 13.4538C0.665408 13.9689 1.1326 14.4092 1.72048 14.6289C2.32391 14.8541 3.0151 14.8292 3.68618 14.4646L3.7063 14.4526C4.05738 14.2458 4.47246 14.2873 4.85097 14.5504C5.2432 14.8209 5.48639 15.2593 5.48639 15.6599C5.48639 16.4298 5.81005 17.0418 6.31381 17.4461C6.79838 17.8347 7.4146 18.0045 7.99609 17.9999C8.57757 17.9953 9.19013 17.8162 9.67013 17.4276C10.1675 17.027 10.4966 16.4215 10.4966 15.6599C10.4966 15.239 10.7407 14.7996 11.1229 14.5347C11.4905 14.28 11.9055 14.2347 12.2758 14.4526L12.2968 14.4636C12.9826 14.8375 13.6865 14.8587 14.2973 14.6206C14.8897 14.388 15.3551 13.931 15.6449 13.4077C15.9338 12.8852 16.0765 12.2474 15.9585 11.6234C15.8378 10.9828 15.4502 10.4031 14.7791 10.0338C14.4929 9.86031 14.2863 9.46801 14.2863 8.97232C14.2863 8.47387 14.4966 8.0788 14.7864 7.90803L14.7956 7.90157C15.4548 7.49819 15.8333 6.90927 15.9466 6.26497C16.0564 5.63821 15.9092 5.00776 15.6129 4.49268C15.3176 3.97854 14.8495 3.53731 14.2625 3.31762C13.6591 3.09239 12.967 3.11732 12.2968 3.48193L12.2758 3.49393C11.9768 3.66931 11.5444 3.65454 11.1375 3.4127C10.7307 3.17085 10.4975 2.79055 10.4966 2.43609C10.4966 1.6478 10.1849 1.01365 9.68293 0.588116ZM5.02834 9.00002C5.02834 8.20438 5.3414 7.44132 5.89864 6.87872C6.45589 6.31612 7.21168 6.00005 7.99974 6.00005C8.78781 6.00005 9.54359 6.31612 10.1008 6.87872C10.6581 7.44132 10.9711 8.20438 10.9711 9.00002C10.9711 9.79566 10.6581 10.5587 10.1008 11.1213C9.54359 11.6839 8.78781 12 7.99974 12C7.21168 12 6.45589 11.6839 5.89864 11.1213C5.3414 10.5587 5.02834 9.79566 5.02834 9.00002Z"
              fill="#BABCBE"
            />
          </svg>
        </SettingsButton>
      </TopRow>

      {/* 범례 */}
      <Legend>
        {activeLegendItems.map((option) => (
          <LegendItem key={option.id}>
            <Dot color={option.color} />
            <span>{option.label}</span>
          </LegendItem>
        ))}
      </Legend>
    </HeaderWrapper>
  );
};

export default CalendarHeader;

// Styled Components
const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const MonthNavigator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;

  button {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 4px;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.7;
    }
  }
`;

const SettingsButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;

const Legend = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
`;

const Dot = styled.div<{ color: string }>`
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  flex-shrink: 0;
`;