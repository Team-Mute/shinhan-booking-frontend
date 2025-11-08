import { useEffect, useState } from "react";
import {
  createSpaceApi,
  deleteSpaceApi,
  getAllSpaceListApi,
  getRegionSpaceListApi,
  getSpaceApi,
  updateSpaceApi,
} from "apps/admin/lib/api/adminSpace";
import {
  SpaceAllListResponse,
  SpaceCreateBody,
  SpaceDetailResponse,
  SpaceListItem,
  SpaceUpdateBody,
} from "@admin/types/dto/space.dto";
import { SEARCH_OPTIONS } from "@admin/lib/constants/space";
import { useModalStore } from "@admin/store/modalStore";
import { useConfirmModalStore } from "@admin/store/confirmModalStore";
import { useAdminAuthStore } from "@admin/store/adminAuthStore";

/**
 * 공간 관리 페이지의 상태와 핸들러를 관리하는 커스텀 훅
 */
export function useSpace() {
  /* 모달 스토어*/
  const { open } = useModalStore();
  const { open: openConfirmModal } = useConfirmModalStore();

  /* 관리자 권한 체크 */
  const roleId = useAdminAuthStore.getState().adminRoleId;

  /** 공간 리스트 */
  const [spaceList, setSpaceList] = useState<SpaceListItem[]>([]);

  /** 페이지네이션 정보 */
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 6,
    totalElements: 0,
  });

  /** 선택된 지역 ID */
  const [selectedRegionId, setSelectedRegionId] = useState<string | "">("");

  /** 검색 필터와 키워드 */
  const [keyword, setKeyword] = useState("");

  /** 모달 상태 관리 */
  const [modalState, setModalState] = useState<{
    mode: "create" | "edit" | null;
    initialData?: SpaceDetailResponse;
  }>({ mode: null });

  /** 지역 선택 시 API 호출 */
  useEffect(() => {
    const fetchSpacesByRegion = async () => {
      if (selectedRegionId === "") {
        fetchSpaces();
        return;
      }

      try {
        const data: SpaceAllListResponse = await getRegionSpaceListApi({
          regionId: Number(selectedRegionId),
          page: 1,
          size: pagination.pageSize,
        });

        setSpaceList(data.content);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          pageSize: data.pageSize,
          totalElements: data.totalElements,
        });
      } catch (err) {
        console.error("지역별 공간 불러오기 실패:", err);
      }
    };

    fetchSpacesByRegion();
  }, [selectedRegionId]);

  /**
   * 공간 리스트 API 호출
   * @param page 불러올 페이지 번호
   */
  const fetchSpaces = async (page = 1) => {
    try {
      let data: SpaceAllListResponse;

      if (selectedRegionId) {
        // 지역이 선택된 경우 > 지역별 조회
        data = await getRegionSpaceListApi({
          regionId: Number(selectedRegionId),
          page,
          size: pagination.pageSize,
        });
      } else {
        // 지역이 선택되지 않은 경우 > 전체 조회
        data = await getAllSpaceListApi({
          page,
          size: pagination.pageSize,
        });
      }
      setSpaceList(data.content);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        pageSize: data.pageSize,
        totalElements: data.totalElements,
      });
    } catch (err: any) {
      console.error("공간 리스트 불러오기 실패:", err);
    }
  };

  /** 초기 로드 시 공간 리스트 호출 */
  useEffect(() => {
    fetchSpaces();
  }, []);

  /** 등록/수정 후 현재 페이지 다시 불러오기 */
  const reloadSpaces = async () => {
    await fetchSpaces(pagination.currentPage);
  };

  /** 서치바 검색 핸들러 */
  const handleSearch = async () => {
    const trimmed = keyword.trim();

    // 아무것도 입력 안 하면 전체 검색
    if (!trimmed) {
      setSelectedRegionId("");
      await fetchSpaces(1);
      return;
    }

    // 입력한 키워드가 지역 이름과 일치하는지 확인
    const matchedRegion = SEARCH_OPTIONS.find((opt) =>
      opt.label.includes(trimmed)
    );

    if (matchedRegion) {
      // 해당 지역으로 regionId 변경
      setSelectedRegionId(matchedRegion.value);
    }
  };

  /** 서치바 드롭다운 핸들러 */
  const handleSelect = (regionId: string) => {
    // 검색어가 있으면 먼저 초기화
    if (keyword.trim() !== "") {
      setKeyword("");
    }

    // 지역 선택 반영
    setSelectedRegionId(regionId);
  };

  /** 페이지 이동 */
  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;

    fetchSpaces(newPage);
  };

  /** 이전/다음 페이지 그룹 이동 */
  const pageGroupSize = 5;
  const currentGroup = Math.ceil(pagination.currentPage / pageGroupSize);
  const startPage = (currentGroup - 1) * pageGroupSize + 1;
  const endPage = Math.min(
    startPage + pageGroupSize - 1,
    pagination.totalPages
  );

  const handlePrevGroup = () => {
    if (startPage > 1) handlePageChange(startPage - 1);
  };
  const handleNextGroup = () => {
    if (endPage < pagination.totalPages) handlePageChange(endPage + 1);
  };

  /** 모달 열기/닫기 핸들러 */
  const handleOpenCreateModal = () => setModalState({ mode: "create" });

  const handleOpenEditModal = async (spaceId: number) => {
    const detailData: SpaceDetailResponse = await getSpaceApi({ spaceId });
    setModalState({ mode: "edit", initialData: detailData });
  };

  const handleCloseModal = () => setModalState({ mode: null });

  /** 공간 등록/수정/삭제 핸들러 */
  const handleCreateSubmit = async (data: SpaceCreateBody) => {
    try {
      await createSpaceApi(data);
      await reloadSpaces();
    } catch (e) {
      console.error("공간 등록 실패", e);
    } finally {
      handleCloseModal();
    }
  };

  const handleUpdateSubmit = async (data: SpaceUpdateBody) => {
    try {
      if (modalState.mode !== "edit" || !modalState.initialData) return;
      await updateSpaceApi({ spaceId: modalState.initialData.spaceId }, data);
      await reloadSpaces();
    } catch (e) {
      console.error("공간 수정 실패", e);
    } finally {
      handleCloseModal();
    }
  };

  const handleDeleteSpace = async (spaceId: number) => {
    openConfirmModal(
      "경고",
      "공간을 삭제하면 관련된\n예약 데이터가 모두 사라집니다.\n정말 삭제하시겠습니까?",
      async () => {
        try {
          // 1차 공간 삭제 요청
          const result = await deleteSpaceApi({
            spaceId: spaceId,
            confirmDelete: false,
          });

          // API 호출 성공 후 로직 (예: 목록 새로고침)
          // 공간에 대한 예약 데이터가 없는 경우, 바로 삭제 진행
          await reloadSpaces();
        } catch (err: any) {
          // 에러 처리: 422 또는 409 응답 처리
          if (err.response?.status === 422) {
            // 진행 중인 예약이 있는 경우,
            // - [1차 승인대기/2차 승인대기/ 최종 승인 완료]의 예약건이 있을 경우 삭제 불가 처리
            // - 422 (Unprocessable Entity - 비즈니스 규칙 위반)
            open(
              "삭제 불가",
              "진행 중인 예약이 있어\n공간을 삭제할 수 없습니다."
            );
          }
          // 해당 공간에 과거 예약만 있는 경우
          // - [반려/이용 완료/ 취소]의 예약건만 있을 경우 경고 메시지 띄운 후 최종 삭제 진행
          // - 409 (Conflict - 리소스 충돌 및 재요청 유도)
          else if (err.response?.status === 409) {
            openConfirmModal(
              "경고",
              "과거 예약건이 있습니다.\n그래도 삭제하시겠습니까?",
              async () => {
                await deleteSpaceApi({
                  spaceId: spaceId,
                  confirmDelete: true,
                });
                fetchSpaces();
              },
              () => {}
            );
          }
        }
      },
      // onCancel: '취소' 버튼 클릭 시 실행될 로직
      () => {}
    );
  };

  return {
    // 권한
    roleId,
    // 상태
    spaceList,
    pagination,
    selectedRegionId,
    keyword,
    modalState,

    // 계산된 페이지 정보
    startPage,
    endPage,

    // 액션
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
  };
}
