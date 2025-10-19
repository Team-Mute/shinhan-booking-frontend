"use client";

import React from "react";
import styled from "@emotion/styled";
import IconButton from "@components/ui/button/IconButton";
import SearchBar from "@components/ui/searchbar/admin/Searchbar";
import SpaceCard from "./components/SpaceCard";
import SpaceFormModal from "./components/SpaceFormModal";
import { useSpace } from "./hooks/useSpace";
import colors from "@styles/theme";
import Loader from "@admin/components/Loader";
import { GapBox } from "@admin/components/GapBox";
import { SEARCH_OPTIONS } from "@admin/lib/constants/space";

/**
 * SpacePage 컴포넌트
 * ----------------------------
 * 공간 관리 페이지
 *
 * @description
 * - 공간 목록 조회 및 페이지네이션
 * - 공간 검색 (지역명: 서울/인천/대전/대구)
 * - 공간 생성 및 수정 모달 제어.
 * - 상태 및 비즈니스 로직은 useSpace 훅에서 관리.
 */
export default function SpacePage() {
  const {
    spaceList,
    pagination,
    selectedRegionId,
    keyword,
    modalState,
    startPage,
    endPage,
    setKeyword,
    handlePageChange,
    handlePrevGroup,
    handleNextGroup,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleCloseModal,
    handleCreateSubmit,
    handleUpdateSubmit,
    handleDeleteSpace,
    handleSearch,
    handleSelect,
  } = useSpace();

  return (
    <Container>
      <Loader>
        {/* 타이틀 및 공간 등록 버튼 */}
        <TitleWrapper>
          <h1>공간 관리</h1>
          <div style={{ width: "6.6rem" }}>
            <IconButton label="새 공간 등록" onClick={handleOpenCreateModal} />
          </div>
        </TitleWrapper>

        {/* 검색 바 */}
        <SearchBarWrapper>
          <SearchBar
            options={SEARCH_OPTIONS}
            selectedValue={selectedRegionId}
            onSelectChange={handleSelect}
            placeholder="지역명으로 검색"
            searchValue={keyword}
            onSearchChange={setKeyword}
            onSearch={handleSearch}
          />
        </SearchBarWrapper>

        {/* 공간 리스트 */}
        <CardContainer>
          {spaceList.map((space) => (
            <SpaceCard
              key={space.spaceId}
              imageUrl={space.spaceImageUrl}
              title={space.spaceName}
              region={space.regionName}
              manager={space.adminName}
              isPrivate={!space.spaceIsAvailable}
              onEdit={() => handleOpenEditModal(space.spaceId)}
              onDelete={() => handleDeleteSpace(space.spaceId)}
            />
          ))}
        </CardContainer>

        {/* 페이지네이션 */}
        {pagination.totalPages > 0 && (
          <PaginationWrapper>
            {pagination.totalPages > 1 && (
              <PageButton disabled={startPage === 1} onClick={handlePrevGroup}>
                <img src="/icons/prev.svg" alt="이전" width={20} height={20} />
              </PageButton>
            )}

            {Array.from(
              { length: endPage - startPage + 1 },
              (_, i) => startPage + i
            ).map((page) => (
              <PageNumber
                key={page}
                active={page === pagination.currentPage}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </PageNumber>
            ))}

            {pagination.totalPages > 1 && (
              <PageButton
                disabled={endPage >= pagination.totalPages}
                onClick={handleNextGroup}
              >
                <img src="/icons/next.svg" alt="다음" width={20} height={20} />
              </PageButton>
            )}
          </PaginationWrapper>
        )}

        {/* 단일 모달 컴포넌트 */}
        {modalState.mode && (
          <SpaceFormModal
            isOpen={true}
            onClose={handleCloseModal}
            title={modalState.mode === "create" ? "새 공간 등록" : "공간 수정"}
            initialData={modalState.initialData}
            onSubmit={
              modalState.mode === "create"
                ? handleCreateSubmit
                : handleUpdateSubmit
            }
          />
        )}
        {/* 하단 여백 */}
        <GapBox h="1.875rem" />
      </Loader>
    </Container>
  );
}

// --- styled ---
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  margin-bottom: 1rem;

  .h1 {
    font-weight: 600;
    font-size: 1.5rem;
  }
`;

const SearchBarWrapper = styled.div`
  width: 100%;
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 22rem);
  gap: 3.5rem 1rem;
  margin-top: 1.5rem;
  justify-content: center;
  width: 100%;
  max-width: calc(3 * 22rem + 2 * 1rem);
  margin-left: auto;
  margin-right: auto;
  @media (max-width: 767px) {
    gap: 1rem;
  }
`;

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
