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
  getRegionMenuListApi,
  getTagsApi,
} from "@admin/lib/api/adminSpace";

interface SelectOption {
  label: string;
  value: string;
}

interface ViewModelProps {
  form: any; // 전체 폼 데이터 객체
  setForm: (next: any) => void; // 전체 폼 데이터 업데이트 함수
  // ✅ [추가] useSpaceForm에서 전달받은 URL 상태 관리 props
  initialImageUrls: string[];
  setInitialImageUrls: (urls: string[]) => void;
}

/**
 * 공간 설정 폼의 모든 비즈니스 로직과 상태를 관리하는 ViewModel 훅
 */
export const useSpaceSettings = ({
  form,
  setForm,
  initialImageUrls,
  setInitialImageUrls,
}: ViewModelProps) => {
  // 1. 상태: API 데이터 및 입력 제어 상태
  const [regions, setRegions] = useState<SelectOption[]>([]); // 지점 옵션 리스트
  const [categories, setCategories] = useState<SelectOption[]>([]); // 카테고리 옵션 리스트
  const [tags, setTags] = useState<string[]>([]); // 기본 편의시설 태그 리스트
  const [managers, setManagers] = useState<SelectOption[]>([]); // 담당자 옵션 리스트
  const [address, setAddress] = useState(""); // 선택된 지점의 상세 주소

  const [customChips, setCustomChips] = useState<string[]>([]); // 사용자 추가 편의시설
  const [newChip, setNewChip] = useState(""); // 새로 입력 중인 편의시설 이름

  // 수용 인원 입력 제어를 위한 로컬 상태 (사용자의 raw 문자열 입력값을 관리)
  const [capacityInput, setCapacityInput] = useState(
    String(form.space.spaceCapacity ?? "")
  );

  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * [Capacity 동기화]
   * 부모 폼 상태(form.space.spaceCapacity)가 외부에서 변경될 때 (예: 탭 전환, 초기 데이터 로드)
   * 로컬 입력 상태(capacityInput)를 동기화하여 UI에 반영합니다.
   */
  useEffect(() => {
    setCapacityInput(String(form.space.spaceCapacity ?? ""));
  }, [form.space.spaceCapacity]);

  // 3. Effect: API 데이터 페칭

  /**
   * [초기 로드]
   * 컴포넌트 마운트 시, 지점, 카테고리, 태그 리스트를 API에서 불러옵니다.
   */
  useEffect(() => {
    // ✅ API 호출을 병렬로 처리하고 상태를 업데이트하여 렌더링 횟수를 줄입니다.
    const fetchAllInitialData = async () => {
      try {
        const [regionsRes, categoriesRes, tagsRes] = await Promise.all([
          getRegionMenuListApi(),
          getCategoryListApi(),
          getTagsApi(),
        ]);

        setRegions(
          regionsRes.map((r: RegionListResponse[number]) => ({
            label: r.regionName,
            value: String(r.regionId),
          }))
        );

        setCategories(
          categoriesRes.map((c: CategoryListResponse[number]) => ({
            label: c.categoryName,
            value: String(c.categoryId),
          }))
        );
        setTags(tagsRes.map((t: TagsResponse[number]) => t.tagName));
      } catch (error) {
        console.error("Failed to fetch initial API data:", error);
      }
    };

    fetchAllInitialData();
  }, []); // 의존성 배열 유지

  /**
   * [지점 변경]
   * form.space.regionId가 변경될 때, 해당 지점의 상세 주소와 담당자 리스트를 불러옵니다.
   */
  useEffect(() => {
    const regionId = form.space.regionId;
    if (!regionId) return;

    const fetchRegionDetails = async () => {
      const addr: AddressByRegionIdResponse = await getAddressApi({ regionId });
      setAddress(addr[0]?.addressRoad || "");

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

  // 4. Effect: 폼 상태 동기화 및 이미지 복원 로직

  /**
   * [이미지 폼 동기화]
   * `useImgUpload`의 files 상태가 변경될 때마다 부모 폼의 `images`를 업데이트합니다.
   */
  //   useEffect(() => {
  //     setForm((prev: any) => {
  //       if (prev.images === files) return prev;
  //       return { ...prev, images: files };
  //     });
  //   }, [files, setForm]);

  /**
   * [이미지 URL 재발급]
   * 탭 전환 후 돌아올 때 `files` 상태를 재설정하여 이미지 미리보기 URL을 재발급합니다.
   */
  //   useEffect(() => {
  //     if (form.images && form.images.length > 0) {
  //       setFiles(form.images);
  //     }
  //   }, []);

  // 5. 파생 상태: 이미지 프리뷰 및 유효성 검사

  // form.images는 File[]이고, initialImageUrls는 string[]입니다.
  // ✅ [수정] form.images를 직접 사용하며, 뷰에 표시할 때는 allImages를 사용합니다.
  // form.images는 SpaceCreateBody 타입인 File[]로 유지됩니다.
  const currentFiles: File[] = form.images || [];

  // ✅ [추가/수정] View에 표시될 최종 이미지 목록: URL과 File 객체를 합친 배열
  const allImages: (string | File)[] = useMemo(() => {
    const finalImages = [...(initialImageUrls || []), ...currentFiles];

    return finalImages;
  }, [initialImageUrls, currentFiles]); // currentFiles에 의존

  // 뷰에서 File 객체 개수를 셀 때 사용할 files (form.images와 동일)
  //   const files = form.images;

  // ✅ [수정] 이미지 프리뷰 URL 생성
  const previews = useMemo(() => {
    return allImages.map((item) => {
      if (typeof item === "string") {
        return item; // 기존 URL은 그대로 사용
      }
      return URL.createObjectURL(item); // 새 File 객체는 URL.createObjectURL로 변환
    });
  }, [allImages]);

  /**
   * [수용 인원 에러 메시지]
   * `capacityInput` (사용자 입력값)을 기준으로 수용 인원의 유효성을 검사하고 에러 메시지를 반환합니다.
   */
  const capacityErrorMessage = useMemo(() => {
    const input = capacityInput.trim();

    if (input === "") return ""; // 값이 없으면 필수값 검증으로 넘김

    // 순수하게 숫자 정수 형태가 아니거나 소수점이 포함된 경우
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

  // 6. 폼 유효성 검증 헬퍼 함수

  /**
   * 수용 인원 필드의 폼 데이터 유효성(1 이상의 정수)을 확인합니다.
   * @param value - form.space.spaceCapacity에 저장된 값
   */
  const isValidCapacity = (value: any): boolean => {
    if (value === null || value === undefined || value === "") return false;
    const num = Number(value);
    if (isNaN(num)) return false;

    // 1 이상의 정수인지 확인
    return Number.isInteger(num) && num > 0;
  };

  /**
   * [전체 폼 유효성]
   * 폼 전반의 필수 입력 조건 및 유효성 검사 결과를 종합하여 반환합니다.
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

    // 최종 유효성 검사 (필수 항목, 이미지 조건, 수용 인원 형식 모두 만족)
    return (
      isImageValid &&
      areRequiredFieldsPresent &&
      isCapacityValid &&
      isTagNamesValid &&
      capacityErrorMessage === "" // 수용 인원에 실시간 에러 메시지가 없어야 함
    );
  }, [form, allImages, capacityErrorMessage]);

  // 7. 이벤트 핸들러

  /**
   * [일반 Input 변경]
   * 수용 인원 필드를 제외한 일반 텍스트, 텍스트 영역, 스위치 변경을 처리합니다.
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

  // ✅ [추가] 파일 선택기 열기
  const openPicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  // ✅ [추가] 새 파일 선택 시 처리 (onChange)
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
      e.target.value = "";
    },
    [allImages, setForm, form.images]
  );

  // ✅ [추가] 모든 이미지 제거 (clear)
  const clear = useCallback(() => {
    if (typeof setInitialImageUrls === "function") {
      // ✅ 안전성 강화
      setInitialImageUrls([]);
    }
    setForm((prev: any) => ({
      ...prev,
      images: [],
    }));
  }, [setInitialImageUrls, setForm]);

  // ✅ [추가] 최종 제출 시 필요한 이미지 데이터 구조 계산
  const imageSubmitData = useMemo(() => {
    const finalOrder: string[] = []; // 최종 keepUrlsOrder 배열
    const newFiles: File[] = []; // 새로 업로드할 File 객체 배열

    // allImages는 현재 View에 표시되는 File 객체(새 파일)와 string(기존 URL)의 순서가 혼합된 배열입니다.
    (allImages || []).forEach((item: string | File) => {
      if (item instanceof File) {
        // A. 새 File 객체: newFiles에 추가하고, finalOrder에는 'new:i' 토큰 추가
        const token = `new:${newFiles.length}`;
        newFiles.push(item);
        finalOrder.push(token);
      } else if (typeof item === "string") {
        // B. 기존 URL: finalOrder에 그대로 URL 추가
        finalOrder.push(item);
      }
    });

    return {
      images: newFiles, // API의 images 필드 (File 객체만)
      keepUrlsOrder: finalOrder, // API의 keepUrlsOrder 필드 (URL 또는 new:i 토큰)
    };
  }, [allImages]); // allImages 배열의 내용/순서가 바뀔 때마다 재계산

  // 특정 인덱스의 이미지 제거: URL과 File을 분리하여 제거
  // ✅ [수정] removeAt 함수 (files 대신 currentFiles 사용)
  // 특정 인덱스의 이미지 제거: URL과 File을 분리하여 제거
  const removeAt = useCallback(
    (index: number) => {
      // 💡 [수정] initialImageUrls가 undefined일 경우 빈 배열로 처리하여 length 읽기 에러 방지
      const safeInitialUrls = initialImageUrls || [];

      // (1) 기존 URL 제거
      if (index < safeInitialUrls.length) {
        // ✅ safeInitialUrls 사용
        // 안전성 검사 추가 (이전에 추가한 내용)
        if (typeof setInitialImageUrls === "function") {
          setInitialImageUrls(safeInitialUrls.filter((_, i) => i !== index));
        }
      }
      // (2) 새 파일 (File 객체) 제거
      else {
        // File 배열에서의 인덱스
        const fileIndex = index - safeInitialUrls.length; // ✅ safeInitialUrls 사용

        setForm((prev: any) => {
          const prevFiles: File[] = prev.images || [];

          return {
            ...prev,
            images: prevFiles.filter((_, i) => i !== fileIndex),
          };
        });
      }
    },
    // 의존성 배열 유지 (initialImageUrls는 그대로 prop에서 받아옴)
    [initialImageUrls, setInitialImageUrls, setForm]
  );

  // ✅ [추가] reorder 순수 함수
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

  // ✅ [수정] handleReorder 함수 (allImages 사용)
  const handleReorder = useCallback(
    (startIndex: number, endIndex: number) => {
      const reordered = reorder(allImages, startIndex, endIndex);

      // 순서가 바뀐 배열에서 URL(string)과 File 객체로 분리
      const newUrls = reordered.filter(
        (item) => typeof item === "string"
      ) as string[];
      const newFiles = reordered.filter(
        (item) => item instanceof File
      ) as File[];

      // 분리된 배열을 각각의 상태에 업데이트
      if (typeof setInitialImageUrls === "function") {
        // ✅ 안전성 강화
        setInitialImageUrls(newUrls);
      }
      setForm((prev: any) => ({
        ...prev,
        images: newFiles,
      }));
    },
    [allImages, setInitialImageUrls, setForm]
  );

  /**
   * [Selectbox 변경]
   * 셀렉트박스 변경을 처리하며, regionId가 변경될 경우 locationId도 함께 업데이트합니다.
   */
  const handleSelectChange = useCallback(
    (field: string, value: string) => {
      const numValue = Number(value);
      setForm((prev: any) => ({
        ...prev,
        space: {
          ...prev.space,
          [field]: numValue,
          ...(field === "regionId" && { locationId: numValue }),
        },
      }));
    },
    [setForm]
  );

  /**
   * [수용 인원 Input 변경]
   * 수용 인원 필드 전용 핸들러. 로컬 상태를 업데이트하여 에러 메시지를 즉시 표시하고,
   * 유효한 정수일 경우에만 실제 폼 상태를 업데이트합니다.
   */
  const handleCapacityChange = useCallback(
    (value: string) => {
      setCapacityInput(value); // 로컬 입력 상태 업데이트 (에러 메시지 trigger)

      const num = Number(value);

      // 빈 문자열이거나 유효한 양의 정수일 때만 실제 폼 상태(form.space.spaceCapacity) 업데이트
      if (value === "" || (num > 0 && Number.isInteger(num))) {
        setForm((prev: any) => ({
          ...prev,
          space: { ...prev.space, spaceCapacity: value === "" ? "" : num },
        }));
      }
      // 유효하지 않은 입력(소수점, 문자)은 로컬 상태에만 반영되고 폼 상태는 변경되지 않음
    },
    [setForm]
  );

  /**
   * [태그 토글]
   * 기존/추가된 편의시설 태그의 선택/해제를 처리합니다.
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
   * 사용자가 입력한 새로운 편의시설 태그를 추가합니다.
   */
  const addChip = useCallback(() => {
    const v = newChip.trim();
    if (!v || customChips.includes(v)) return;

    setCustomChips((prev) => [...prev, v]);
    setForm((prev: any) => ({
      ...prev,
      space: {
        ...prev.space,
        tagNames: [...(prev.space.tagNames || []), v],
      },
    }));
    setNewChip("");
  }, [newChip, customChips, setForm]);

  /**
   * [커스텀 태그 제거]
   * 사용자 정의로 추가된 편의시설 태그를 제거합니다.
   */
  const removeCustomChip = useCallback(
    (chip: string) => {
      setCustomChips((prev) => prev.filter((c) => c !== chip));
      setForm((prev: any) => ({
        ...prev,
        space: {
          ...prev.space,
          tagNames: (prev.space.tagNames || []).filter(
            (c: string) => c !== chip
          ),
        },
      }));
    },
    [setForm]
  );

  // 8. ViewModel 노출
  return {
    // API 데이터 및 View 옵션
    regions,
    categories,
    tags,
    managers,
    address,
    customChips,
    newChip,
    capacityInput, // 수용 인원 Input의 실제 표시 값 (로컬 상태)

    // 유효성 검사 결과
    capacityErrorMessage,
    isSettingsValid,

    // 이미지 관리
    files: allImages, // 뷰에서 사용할 (string | File)[] 배열
    previews,
    imageSubmitData,
    inputRef, // ✅ [추가] inputRef 노출

    // 핸들러
    openPicker, // ✅ [추가] openPicker 노출
    onChange, // ✅ [추가] onChange 노출
    clear, // ✅ [추가] clear 노출
    handleReorder,
    removeAt,

    // 이벤트 핸들러
    setNewChip,
    handleInputChange,
    handleSelectChange,
    handleCapacityChange, // 수용 인원 전용 핸들러
    toggleChips,
    addChip,
    removeCustomChip,
  };
};
