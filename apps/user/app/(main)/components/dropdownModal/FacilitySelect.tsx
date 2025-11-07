import React from "react";
import styled from "@emotion/styled";
import CircleCheckbox from "@components/ui/Checkbox";

interface FacilityTag {
  tagId: number;
  tagName: string;
}

/**
 * FacilitySelect 컴포넌트
 * ------------------------
 * 편의시설 선택 드롭다운 모달에 사용되는 체크박스 목록 컴포넌트.
 *
 * @property {FacilityTag[]} facilities 전체 편의시설 목록.
 * @property {string[]} selectedFacilities 현재 선택된 편의시설 이름 목록.
 * @property {React.Dispatch<React.SetStateAction<string[]>>} setSelectedFacilities 선택 상태 변경 함수.
 */
const FacilitySelect: React.FC<{
  facilities: FacilityTag[];
  selectedFacilities: string[];
  setSelectedFacilities: React.Dispatch<React.SetStateAction<string[]>>;
}> = ({ facilities, selectedFacilities, setSelectedFacilities }) => {
  /**
   * @description 특정 편의시설의 선택 상태 토글.
   */
  const toggleFacility = (tagName: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(tagName)
        ? prev.filter((f) => f !== tagName)
        : [...prev, tagName]
    );
  };

  return (
    <GridWrapper>
      {facilities.map((f) => (
        <CircleCheckbox
          key={f.tagId}
          label={f.tagName}
          checked={selectedFacilities.includes(f.tagName)}
          onChange={() => toggleFacility(f.tagName)}
        />
      ))}
    </GridWrapper>
  );
};

export default FacilitySelect;

// --- styled ---
const GridWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr; /* 2열 */
  column-gap: 1.5rem; /* 가로 간격 */
  row-gap: 1rem; /* 세로 간격 */
`;
