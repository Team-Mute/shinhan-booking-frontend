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

/**
 * SpaceSettingsForm 컴포넌트
 * ----------------------------
 * 공간 등록/수정 폼의 기본 정보 설정(이미지, 이름, 지점, 카테고리, 태그 등) 섹션
 *
 * - 대부분의 비즈니스 로직과 상태는 useSpaceSettings 훅(vm)에 위임됨
 * - 이미지 업로드, 미리보기, 드래그&드롭 재정렬 기능을 담당
 * - 폼 필드와 ViewModel 핸들러 연결
 */
const SpaceSettingsForm: React.FC<Props> = ({
  form,
  setForm,
  onValidationChange,
  initialImageUrls,
  setInitialImageUrls,
}) => {
  // ViewModel 사용: useSpaceSettings 훅을 호출하여 모든 상태와 핸들러(vm)를 가져옴
  const vm = useSpaceSettings({
    form,
    setForm,
    initialImageUrls,
    setInitialImageUrls,
  });

  // View-specific 상태: Drag & Drop UI 피드백을 위한 상태 (ViewModel에 포함시키지 않음)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Effect: ViewModel의 폼 유효성(vm.isSettingsValid)이 변경될 때마다 부모 컴포넌트에 전달
  useEffect(() => {
    onValidationChange(vm.isSettingsValid);
  }, [vm.isSettingsValid, onValidationChange]);

  // 현재 뷰에서 렌더링할 이미지 배열 (File 객체 또는 URL)
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
            onClick={vm.openPicker} // 클릭 시 파일 선택기 열기
            draggable={!!vm.files[i]} // 이미지가 있을 때만 드래그 가능
            onDragStart={() => setDraggedIndex(i)} // 드래그 시작 시 인덱스 저장
            onDragEnd={() => {
              setDraggedIndex(null);
              setDragOverIndex(null);
            }} // 드래그 종료 시 상태 초기화
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverIndex(vm.files[i] ? i : null);
            }} // 드래그 오버 시 인덱스 저장 (드롭 가능 영역)
            onDragLeave={() => setDragOverIndex(null)} // 드래그 영역 벗어남
            onDrop={() => {
              if (draggedIndex === null || !currentImages[i]) return;

              vm.handleReorder(draggedIndex, i); // 이미지 순서 재정렬 로직 호출 (ViewModel)

              setDraggedIndex(null);
              setDragOverIndex(null);
            }}
            isDragging={draggedIndex === i}
            isDragOver={dragOverIndex === i}
          >
            {vm.files[i] ? (
              // 이미지가 있을 경우: 미리보기 및 삭제 버튼 표시
              <SpaceImageWrapper>
                <img
                  src={vm.previews[i]} // 미리보기 URL 사용
                  alt={`업로드 이미지 ${i + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "0.625rem",
                    objectFit: "cover",
                  }}
                />
                {i === 0 && <MainBadge>메인 사진</MainBadge>}{" "}
                {/* 첫 번째 이미지는 메인 배지 표시 */}
                <DeleteIconWrapper>
                  <img
                    src="/icons/delete.svg"
                    onClick={(e) => {
                      e.stopPropagation();
                      vm.removeAt(i); // 특정 인덱스 이미지 삭제
                    }}
                  />
                </DeleteIconWrapper>
              </SpaceImageWrapper>
            ) : (
              // 이미지가 없을 경우: 업로드 안내 아이콘 표시
              <IconWrapper>
                <img src="/icons/upload.svg" />
                <p>이미지 업로드</p>
              </IconWrapper>
            )}
          </ImageUpload>
        ))}
      </StyledScrollContainer>

      {/* 이미지 드롭 존 (클릭 시에도 파일 선택기 열림) */}
      <ImageDropZone onClick={vm.openPicker} isDragging={false}>
        <img src="/icons/upload.svg" height={30} width={30} />
        <span>추가 이미지 업로드 ({5 - vm.files.length}장 더 가능)</span>
        <p>드래그 하거나 클릭해서 업로드 JPG • PNG</p>
      </ImageDropZone>

      {/* 숨겨진 파일 인풋: vm.inputRef와 vm.onChange를 통해 실제 파일 처리 */}
      <input
        type="file"
        multiple
        accept="image/*"
        ref={vm.inputRef}
        style={{ display: "none" }}
        onChange={vm.onChange}
      />

      {/* 공간 이름 필드 입력 영역 */}
      <Field>
        <Label>공간 이름</Label>
        <Input
          placeholder="공간명을 입력하세요"
          value={form.space.spaceName ?? ""}
          onChange={(e) => vm.handleInputChange("spaceName", e.target.value)}
        />
      </Field>

      {/* 수용 인원 필드 입력 영역 */}
      <Field>
        <Label>수용 인원</Label>
        <Input
          placeholder="수용 인원수를 입력하세요"
          value={vm.capacityInput}
          onChange={(e) => {
            const value = e.target.value;

            vm.handleCapacityChange(value);
          }}
          errorMessage={vm.capacityErrorMessage}
        />
      </Field>

      {/* 지역 선택 영역 */}
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

      {/* 카테고리 선택 영역 */}
      <Field>
        <Label>공간 카테고리</Label>
        <Selectbox2
          options={vm.categories}
          placeholder="카테고리 선택"
          value={String(form.space.categoryId)}
          onChange={(v: string) => vm.handleSelectChange("categoryId", v)}
        />
      </Field>

      {/* 공간 담당자 선택 영역 */}
      <Field>
        <Label>담당자</Label>
        <Selectbox2
          options={vm.managers}
          placeholder="담당자를 선택해주세요"
          value={String(form.space.adminId)}
          onChange={(v: string) => vm.handleSelectChange("adminId", v)}
        />
      </Field>

      {/* 편의시설 선택 영역 */}
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
          // 렌더링 소스를 vm.customChips (제거됨) 대신 form.customTagNames로 변경
          chips={form.customTagNames || []}
          // 삭제 핸들러는 vm에서 가져온 함수를 그대로 사용
          onRemove={vm.removeCustomChip}
        />
      </Field>

      {/* 공간 설명 입력 영역 */}
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

      {/* 공간 예약 과정 입력 영역 */}
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

      {/* 공간 이용 수칙 입력 영역 */}
      <Field>
        <Label>이용 수칙</Label>
        <Textarea
          placeholder="공간에 대한 이용 수칙을 입력해주세요"
          value={form.space.spaceRules}
          onChange={(e) => vm.handleInputChange("spaceRules", e.target.value)}
        />
      </Field>

      {/* 공간 활성화/비활성화 선택 영역 */}
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
