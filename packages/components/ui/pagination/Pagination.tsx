import React from "react";
import styled from "@emotion/styled";
import colors from "@styles/theme";
/**
 * 페이지네이션 컴포넌트
 *
 * 이 컴포넌트는 페이지 목록을 탐색할 수 있는 페이지네이션 컨트롤을 렌더링합니다.
 * 현재 표시할 페이지 번호 그룹을 처리하며, 이전/다음 페이지 그룹으로 이동하기 위한 버튼을 제공합니다.
 *
 * '@emotion/styled'를 사용하여 스타일링되었으며, 그룹 탐색을 위해 아이콘 이미지(prev.svg, next.svg)를 사용합니다.
 *
 * @param {number} currentPage - 현재 활성화된 페이지 번호.
 * @param {number} totalPages - 전체 페이지 수.
 * @param {number} startPage - 현재 보이는 페이지 그룹의 시작 페이지 번호.
 * @param {number} endPage - 현재 보이는 페이지 그룹의 끝 페이지 번호.
 * @param {function(number): void} onPageChange - 개별 페이지 번호 클릭 시 실행되는 콜백 함수.
 * @param {function(): void} onPrevGroup - '이전 그룹' 버튼 클릭 시 실행되는 콜백 함수.
 * @param {function(): void} onNextGroup - '다음 그룹' 버튼 클릭 시 실행되는 콜백 함수.
 */
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  startPage: number;
  endPage: number;
  onPageChange: (page: number) => void;
  onPrevGroup: () => void;
  onNextGroup: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  startPage,
  endPage,
  onPageChange,
  onPrevGroup,
  onNextGroup,
}) => {
  if (totalPages <= 0) return null;

  return (
    <PaginationWrapper>
      {/* 이전 그룹 버튼 */}
      {totalPages > 1 && (
        <PageButton disabled={startPage === 1} onClick={onPrevGroup}>
          <img src="/icons/prev.svg" alt="이전" width={20} height={20} />
        </PageButton>
      )}

      {/* 페이지 번호 목록 */}
      {Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
      ).map((page) => (
        <PageNumber
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </PageNumber>
      ))}

      {/* 다음 그룹 버튼 */}
      {totalPages > 1 && (
        <PageButton
          disabled={endPage >= totalPages}
          onClick={onNextGroup}
        >
          <img src="/icons/next.svg" alt="다음" width={20} height={20} />
        </PageButton>
      )}
    </PaginationWrapper>
  );
};

export default Pagination;

const PageButton = styled.button<{ disabled?: boolean }>`
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ disabled }) => (disabled ? "#ccc" : colors.graycolor100)};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PageNumber = styled.button<{ active?: boolean }>`
  background: ${({ active }) => (active ? colors.graycolor10 : "transparent")};
  color: ${({ active }) => (active ? colors.graycolor100 : colors.graycolor50)};
  font-weight: 600;
  border-radius: 2rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border: ${({ active }) =>
    active ? `1px solid ${colors.graycolor10}` : "none"};
`;

const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
  gap: 1rem;
`;