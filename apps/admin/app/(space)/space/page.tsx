"use client";

import React, { useEffect, useState } from "react";
import SearchBar from "@components/ui/searchbar/admin/Searchbar";
import styled from "@emotion/styled";
import IconButton from "@components/ui/button/IconButton";
import SpaceCard from "./components/SpaceCard";
import SpaceFormModal from "./components/SpaceFormModal/index";
import {
  createSpaceApi,
  getAllSpaceListApi,
  getManagerSpaceListApi,
  getRegionSpaceListApi,
  updateSpaceApi,
} from "apps/admin/lib/api/adminSpace";
import { SpaceRequest } from "apps/admin/types/space";
import { useAdminAuthStore } from "apps/admin/store/adminAuthStore";
import { mapDetailToRequest } from "apps/admin/lib/utils/spaceMapper";

const options = [
  { value: "all", label: "전체" },
  { value: "space", label: "공간명" },
  { value: "manager", label: "담당자" },
];

export default function DashboardPage() {
  const [spaces, setSpaces] = useState<any[]>([]);
  const [pagination, setPagination] = useState<{
    totalPages: number;
    totalElements: number;
  } | null>(null);

  const [filter, setFilter] = useState("all");
  const [keyword, setKeyword] = useState("");

  const [editingSpace, setEditingSpace] = useState<any | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // ✅ 공간 리스트 불러오기
  const { adminRoleId } = useAdminAuthStore();

  useEffect(() => {
    async function fetchSpaces() {
      try {
        let data: any[] = [];
        let pagination: { totalPages: number; totalElements: number } | null =
          null;

        if (adminRoleId === 2) {
          // 1차 승인자용
          const regionData = await getManagerSpaceListApi();
          const regionId = regionData[0].regionId;
          data = await getRegionSpaceListApi(regionId); // 얘는 content 구조 아닌 것 같네?
        } else if (adminRoleId == 0 || adminRoleId == 1) {
          // 마스터, 2차 승인자용
          const response = await getAllSpaceListApi();
          data = response.content; // ✅ 리스트만
          pagination = {
            totalPages: response.totalPages,
            totalElements: response.totalElements,
          };
        }

        setSpaces(data);
        if (pagination) {
          setPagination(pagination); // ✅ 페이지네이션 정보 따로 저장
        }
      } catch (e) {
        console.error("공간 리스트 불러오기 실패", e);
      }
    }

    fetchSpaces();
  }, [adminRoleId]);

  const filteredSpaces = spaces.filter((space) => {
    if (filter === "all") return true;
    if (filter === "space") return space.spaceName?.includes(keyword);
    if (filter === "manager") return space.userName?.includes(keyword);
    return true;
  });

  const reloadSpaces = async () => {
    try {
      let data: any[] = [];
      if (adminRoleId === 2) {
        const regionData = await getManagerSpaceListApi();
        const regionId = regionData.regionId;
        data = await getRegionSpaceListApi(regionId);
      } else if (adminRoleId === 0 || adminRoleId === 1) {
        data = await getAllSpaceListApi();
      }
      setSpaces(data);
    } catch (e) {
      console.error("공간 리스트 불러오기 실패", e);
    }
  };

  return (
    <Container>
      <TitleWrapper>
        <h1>공간 관리</h1>
        <div style={{ width: "6.6rem" }}>
          <IconButton
            label="새 공간 등록"
            onClick={() => setIsCreateOpen(true)}
          />
        </div>
      </TitleWrapper>
      <SearchBarWrapper>
        <SearchBar
          options={options}
          selectedValue={filter}
          onSelectChange={setFilter}
          placeholder="공간명, 담당자로 검색"
          searchValue={keyword}
          onSearchChange={setKeyword}
        />
      </SearchBarWrapper>

      <CardContainer>
        {filteredSpaces.map((space) => (
          <SpaceCard
            key={space.spaceId}
            imageUrl={space.spaceImageUrl}
            title={space.spaceName}
            region={space.regionName}
            manager={space.userName}
            isPrivate={!space.spaceIsAvailable}
            onEdit={() => setEditingSpace(space)}
          />
        ))}
      </CardContainer>

      {/* 등록 모달 */}
      {isCreateOpen && (
        <SpaceFormModal
          isOpen
          onClose={() => setIsCreateOpen(false)}
          title="새 공간 등록"
          initialData={undefined} // 등록은 초기값 없음
          onSubmit={async (data: SpaceRequest) => {
            try {
              await createSpaceApi(data);
              await reloadSpaces(); // 등록 후 다시 불러오기
            } catch (e) {
              console.error("공간 등록 실패", e);
            } finally {
              setIsCreateOpen(false);
            }
          }}
        />
      )}

      {/* 수정 모달 */}
      {editingSpace && (
        <SpaceFormModal
          isOpen
          onClose={() => setEditingSpace(null)}
          initialData={mapDetailToRequest(editingSpace)} // ✅ 변환해서 넘김
          title="공간 수정"
          spaceId={editingSpace.spaceId}
          onSubmit={async (data: SpaceRequest, spaceId?: number) => {
            try {
              await updateSpaceApi(spaceId!, data);
              await reloadSpaces();
            } catch (e) {
              console.error("공간 수정 실패", e);
            } finally {
              setEditingSpace(null);
            }
          }}
        />
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  //   background-color: beige;
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
  max-width: calc(3 * 22rem + 2 * 1rem); /* 카드 3개 + 간격 */
  margin-left: auto;
  margin-right: auto;

  /* 모바일 */
  @media (max-width: 767px) {
    gap: 1rem;
  }
`;

const ViewportBadge = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  background: black;
  color: white;
  padding: 0.3rem 0.6rem;
  font-size: 0.9rem;
  border-radius: 4px;
  opacity: 0.8;
`;
