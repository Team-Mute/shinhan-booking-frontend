import { useState, useCallback } from "react";
import { SpaceCreateBody, SpaceUpdateBody } from "@admin/types/dto/space.dto";
import { useSpaceSettings } from "./useSpaceSettings";

interface SpaceFormState extends SpaceCreateBody {
  customTagNames: string[]; // 새로 추가된 커스텀 태그만 모아두는 배열
}

const defaultForm: SpaceFormState = {
  space: {
    // ... 기존 space 필드
    spaceName: undefined,
    spaceDescription: undefined,
    spaceCapacity: undefined,
    spaceIsAvailable: true,
    regionId: undefined,
    categoryId: undefined,
    locationId: undefined,
    tagNames: [], // 태그 이름은 space에 그대로 유지
    adminId: undefined,
    reservationWay: undefined,
    spaceRules: undefined,
    operations: [
      { day: 1, from: "09:00", to: "18:00", isOpen: true },
      { day: 2, from: "09:00", to: "18:00", isOpen: true },
      { day: 3, from: "09:00", to: "18:00", isOpen: true },
      { day: 4, from: "09:00", to: "18:00", isOpen: true },
      { day: 5, from: "09:00", to: "18:00", isOpen: true },
      { day: 6, from: "09:00", to: "18:00", isOpen: false },
      { day: 7, from: "09:00", to: "18:00", isOpen: false },
    ],
    closedDays: [],
  },
  images: [],
  customTagNames: [],
};

export const useSpaceForm = (
  onSubmit: (data: any, isUpdate: boolean) => Promise<void>,
  isUpdateMode: boolean
) => {
  const [form, setForm] = useState<SpaceFormState>(defaultForm);
  const [initialImageUrls, setInitialImageUrls] = useState<string[]>([]);

  const [isSettingsValid, setIsSettingsValid] = useState(false);
  const [isTimeValid, setIsTimeValid] = useState(true); // 사용자의 직접 입력이 없어서 true로 초기화

  const isFormValid = isSettingsValid && isTimeValid;

  //  ViewModel 호출: URL 관련 상태도 함께 전달
  const vm = useSpaceSettings({
    form,
    setForm,
    initialImageUrls,
    setInitialImageUrls,
  });

  //resetForm: 초기 데이터가 있을 경우 initialImageUrls 상태도 설정
  const resetForm = useCallback((data?: any) => {
    // data.space가 있을 경우 (수정 모드) 기존 데이터를 사용, 없으면 defaultForm 사용
    const baseForm = data?.space
      ? {
          ...data,
          images: data.images || [],
          customTagNames: data.customTagNames || [], // ✅ 추가
        }
      : defaultForm;

    setForm(baseForm);

    // URL 배열은 resetForm 시 initialImageUrls 상태에 저장
    setInitialImageUrls(data?.initialImageUrls || []);
  }, []);

  const handleSubmit = async () => {
    if (!isFormValid) return;

    const { space } = form;

    // vm.imageSubmitData는 수정 모드에서만 의미가 있습니다.
    const { images: newFiles, keepUrlsOrder } = vm.imageSubmitData;

    // 1. API에 전달할 기본 body 객체 (등록/수정 공통)
    let body: SpaceCreateBody | SpaceUpdateBody;

    if (isUpdateMode) {
      // [수정 모드]
      body = {
        space,
        images: newFiles, // File 객체 배열
        // keepUrlsOrder는 수정 시에만 존재
        keepUrlsOrder: keepUrlsOrder,
      } as SpaceUpdateBody;
    } else {
      // [등록 모드]
      body = {
        space,
        images: newFiles, // File 객체 배열
        // 등록 모드에서는 keepUrlsOrder가 필요 없음
      } as SpaceCreateBody;
    }

    // 2. onSubmit 호출: body 데이터와 isUpdateMode 플래그를 전달
    // 💡 body에는 File 객체가 포함되어 있으므로, onSubmit 핸들러가 FormData를 구성해야 합니다.
    await onSubmit(body, isUpdateMode);
  };

  return {
    form,
    setForm,
    resetForm,
    handleSubmit,

    // 유효성 상태를 업데이트할 수 있는 함수 노출
    setIsSettingsValid,
    setIsTimeValid,

    initialImageUrls,
    setInitialImageUrls,

    // 버튼 활성화에 사용할 전체 유효성 상태 노출
    isFormValid,
  };
};
