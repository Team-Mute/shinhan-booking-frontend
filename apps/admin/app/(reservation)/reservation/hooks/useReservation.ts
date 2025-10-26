import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getFlagOptions,
  getRegionOptions,
  getReservationApi,
  getStatusOptions,
  postApproveReservationsApi,
  postRejectReservationApi,
} from "@admin/lib/api/adminReservation";

import { useAdminAuthStore } from "@admin/store/adminAuthStore";
import { useModalStore } from "@admin/store/modalStore";
import { useConfirmModalStore } from "@admin/store/confirmModalStore";
import { FlagOptionDTO, RegionOptionDTO, ReservationListItemDTO, StatusOptionDTO } from "@admin/types/dto/reservation.dto";

/** 
 * 전역 상태/모달 유틸리티 
 */
const useAlertAndConfirm = () => {
  // InfoModal을 띄우기 위한 전역 상태 액션 호출
  const openInfoModal = useModalStore(state => state.open);
  // ConfirmModal을 띄우기 위한 전역 상태 액션 호출
  const openConfirmModal = useConfirmModalStore(state => state.open);

  const showAlertModal = useCallback((title: string, subtitle: string, onClose?: () => void) => {
    openInfoModal(title, subtitle, onClose);
  }, [openInfoModal]);

  return { showAlertModal, openConfirmModal };
};

/**
 * useReservation 
 * 예약 관리 페이지의 상태와 핸들러를 관리하는 커스텀 훅
 */
