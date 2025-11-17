import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  AddressByRegionIdResponse,
  CategoryListResponse,
  ManagerListResponse,
  RegionListResponse,
  TagsResponse,
} from "@admin/types/dto/space.dto";
import {
  getAddressApi,
  getCategoryListApi,
  getManagerListApi,
  getRegionsListApi,
  getTagsApi,
} from "@admin/lib/api/adminSpace";

interface SelectOption {
  label: string;
  value: string;
}

interface ViewModelProps {
  form: any; // 전체 폼 데이터 객체
  setForm: (next: any) => void; // 전체 폼 데이터 업데이트 함수
  initialImageUrls: string[]; // 서버에서 받은 기존 이미지 URL 목록
  setInitialImageUrls: (urls: string[]) => void; // 기존 이미지 URL 목록 업데이트 함수
}

/**
 * useSpaceSettings 훅
 * -------------------
 * 공간 설정 폼의 모든 비즈니스 로직과 상태를 관리하는 ViewModel 훅
 * - API 데이터 페칭 및 옵션 리스트 관리
 * - 이미지 업로드, 미리보기, 재정렬 로직 처리
 * - 폼 입력(Input, Select, Chip, Switch) 변경 핸들러 및 유효성 검사
 */
export const useSpaceSettings = ({
  form,
  setForm,
  initialImageUrls,
  setInitialImageUrls,
}: ViewModelProps) => {
  // 상태: API 데이터 및 입력 제어 상태
  const [regions, setRegions] = useState<SelectOption[]>([]); // 지점 옵션 리스트
  const [categories, setCategories] = useState<SelectOption[]>([]); // 카테고리 옵션 리스트
  const [tags, setTags] = useState<string[]>([]); // 기본 편의시설 태그 리스트
  const [managers, setManagers] = useState<SelectOption[]>([]); // 담당자 옵션 리스트
  const [address, setAddress] = useState(""); // 선택된 지점의 상세 주소

  const [customChips, setCustomChips] = useState<string[]>([]); // 사용자 추가 편의시설 태그 (로컬 상태)
  const [newChip, setNewChip] = useState(""); // 새로 입력 중인 편의시설 이름

  // 수용 인원 입력 제어를 위한 로컬 상태 (사용자의 raw 문자열 입력값을 관리하여 유효성 에러를 즉시 표시)
  const [capacityInput, setCapacityInput] = useState(
    String(form.space.spaceCapacity ?? "")
  );

  // 이미지 파일 선택을 위한 <input type="file" />의 참조
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Capacity 동기화
   * 부모 폼 상태(form.space.spaceCapacity)가 외부에서 변경될 때
   * 로컬 입력 상태(capacityInput)를 동기화하여 UI에 반영.
   */
  useEffect(() => {
    setCapacityInput(String(form.space.spaceCapacity ?? ""));
  }, [form.space.spaceCapacity]);

  // Effect: API 데이터 페칭

  /**
   * [초기 데이터 로드]
   * 컴포넌트 마운트 시, 지점, 카테고리, 태그 리스트를 API에서 병렬로 불러옴.
   */
  useEffect(() => {
    const fetchAllInitialData = async () => {
      try {
        const [regionsRes, categoriesRes, tagsRes] = await Promise.all([
          getRegionsListApi(),
          getCategoryListApi(),
          getTagsApi(),
        ]);

        console.log(regionsRes);
        // 지점 옵션 설정
        setRegions(
          regionsRes.map((r: RegionListResponse[number]) => ({
            label: r.regionName,
            value: String(r.regionId),
          }))
        );

        // 카테고리 옵션 설정
        setCategories(
          categoriesRes.map((c: CategoryListResponse[number]) => ({
            label: c.categoryName,
            value: String(c.categoryId),
          }))
        );
        // 기본 태그 리스트 설정
        setTags(tagsRes.map((t: TagsResponse[number]) => t.tagName));
      } catch (error) {
        console.error("Failed to fetch initial API data:", error);
      }
    };

    fetchAllInitialData();
  }, []);

  /**
   * [지점 변경]
   * form.space.regionId가 변경될 때, 해당 지점의 상세 주소와 담당자 리스트를 API에서 불러옴.
   */
  useEffect(() => {
    const regionId = form.space.regionId;
    if (!regionId) return;

    const fetchRegionDetails = async () => {
      // 주소 정보 패치
      const addr: AddressByRegionIdResponse = await getAddressApi({ regionId });
      setAddress(addr[0]?.addressRoad || "");

      // 담당자 리스트 패치
      const mgrs: ManagerListResponse = await getManagerListApi({ regionId });
      setManagers(
        mgrs.map((m) => ({
          label: m.adminNameWithRole,
          value: String(m.adminId),
        }))
      );
    };

    fetchRegionDetails();
  }, [form.space.regionId]);

  // 파생 상태: 이미지 프리뷰 및 유효성 검사

  // form.images는 새로 업로드된 File[] 배열
  const currentFiles: File[] = form.images || [];

  /**
   * [allImages: View에 표시될 최종 이미지 목록]
   * 기존 URL 배열 (initialImageUrls)과 새로 업로드된 File 객체 배열 (currentFiles)을 합친 목록
   * 이 배열의 순서가 최종 이미지 순서.
   */
  const allImages: (string | File)[] = useMemo(() => {
    const finalImages = [...(initialImageUrls || []), ...currentFiles];

    return finalImages;
  }, [initialImageUrls, currentFiles]);

  /**
   * [previews: 이미지 미리보기 URL 목록]
   * allImages 배열을 순회하며 File 객체는 createObjectURL로, string URL은 그대로 사용.
   */
  const previews = useMemo(() => {
    return allImages.map((item) => {
      if (typeof item === "string") {
        return item; // 기존 URL
      }
      return URL.createObjectURL(item); // 새 File 객체의 임시 URL
    });
  }, [allImages]);

  /**
   * [capacityErrorMessage: 수용 인원 에러 메시지]
   * `capacityInput` (사용자 입력값)을 기준으로 수용 인원의 유효성을 실시간으로 검사.
   */
  const capacityErrorMessage = useMemo(() => {
    const input = capacityInput.trim();

    if (input === "") return ""; // 값이 없으면 필수값 검증 단계에서 처리

    // 숫자(정수) 형태가 아닐 경우
    if (!/^\d+$/.test(input) || input.includes(".")) {
      return "숫자(정수)만 입력해 주세요.";
    }

    const num = Number(input);

    // 0 이하의 값인 경우
    if (num <= 0) {
      return "수용 인원은 1명 이상이어야 합니다.";
    }

    return "";
  }, [capacityInput]);

  /**
   * [isValidCapacity: 수용 인원 필드 데이터 유효성 검사]
   * form.space.spaceCapacity에 저장된 값의 최종 유효성을 확인.
   */
  const isValidCapacity = (value: any): boolean => {
    if (value === null || value === undefined || value === "") return false;
    const num = Number(value);
    if (isNaN(num)) return false;

    // 1 이상의 정수인지 확인
    return Number.isInteger(num) && num > 0;
  };

  /**
   * [isSettingsValid: 전체 폼 유효성 검사]
   * 폼 전반의 필수 입력 조건 및 유효성 검사 결과를 종합함.
   */
  const isSettingsValid = useMemo(() => {
    const { space } = form;

    // A. 이미지: 1개 이상 5개 이하
    const isImageValid = allImages.length >= 1 && allImages.length <= 5;

    // B. 필수 필드: 비어있는지 확인
    const requiredFields = [
      "spaceName",
      "regionId",
      "categoryId",
      "adminId",
      "spaceDescription",
      "reservationWay",
      "spaceRules",
    ];
    const areRequiredFieldsPresent = requiredFields.every(
      (field) => !!space[field] && String(space[field]).trim() !== ""
    );

    // C. 수용 인원: 1 이상의 정수여야 함
    const isCapacityValid = isValidCapacity(space.spaceCapacity);

    // D. 편의시설: 태그가 1개 이상 선택/추가되어야 함
    const isTagNamesValid = space.tagNames && space.tagNames.length > 0;

    // 최종 유효성 검사
    return (
      isImageValid &&
      areRequiredFieldsPresent &&
      isCapacityValid &&
      isTagNamesValid &&
      capacityErrorMessage === "" // 실시간 입력 에러가 없어야 함
    );
  }, [form, allImages, capacityErrorMessage]);

  /**
   * [imageSubmitData: 이미지 제출을 위한 데이터 구조]
   * allImages를 API 형식에 맞게 `images` (새 File 객체)와 `keepUrlsOrder` (순서 토큰)로 분리.
   */
  const imageSubmitData = useMemo(() => {
    const finalOrder: string[] = []; // 최종 keepUrlsOrder 배열 (URL 또는 'new:i' 토큰)
    const newFiles: File[] = []; // 새로 업로드할 File 객체 배열 (API images 필드)

    (allImages || []).forEach((item: string | File) => {
      if (item instanceof File) {
        // 새 File 객체: newFiles에 추가하고, finalOrder에는 'new:i' 토큰을 순서대로 추가
        const token = `new:${newFiles.length}`;
        newFiles.push(item);
        finalOrder.push(token);
      } else if (typeof item === "string") {
        // 기존 URL: finalOrder에 그대로 URL 추가
        finalOrder.push(item);
      }
    });

    return {
      images: newFiles,
      keepUrlsOrder: finalOrder,
    };
  }, [allImages]);

  // 이벤트 핸들러 (Input, Select, Switch, Chip)

  /**
   * [일반 Input/Switch 변경]
   * 수용 인원 필드를 제외한 일반 텍스트, 텍스트 영역, 스위치 변경을 처리함.
   */
  const handleInputChange = useCallback(
    (field: string, value: any) => {
      setForm((prev: any) => ({
        ...prev,
        space: { ...prev.space, [field]: value },
      }));
    },
    [setForm]
  );

  /**
   * [Selectbox 변경]
   * 셀렉트박스 변경을 처리하며, regionId가 변경될 경우 locationId도 함께 업데이트함.
   */
  const handleSelectChange = useCallback(
    (field: string, value: string) => {
      const numValue = Number(value);
      setForm((prev: any) => ({
        ...prev,
        space: {
          ...prev.space,
          [field]: numValue,
          // regionId가 변경되면 locationId도 동일하게 업데이트
          ...(field === "regionId" && { locationId: numValue }),
        },
      }));
    },
    [setForm]
  );

  /**
   * [수용 인원 Input 변경]
   * 수용 인원 필드 전용 핸들러.
   * 1. 로컬 상태(`capacityInput`) 업데이트 -> 에러 메시지(`capacityErrorMessage`) 즉시 표시
   * 2. 유효한 값일 경우에만 실제 폼 상태(`form.space.spaceCapacity`) 업데이트
   */
  const handleCapacityChange = useCallback(
    (value: string) => {
      setCapacityInput(value); // 로컬 입력 상태 업데이트

      const num = Number(value);

      // 빈 문자열이거나 유효한 양의 정수일 때만 폼 상태 업데이트
      if (value === "" || (num > 0 && Number.isInteger(num))) {
        setForm((prev: any) => ({
          ...prev,
          space: {
            ...prev.space,
            spaceCapacity: value === "" ? "" : num,
          },
        }));
      }
      // 유효하지 않은 입력(소수점, 문자)은 폼 상태에 반영되지 않음
    },
    [setForm]
  );

  /**
   * [태그 토글]
   * 기존/추가된 편의시설 태그의 선택/해제를 처리하여 `form.space.tagNames`를 업데이트함.
   */
  const toggleChips = useCallback(
    (chip: string) => {
      const tagNames = form.space.tagNames || [];
      const exists = tagNames.includes(chip);
      const next = exists
        ? tagNames.filter((c: string) => c !== chip)
        : [...tagNames, chip];

      setForm({ ...form, space: { ...form.space, tagNames: next } });
    },
    [form, setForm]
  );

  /**
   * [커스텀 태그 추가]
   * 사용자가 입력한 새로운 편의시설 태그를 `customChips` (로컬)와 `form.space.tagNames` (폼)에 추가함.
   */
  const addChip = useCallback(() => {
    const v = newChip.trim();
    if (!v || customChips.includes(v)) return; // 빈 값 또는 중복 방지

    setCustomChips((prev) => [...prev, v]); // 로컬 커스텀 칩 상태 업데이트
    setForm((prev: any) => ({
      ...prev,
      space: {
        ...prev.space,
        tagNames: [...(prev.space.tagNames || []), v], // 폼 상태에 태그 추가
      },
    }));
    setNewChip(""); // 입력 필드 초기화
  }, [newChip, customChips, setForm]);

  /**
   * [커스텀 태그 제거]
   * 사용자 정의로 추가된 편의시설 태그를 `customChips`와 `form.space.tagNames`에서 제거함.
   */
  const removeCustomChip = useCallback(
    (chip: string) => {
      setCustomChips((prev) => prev.filter((c) => c !== chip)); // 로컬 커스텀 칩 상태에서 제거
      setForm((prev: any) => ({
        ...prev,
        space: {
          ...prev.space,
          tagNames: (prev.space.tagNames || []).filter(
            (c: string) => c !== chip
          ), // 폼 상태에서 태그 제거
        },
      }));
    },
    [setForm]
  );

  // 이미지 관리 핸들러

  /**
   * [openPicker]
   * 숨겨진 파일 인풋을 클릭하여 파일 선택 창 열기
   */
  const openPicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  /**
   * [onChange]
   * 새 파일을 선택했을 때 처리.
   * - 최대 5개 이미지 제한 검사
   * - 새 파일들을 `form.images` 배열에 추가
   */
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFiles = Array.from(e.target.files || []);
      const currentFiles = form.images || [];

      if (allImages.length + newFiles.length > 5) {
        alert("이미지는 최대 5개까지 업로드 가능합니다.");
        return;
      }

      setForm((prev: any) => ({
        ...prev,
        images: [...currentFiles, ...newFiles], // 기존 File 배열에 새 파일만 추가
      }));
      e.target.value = ""; // 동일 파일 재선택을 위해 value 초기화
    },
    [allImages, setForm, form.images]
  );

  /**
   * [clear]
   * 모든 이미지 (기존 URL 및 새 파일)를 제거하고 상태를 초기화
   */
  const clear = useCallback(() => {
    if (typeof setInitialImageUrls === "function") {
      setInitialImageUrls([]); // 기존 URL 제거
    }
    setForm((prev: any) => ({
      ...prev,
      images: [], // 새 파일 제거
    }));
  }, [setInitialImageUrls, setForm]);

  /**
   * [removeAt]
   * 특정 인덱스의 이미지 항목 (URL 또는 File)을 `initialImageUrls` 또는 `form.images`에서 제거
   */
  const removeAt = useCallback(
    (index: number) => {
      const safeInitialUrls = initialImageUrls || [];

      // (1) 기존 URL 제거 (인덱스가 URL 배열 범위 내에 있을 경우)
      if (index < safeInitialUrls.length) {
        if (typeof setInitialImageUrls === "function") {
          setInitialImageUrls(safeInitialUrls.filter((_, i) => i !== index));
        }
      }
      // (2) 새 파일 (File 객체) 제거 (인덱스가 URL 배열 범위를 벗어날 경우)
      else {
        // File 배열에서의 인덱스 계산
        const fileIndex = index - safeInitialUrls.length;

        setForm((prev: any) => {
          const prevFiles: File[] = prev.images || [];

          return {
            ...prev,
            images: prevFiles.filter((_, i) => i !== fileIndex),
          };
        });
      }
    },
    [initialImageUrls, setInitialImageUrls, setForm]
  );

  /**
   * [reorder]
   * 리스트 아이템의 순서를 변경하는 순수 헬퍼 함수
   */
  const reorder = (
    list: (string | File)[],
    startIndex: number,
    endIndex: number
  ) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  /**
   * [handleReorder]
   * 드래그 앤 드롭으로 이미지 순서가 변경되었을 때 처리
   * 재정렬된 `allImages`를 다시 `initialImageUrls`와 `form.images`로 분리하여 저장
   */
  const handleReorder = useCallback(
    (startIndex: number, endIndex: number) => {
      const reordered = reorder(allImages, startIndex, endIndex);

      // 재정렬된 배열에서 URL(string)과 File 객체로 분리
      const newUrls = reordered.filter(
        (item) => typeof item === "string"
      ) as string[];
      const newFiles = reordered.filter(
        (item) => item instanceof File
      ) as File[];

      // 분리된 배열을 각각의 상태에 업데이트
      if (typeof setInitialImageUrls === "function") {
        setInitialImageUrls(newUrls);
      }
      setForm((prev: any) => ({
        ...prev,
        images: newFiles,
      }));
    },
    [allImages, setInitialImageUrls, setForm]
  );

  // ViewModel 노출
  return {
    // API 데이터 및 View 옵션
    regions,
    categories,
    tags,
    managers,
    address,
    customChips,
    newChip,
    capacityInput,

    // 유효성 검사 결과
    capacityErrorMessage,
    isSettingsValid,

    // 이미지 관리
    files: allImages, // 뷰에서 사용할 (string | File)[] 배열
    previews, // 뷰에서 사용할 미리보기 URL 배열
    imageSubmitData, // 제출 시 API에 전달할 데이터 구조
    inputRef,

    // 핸들러
    openPicker,
    onChange,
    clear,
    handleReorder,
    removeAt,
    setNewChip,
    handleInputChange,
    handleSelectChange,
    handleCapacityChange,
    toggleChips,
    addChip,
    removeCustomChip,
  };
};
