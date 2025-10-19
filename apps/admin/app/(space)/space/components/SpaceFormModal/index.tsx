import React, { useEffect, useState, useCallback } from "react";
import {
  Overlay,
  ModalContainer,
  Header,
  CloseButton,
  Content,
  SubmitButton,
  Footer,
} from "./styles";
import { useSpaceForm } from "../../hooks/useSpaceForm";
import Tabs from "./components/Tabs";
import SpaceSettingsForm from "./forms/SpaceSettingsForm";
import OperatingTimeForm from "./forms/OperatingTimeForm";
import { SpaceDetailResponse, SpacePayload } from "@admin/types/dto/space.dto";
import { Button } from "@components/index";

interface SpaceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialData?: SpaceDetailResponse;
  onSubmit: (data: any, isUpdate: boolean) => Promise<void>;
}

const SpaceFormModal: React.FC<SpaceFormModalProps> = ({
  isOpen,
  onClose,
  title,
  initialData,
  onSubmit,
}) => {
  const isUpdateMode = !!initialData;

  // ✅ [수정] 1. onSubmit prop을 useCallback으로 래핑하여 안정화
  // 부모 컴포넌트에서 onSubmit이 안정적이지 않다고 가정하고 여기서 래핑합니다.
  const stableOnSubmit = useCallback(onSubmit, [onSubmit]);

  // ✅ 2. useSpaceForm 호출 시 stableOnSubmit 전달
  const {
    form,
    setForm,
    resetForm,
    handleSubmit,
    isFormValid,
    setIsSettingsValid,
    initialImageUrls,
    setInitialImageUrls,
  } = useSpaceForm(stableOnSubmit, isUpdateMode); // 👈 stableOnSubmit 전달

  const [activeKey, setActiveKey] = useState("settings");

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      console.log("initialData", initialData);

      // SpaceDetailResponse → SpacePayload 형태로 변환
      const mapped: SpacePayload = {
        spaceName: initialData.spaceName,
        spaceDescription: initialData.spaceDescription,
        spaceCapacity: initialData.spaceCapacity,
        spaceIsAvailable: initialData.spaceIsAvailable,
        regionId: initialData.region.regionId,
        categoryId: initialData.category.categoryId,
        locationId: initialData.location.locationId,
        tagNames: initialData.tagNames,
        adminId: initialData.admin.adminId,
        reservationWay: initialData.reservationWay,
        spaceRules: initialData.spaceRules,
        operations: initialData.operations,
        closedDays: initialData.closedDays,
      };

      // ✅ [수정] 기존 이미지 URL 배열 생성 (썸네일 + 상세 이미지)

      const initialImageUrls: string[] = [];
      if (initialData.spaceImageUrl) {
        initialImageUrls.push(initialData.spaceImageUrl); // 썸네일 이미지 (string)
      }
      if (initialData.detailImageUrls) {
        initialImageUrls.push(...initialData.detailImageUrls); // 나머지 이미지 (string)
      }

      console.log("initial image: ", initialImageUrls);

      resetForm({
        space: mapped,
        images: [],
        initialImageUrls: initialImageUrls, // ✅ [확인] 이 키로 resetForm에 전달되어야 합니다.
      });
    } else {
      resetForm(); // 신규 등록 기본값
    }
  }, [isOpen, initialData, resetForm]);

  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalContainer>
        <Header>
          <h2>{title}</h2>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </Header>
        <Content>
          <Tabs
            activeKey={activeKey}
            onChange={setActiveKey}
            items={[
              {
                key: "settings",
                label: "공간 설정",
                content: (
                  <SpaceSettingsForm
                    form={form}
                    setForm={setForm}
                    onValidationChange={setIsSettingsValid}
                    initialImageUrls={initialImageUrls}
                    setInitialImageUrls={setInitialImageUrls}
                  />
                ),
              },
              {
                key: "time",
                label: "운영시간 설정",
                content: <OperatingTimeForm form={form} setForm={setForm} />,
              },
            ]}
          />
        </Content>
        <Footer>
          <Button
            onClick={handleSubmit}
            isActive={isFormValid}
            disabled={!isFormValid}
          >
            {title.includes("수정") ? "수정하기" : "등록하기"}
          </Button>
        </Footer>
      </ModalContainer>
    </Overlay>
  );
};

export default SpaceFormModal;