export const useReservation = () => {
  // 전역 상태 훅 및 알림 유틸리티 사용
  const { showAlertModal, openConfirmModal } = useAlertAndConfirm();
  const { adminRoleId } = useAdminAuthStore();

  // API 데이터 및 로딩 관련 상태
  const [reservations, setReservations] = useState<ReservationListItemDTO[]>([]);

  // 페이지네이션 관련 상태
  const PAGE_GROUP_SIZE = 5; // 한 페이지의 데이터 개수
  const [uiCurrentPage, setUiCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);

  // 체크박스 선택 관련 상태
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // 필터링 옵션 상태
  const [statuses, setStatuses] = useState<StatusOptionDTO[]>([]);
  const [regions, setRegions] = useState<RegionOptionDTO[]>([]);
  const [flags, setFlags] = useState<FlagOptionDTO[]>([]);

  // 드롭다운 선택 상태 (필터링 조건)
  const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);

  // 검색/플래그 상태 (필터링 조건)
  const [keyword, setKeyword] = useState("");
  const [isShinhan, setIsShinhan] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);

  // --- 모달 상태 관리 ---
  const [isBulkConfirmModalOpen, setIsBulkConfirmModalOpen] = useState(false);
  const [reservationsToApprove, setReservationsToApprove] = useState<ReservationListItemDTO[]>([]);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedReservationIdToReject, setSelectedReservationIdToReject] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedReservationForDetail, setSelectedReservationForDetail] = useState<number | null>(null);

  // --- 데이터 패칭 로직 ---

  // 필터 옵션 데이터를 가져오는 함수
  const fetchFilterOptions = useCallback(async () => {
    try {
      const [statusData, regionData, flagData] = await Promise.all([
        getStatusOptions(),
        getRegionOptions(),
        getFlagOptions(),
      ]);

      setStatuses(statusData);
      setRegions(regionData);
      setFlags(flagData);
    } catch (error) {
      console.error("필터 옵션 로딩 실패:", error);
    }
  }, []);

  // 예약 목록을 불러오는 핵심 API 로직
  const loadReservations = useCallback(async () => {
    try {
      const response = await getReservationApi({
        page: uiCurrentPage,
        size: 5,
        keyword: keyword,
        regionId: selectedRegionId,
        statusId: selectedStatusId,
        isShinhan: isShinhan,
        isEmergency: isEmergency,
      });

      setReservations(response.content);
      setTotalPages(response.totalPages);
      setSelectedItems([]); // 새로운 목록을 가져올 때 선택된 항목 초기화
    } catch (err) {
      console.error("예약 목록을 불러오는 데 실패했습니다:", err);
      showAlertModal("오류", "예약 목록을 불러오지 못했습니다.");
    } 
  }, [
    uiCurrentPage,
    keyword,
    selectedStatusId,
    selectedRegionId,
    isShinhan,
    isEmergency,
    showAlertModal
  ]);

  // 페이지 로드 시 옵션 데이터 패치 (최초 1회)
  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  // 필터 조건이나 페이지가 변경될 때 예약 목록 다시 로드
  useEffect(() => {
    loadReservations();
  }, [
    loadReservations,
    // uiCurrentPage는 loadReservations의 의존성에 포함되어 있지만, 명시적으로 유지
  ]);


  // --- 페이지네이션 및 필터 핸들러 ---

  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setUiCurrentPage(page);
    }
    // loadReservations는 useEffect를 통해 호출됨
  }, [totalPages]);

  const handleFilterChange = useCallback((filterType: 'status' | 'region', value: string) => {
    setUiCurrentPage(1); // 필터 변경 시 1페이지로 이동
    const numValue = value === "" ? null : Number(value);

    if (filterType === 'status') {
      setSelectedStatusId(numValue);
    } else {
      setSelectedRegionId(numValue);
    }
    // loadReservations는 useEffect를 통해 호출됨
  }, []);

  const handleKeywordChange = useCallback((value: string) => {
    setKeyword(value);
  }, []);

  const handleKeywordSearch = useCallback(() => {
    setUiCurrentPage(1); // 검색 실행 시 1페이지로 이동
    // loadReservations는 useEffect를 통해 호출됨
  }, []);

  const handleFlagToggle = useCallback((key: 'isShinhan' | 'isEmergency') => {
    setUiCurrentPage(1); // 플래그 변경 시 1페이지로 이동

    if (key === 'isShinhan') {
      setIsShinhan((prev) => !prev);
      setIsEmergency(false);
    } else {
      setIsEmergency((prev) => !prev);
      setIsShinhan(false);
    }
    // loadReservations는 useEffect를 통해 호출됨
  }, []);


  // --- 승인 로직 (단건/일괄 통합) ---

  const confirmApprove = useCallback(async (targetIds: number[], isBulk: boolean = false) => {
    try {
      const response = await postApproveReservationsApi(targetIds);
      const { total, successCount, failureCount } = response;

      if (!isBulk && total === 1) {
        // 단건 승인 결과 처리
        const result = response.results[0];
        if (result.success) {
          const successTitle = result.message;
          const successMessage =
            successTitle === "1차 승인 완료"
              ? "최종 승인 완료를 위해 2차 승인이 필요해요."
              : "최종적으로 예약이 승인되었어요. \n 예약자에게 예약 확정 메세지가 전송됩니다.";
          showAlertModal(successTitle, successMessage);
        } else {
          showAlertModal("승인 실패", result.message);
        }
      } else if (isBulk) {
        // 일괄 승인 결과 처리
        if (successCount === total) {
          const successTitle = response.results[0]?.message || "승인 완료";
          const successMessage =
            successTitle === "1차 승인 완료"
              ? "최종 승인 완료를 위해 2차 승인이 필요해요."
              : "최종적으로 예약이 승인되었어요. \n 예약자에게 예약 확정 메세지가 전송됩니다.";
          showAlertModal(successTitle, successMessage);
        } else if (failureCount > 0) {
          showAlertModal(
            "일부 승인 실패",
            `총 ${total}건 중 ${successCount}건만 승인되었습니다.\n자세한 내용은 개별 상태를 확인해주세요.`
          );
        }
      }

      // 후처리: 목록 새로고침 및 상태 초기화
      await loadReservations();
      setSelectedItems([]);
      setReservationsToApprove([]);
    } catch (err) {
      showAlertModal(
        "오류 발생",
        "서버와의 통신에 실패했습니다. 잠시 후 다시 시도해주세요."
      );
      console.error("예약 승인 실패:", err);
    }
  }, [loadReservations, showAlertModal]);


  const handleApprove = useCallback((reservationId: number) => {
    // ConfirmModal을 띄우는 로직
    openConfirmModal(
      "예약을 승인하시겠습니까?",
      "해당 예약을 승인하면 반려하지 못합니다.",
      // onConfirm: 실제 승인 로직 호출 (단건 승인이므로 isBulk: false)
      () => confirmApprove([reservationId], false),
      () => {}
    );
  }, [confirmApprove, openConfirmModal]);


  const handleApproveSelected = useCallback(() => {
    if (selectedItems.length === 0) {
      showAlertModal("알림", "승인할 예약을 선택해주세요.");
      return;
    }

    if (selectedItems.length === 1) {
      // 단건 승인인 경우, ConfirmModal을 띄움 (handleApprove 재사용)
      handleApprove(selectedItems[0]);
    } else {
      // 일괄 승인인 경우, BulkApproveModal을 띄움
      const selectedReservationObjects = reservations.filter((res) =>
        selectedItems.includes(res.reservationId)
      );
      setReservationsToApprove(selectedReservationObjects);
      setIsBulkConfirmModalOpen(true);
    }
  }, [selectedItems, reservations, showAlertModal, handleApprove]);

  const confirmBulkApprove = useCallback(() => {
    setIsBulkConfirmModalOpen(false);
    const selectedReservationIds = reservationsToApprove.map((res) => res.reservationId);
    confirmApprove(selectedReservationIds, true); // 일괄 승인이므로 isBulk: true
  }, [reservationsToApprove, confirmApprove]);


   // 일괄 승인 모달 닫기 및 상태 초기화 함수
   const handleBulkConfirmModalClose = useCallback(() => {
   setIsBulkConfirmModalOpen(false);
   setReservationsToApprove([]); // 승인 대기 목록 초기화
   // 선택된 항목(selectedItems)은 모달을 닫더라도 유지하여, 사용자가 목록으로 돌아가서 다시 선택할 수 있도록 함
   }, []);

  // --- 반려 로직 ---

  const handleReject = useCallback((reservationId: number) => {
    setSelectedReservationIdToReject(reservationId);
    setIsRejectModalOpen(true); // 반려 모달 열기
  }, []);

  const handleRejectionReasonChange = useCallback((reason: string) => {
    setRejectionReason(reason);
  }, []);

  const confirmReject = useCallback(async () => {
    if (selectedReservationIdToReject === null || !rejectionReason.trim()) {
      showAlertModal('알림', '반려 사유를 입력해주세요.');
      return;
    }

    try {
      await postRejectReservationApi(selectedReservationIdToReject, rejectionReason);
      showAlertModal(
        "반려 완료",
        "해당 예약이 반려되었습니다.\n사용자에게 반려 메시지가 전송됩니다."
      );

      // 상태 초기화 및 데이터 다시 로드
      setIsRejectModalOpen(false);
      setRejectionReason("");
      setSelectedReservationIdToReject(null);
      await loadReservations();
    } catch (err) {
      console.error("반려 실패", err);
      setIsRejectModalOpen(false);
      showAlertModal(
        "반려 실패",
        "예약 반려에 실패했습니다. 다시 시도해주세요."
      );
    }
  }, [selectedReservationIdToReject, rejectionReason, loadReservations, showAlertModal]);


  const handleRejectModalClose = useCallback(() => {
      setIsRejectModalOpen(false);
      setRejectionReason(""); // 모달 닫을 때 사유 초기화
  }, []);

  // --- 체크박스 및 선택 로직 ---

  // 승인 가능한 예약 목록만 메모이제이션
  const approvableReservations = useMemo(
    () => reservations.filter((res) => res.isApprovable),
    [reservations]
  );

  // 전체 선택 상태 계산
  const isAllApprovableSelected = useMemo(() =>
    approvableReservations.length > 0 &&
    selectedItems.length === approvableReservations.length,
    [approvableReservations, selectedItems.length]
  );


  const handleSingleSelect = useCallback((reservationId: number, isApprovable: boolean) => {
    if (!isApprovable) {
      return;
    }

    setSelectedItems((prevSelected) =>
      prevSelected.includes(reservationId)
        ? prevSelected.filter((id) => id !== reservationId)
        : [...prevSelected, reservationId]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (isAllApprovableSelected) {
      setSelectedItems([]);
    } else {
      const allApprovableIds = approvableReservations.map((res) => res.reservationId);
      setSelectedItems(allApprovableIds);
    }
  }, [isAllApprovableSelected, approvableReservations]);

  // --- 상세 보기 로직 ---

  const handleDetailClick = useCallback((reservationId: number) => {
    setSelectedReservationForDetail(reservationId);
    setIsDetailModalOpen(true);
  }, []);

  const handleDetailModalClose = useCallback(() => {
    setIsDetailModalOpen(false);
    setSelectedReservationForDetail(null);
  }, []);


  /**
 * 페이지 그룹 계산 로직 (uiCurrentPage가 바뀔 때마다 실행)
 * - 현재 페이지를 기준으로 startPage와 endPage를 계산합니다.
 */
useEffect(() => {
  // totalPages가 0보다 클 때만 계산
  if (totalPages > 0) {
    // 1. startPage 계산: 현재 페이지가 속한 그룹의 시작 페이지
    const currentGroup = Math.ceil(uiCurrentPage / PAGE_GROUP_SIZE);
    const calculatedStartPage = (currentGroup - 1) * PAGE_GROUP_SIZE + 1;
    
    // 2. endPage 계산: 그룹의 마지막 페이지와 전체 페이지 수 중 더 작은 값
    const calculatedEndPage = Math.min(
      calculatedStartPage + PAGE_GROUP_SIZE - 1,
      totalPages
    );
    
    setStartPage(calculatedStartPage);
    setEndPage(calculatedEndPage);
  } else {
    // totalPages가 0이면 초기화
    setStartPage(1);
    setEndPage(1);
  }
}, [uiCurrentPage, totalPages]); // uiCurrentPage나 totalPages가 바뀔 때 실행


// 이전 페이지 그룹으로 이동
const handlePrevGroup = useCallback(() => {
  if (startPage > 1) {
    // 이전 그룹의 마지막 페이지로 이동 (예: 11페이지 그룹에서 1페이지로)
    const newPage = startPage - 1; 
    handlePageChange(newPage);
  }
}, [startPage, handlePageChange]); // handlePageChange는 아마도 이미 useCallback으로 정의되어 있을 것입니다.

// 다음 페이지 그룹으로 이동
 
const handleNextGroup = useCallback(() => {
  if (endPage < totalPages) {
    // 다음 그룹의 시작 페이지로 이동 (예: 10페이지 그룹에서 11페이지로)
    const newPage = endPage + 1;
    handlePageChange(newPage);
  }
}, [endPage, totalPages, handlePageChange]);

  // --- 반환 값 ---
  return {
    // 데이터 및 상태
    reservations,
    statuses,
    regions,
    flags,
    keyword,
    isShinhan,
    isEmergency,
    adminRoleId,

    // 필터링 상태
    selectedStatusId,
    selectedRegionId,

    // 페이지네이션
    uiCurrentPage,
    totalPages,
    startPage,      
    endPage,
    handlePrevGroup, 
    handleNextGroup,

    // 체크박스 선택
    selectedItems,
    isAllApprovableSelected,

    // 모달 상태
    isBulkConfirmModalOpen,
    reservationsToApprove,
    isRejectModalOpen,
    rejectionReason,
    isDetailModalOpen,
    selectedReservationForDetail,

    // 필터 핸들러
    handlePageChange,
    handleFilterChange,
    handleKeywordChange,
    handleKeywordSearch,
    handleFlagToggle,

    // 액션 핸들러
    handleApprove, // 단건 승인 (ConfirmModal 열기)
    handleApproveSelected, // 선택 승인 (단건/일괄 분기)
    confirmBulkApprove, // 일괄 승인 최종 확인
    handleReject, // 반려 모달 열기
    handleRejectionReasonChange, // 반려 사유 변경
    confirmReject, // 반려 최종 확인

    // 체크박스 핸들러
    handleSingleSelect,
    handleSelectAll,

    // 모달 닫기
    handleRejectModalClose, 
    handleDetailClick,
    handleDetailModalClose,
    handleBulkConfirmModalClose,
  };
};