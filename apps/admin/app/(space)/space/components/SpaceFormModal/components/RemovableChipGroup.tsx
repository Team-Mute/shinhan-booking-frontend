import React from "react";
import styled from "@emotion/styled";
import colors from "@styles/theme";
import { IoClose } from "react-icons/io5";

interface RemovableChipGroupProps {
  chips: string[];
  onRemove: (chip: string) => void;
}

const RemovableChipGroup: React.FC<RemovableChipGroupProps> = ({
  chips,
  onRemove,
}) => {
  return (
    <ChipWrapper>
      {chips.map((chip) => (
        <Chip key={chip}>
          <span>{chip}</span>
          <RemoveButton onClick={() => onRemove(chip)}>
            <IoClose />
          </RemoveButton>
        </Chip>
      ))}
    </ChipWrapper>
  );
};

export default RemovableChipGroup;

// --- styled ---
const ChipWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Chip = styled.div`
  display: inline-flex;
  align-items: center;
  border-radius: 0.5rem;
  border: 1px solid ${colors.graycolor10};
  padding: 1rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${colors.graycolor50};
  background: white;
  gap: 0.5rem;
`;

const RemoveButton = styled.button`
  width: 0.875rem;
  height: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: none;
  background: ${colors.maincolor};
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  cursor: pointer;
`;
