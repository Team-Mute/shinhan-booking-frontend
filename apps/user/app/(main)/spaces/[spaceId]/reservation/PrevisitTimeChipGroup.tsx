// src/components/common/chip/PrevisitTimeChipGroup.tsx

import React from "react";
import styled from "@emotion/styled";
import colors from "@styles/theme";

interface PrevisitChipGroupProps {
  options: string[];
  selected: string;
  onToggle: (chip: string) => void;
  columns?: number;
}

const PrevisitTimeChipGroup: React.FC<PrevisitChipGroupProps> = ({
  options,
  selected,
  onToggle,
  columns = 4,
}) => {
  const handleClick = (chip: string) => {
    onToggle(chip);
  };

  return (
    <Grid columns={columns}>
      {options.map((chip) => {
        const isSelected = selected === chip;
        return (
          <Chip
            key={chip}
            data-selected={isSelected}
            onClick={() => handleClick(chip)}
          >
            {chip}
          </Chip>
        );
      })}
    </Grid>
  );
};

export default PrevisitTimeChipGroup;

const Grid = styled.div<{ columns: number }>`
  display: grid;
  grid-template-columns: repeat(${(p) => p.columns}, 1fr);
  gap: 0.5rem;
`;

const Chip = styled.button`
  width: 5.14rem;
  border-radius: 0.5rem;
  border: 1px solid ${colors.graycolor10};
  line-height: 2.875rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${colors.graycolor50};
  &[data-selected="true"] {
    border-color: ${colors.maincolor};
    background-color: ${colors.maincolor5};
    color: ${colors.maincolor};
  }
`;
