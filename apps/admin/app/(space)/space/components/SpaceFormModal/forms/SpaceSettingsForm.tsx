"use client";

import React, { useState, useEffect } from "react";
import { useSpaceSettings } from "../../../hooks/useSpaceSettings";
import { SectionHeader, Field } from "./common";
import { GapBox } from "@admin/components/GapBox";
import styled from "@emotion/styled";
import colors from "@styles/theme";
import { Input, Textarea, IconButton, Switch, Selectbox2 } from "@components";
import { ChipGroup } from "../components";
import { RemovableChipGroup } from "../components";
import { DeleteIconWrapper } from "../styles";

interface Props {
  form: any;
  setForm: (next: any) => void;

  onValidationChange: (isValid: boolean) => void;
  initialImageUrls: string[];
  setInitialImageUrls: (urls: string[]) => void;
}

const SpaceSettingsForm: React.FC<Props> = ({
  form,
  setForm,
  onValidationChange,
  // ✅ props 구조 분해 할당
  initialImageUrls,
  setInitialImageUrls,
}) => {
  // 1. ViewModel 사용: 모든 상태와 로직을 가져옴
  const vm = useSpaceSettings({
    form,
    setForm,
    initialImageUrls,
    setInitialImageUrls,
  });

  console.log("initial image urls in setting page:", initialImageUrls);

  // 💡 로그 추가: 컴포넌트 렌더링 시점의 vm.files 상태 확인
  // useEffect(() => {
  //   console.log("Form: vm.files ready length:", vm.files.length, vm.files);
  // }, [vm.files]);

  // 2. View-specific 상태: Drag & Drop UI 피드백에 관련된 상태는 View에 남겨둠
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // 3. Effect: ViewModel의 유효성 결과 변경 시 부모 컴포넌트에 전달
  useEffect(() => {
    onValidationChange(vm.isSettingsValid);
  }, [vm.isSettingsValid, onValidationChange]);

  // 현재 뷰에서 사용할 이미지 배열은 vm.files입니다. (string | File)[]
  const currentImages = vm.files;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* 1. 이미지 업로드 영역 */}
      <SectionHeader>
        <span>공간 이미지 ({currentImages.length}/5) </span>
        <DeleteAllImg onClick={vm.clear}>이미지 전체 삭제</DeleteAllImg>
      </SectionHeader>

      <StyledScrollContainer>
        {[...Array(5)].map((_, i) => (
          <ImageUpload
            key={i}
            onClick={vm.openPicker}
            draggable={!!vm.files[i]}
            onDragStart={() => setDraggedIndex(i)}
            onDragEnd={() => {
              setDraggedIndex(null);
              setDragOverIndex(null);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverIndex(vm.files[i] ? i : null);
            }}
            onDragLeave={() => setDragOverIndex(null)}
            onDrop={() => {
              if (draggedIndex === null || !currentImages[i]) return;

              // 1. 순서 변경
              // const reordered = reorder(currentImages, draggedIndex, i);

              // // 2. ✅ [추가] 순서 변경된 배열을 URL(string)과 File 객체로 분리
              // const newUrls = reordered.filter((item) => typeof item === 'string') as string[];
              // const newFiles = reordered.filter((item) => item instanceof File) as File[];

              // 3. ✅ [추가] 분리된 배열을 setForm과 setInitialImageUrls로 각각 업데이트
              vm.handleReorder(draggedIndex, i); // ViewModel에 추가할 함수 호출

              setDraggedIndex(null);
              setDragOverIndex(null);
            }}
            // onDrop={() => {
            //   if (draggedIndex === null || !vm.files[i]) return;
            //   const reordered = reorder(vm.files, draggedIndex, i);
            //   vm.setFiles(reordered); // ViewModel의 setFiles를 사용하여 상태 업데이트
            //   setDraggedIndex(null);
            //   setDragOverIndex(null);
            // }}
            isDragging={draggedIndex === i}
            isDragOver={dragOverIndex === i}
          >
            {vm.files[i] ? (
              <SpaceImageWrapper>
                <img
                  src={vm.previews[i]} // ✅ ViewModel의 previews 사용
                  alt={`업로드 이미지 ${i + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "0.625rem",
                    objectFit: "cover",
                  }}
                />
                {i === 0 && <MainBadge>메인 사진</MainBadge>}
                <DeleteIconWrapper>
                  <img
                    src="/icons/delete.svg"
                    onClick={(e) => {
                      e.stopPropagation();
                      vm.removeAt(i);
                    }}
                  />
                </DeleteIconWrapper>
              </SpaceImageWrapper>
            ) : (
              <IconWrapper>
                <img src="/icons/upload.svg" />
                <p>이미지 업로드</p>
              </IconWrapper>
            )}
          </ImageUpload>
        ))}
      </StyledScrollContainer>

      <ImageDropZone
        onClick={vm.openPicker}
        // onDrop={vm.onDrop}
        // onDragOver={vm.onDragOver}
        // onDragEnter={vm.onDragEnter}
        // onDragLeave={vm.onDragLeave}
        // isDragging={vm.isDragging}
        isDragging={false} // ✅ false로 설정 (또는 DropZone 스타일에서 isDragging prop 제거)
      >
        <img src="/icons/upload.svg" height={30} width={30} />
        <span>추가 이미지 업로드 ({5 - vm.files.length}장 더 가능)</span>
        <p>드래그 하거나 클릭해서 업로드 JPG • PNG</p>
      </ImageDropZone>

      <input
        type="file"
        multiple
        accept="image/*"
        ref={vm.inputRef}
        style={{ display: "none" }}
        onChange={vm.onChange}
      />

      {/* 2. 필드 영역 */}
      <Field>
        <Label>공간 이름</Label>
        <Input
          placeholder="공간명을 입력하세요"
          value={form.space.spaceName ?? ""}
          onChange={(e) => vm.handleInputChange("spaceName", e.target.value)}
        />
      </Field>

      <Field>
        <Label>수용 인원</Label>
        <Input
          placeholder="수용 인원수를 입력하세요"
          value={vm.capacityInput}
          onChange={(e) => {
            const value = e.target.value;

            // ✅ 수정: 입력 제어는 Input 핸들러가 아닌 ViewModel의 handleCapacityChange가 담당
            vm.handleCapacityChange(value);
          }}
          errorMessage={vm.capacityErrorMessage}
        />
      </Field>

      <Field>
        <Label>지점</Label>
        <Selectbox2
          options={vm.regions}
          placeholder="지점 선택"
          value={String(form.space.regionId)}
          onChange={(v: string) => vm.handleSelectChange("regionId", v)}
        />
        <Input
          placeholder="상세 주소"
          readOnly
          disabled
          value={vm.address ?? ""}
        />
      </Field>

      <Field>
        <Label>공간 카테고리</Label>
        <Selectbox2
          options={vm.categories}
          placeholder="카테고리 선택"
          value={String(form.space.categoryId)}
          onChange={(v: string) => vm.handleSelectChange("categoryId", v)}
        />
      </Field>

      <Field>
        <Label>담당자</Label>
        <Selectbox2
          options={vm.managers}
          placeholder="담당자를 선택해주세요"
          value={String(form.space.adminId)}
          onChange={(v: string) => vm.handleSelectChange("adminId", v)}
        />
      </Field>

      <Field>
        <Label>
          편의시설 <span>(선택 {form.space.tagNames.length}개)</span>
        </Label>
        <ChipGroup
          options={vm.tags}
          selected={form.space.tagNames}
          onToggle={vm.toggleChips}
        />
        <Row>
          <Input
            placeholder="추가할 편의시설을 입력해주세요"
            width="15.5rem"
            value={vm.newChip}
            onChange={(e) => vm.setNewChip(e.target.value)}
          />
          <IconButton
            label="추가하기"
            width="5.5rem"
            color={vm.newChip.trim() ? "white" : colors.graycolor50}
            bgcolor={vm.newChip.trim() ? colors.maincolor : colors.graycolor5}
            onClick={vm.addChip}
            disabled={!vm.newChip.trim()}
          />
        </Row>
        <RemovableChipGroup
          chips={vm.customChips}
          onRemove={vm.removeCustomChip}
        />
      </Field>

      <Field>
        <Label>공간 설명</Label>
        <Textarea
          placeholder="공간에 대한 설명을 입력해주세요"
          value={form.space.spaceDescription}
          onChange={(e) =>
            vm.handleInputChange("spaceDescription", e.target.value)
          }
        />
      </Field>

      <Field>
        <Label>예약 과정</Label>
        <Textarea
          placeholder="예약에 대한 설명을 입력해주세요"
          value={form.space.reservationWay}
          onChange={(e) =>
            vm.handleInputChange("reservationWay", e.target.value)
          }
        />
      </Field>

      <Field>
        <Label>이용 수칙</Label>
        <Textarea
          placeholder="공간에 대한 이용 수칙을 입력해주세요"
          value={form.space.spaceRules}
          onChange={(e) => vm.handleInputChange("spaceRules", e.target.value)}
        />
      </Field>

      <Field>
        <Label>공간 활성화</Label>
        <Switch
          initial={form.space.spaceIsAvailable}
          onToggle={(v) => vm.handleInputChange("spaceIsAvailable", v)}
        />
      </Field>

      <GapBox h="1.25rem" />
    </div>
  );
};

export default SpaceSettingsForm;

// --- styled ---
const paddingRightRem = 3.75;

const DeleteAllImg = styled.button`
  border-radius: 0.25rem;
  border: 1px solid ${colors.graycolor10};
  padding: 0.38rem 0.5rem;
  color: ${colors.graycolor30};
  font-size: 0.625rem;
  font-weight: 600;
  cursor: pointer;
`;

const ImageUpload = styled.div<{ isDragging?: boolean; isDragOver?: boolean }>`
  position: relative;
  min-width: 7.9375rem;
  height: 7.3125rem;
  border-radius: 0.625rem;
  background-color: ${colors.graycolor5};
  color: ${colors.graycolor50};
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${({ isDragging }) => (isDragging ? 0.5 : 1)};
  box-shadow: ${({ isDragOver }) =>
    isDragOver ? `0 0 0 3px ${colors.graycolor50}` : "none"};
  transition: box-shadow 0.2s ease, opacity 0.2s ease;
  cursor: pointer;
`;

export const MainBadge = styled.div`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background: ${colors.sementicFillStrong}66;
  color: #fff;
  padding: 0.25rem 0.5rem;
  border-radius: 0.625rem;
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: -0.00688rem;
`;

export const ImageDropZone = styled.div<{ isDragging: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px dashed ${colors.graycolor10};
  border-radius: 0.63rem;
  padding: 0.75rem 0;
  margin-bottom: 1rem;
  margin-right: ${paddingRightRem}rem;
  color: ${colors.graycolor50};
  background-color: ${(p) => (p.isDragging ? colors.graycolor10 : "#fff")};

  span {
    font-size: 0.75rem;
    font-weight: 400;
    letter-spacing: -0.00825rem;
  }
  p {
    font-size: 0.625rem;
    font-weight: 400;
    letter-spacing: -0.00688rem;
  }
`;

const Row = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  height: 2.8rem;
`;

const Label = styled.label`
  color: ${colors.graycolor100};
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.5rem;
  letter-spacing: -0.00963rem;

  span {
    color: ${colors.graycolor50};
  }
`;

const SpaceImageWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const StyledScrollContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;
