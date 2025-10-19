import React from "react";
import styled from "@emotion/styled";
import Chip from "./Chip";

interface ChipGroupProps {
  options: string[];
  selected: string[];
  onToggle: (chip: string) => void;
  columns?: number;
}

const ChipGroup: React.FC<ChipGroupProps> = ({
  options,
  selected,
  onToggle,
  columns = 4,
}) => {
  return (
    <Grid columns={columns}>
      {options.map((chip) => {
        const isSelected = selected.includes(chip);
        return (
          <Chip
            key={chip}
            data-selected={isSelected}
            onClick={() => onToggle(chip)}
          >
            {chip}
          </Chip>
        );
      })}
    </Grid>
  );
};

export default ChipGroup;

// --- styled ---
const Grid = styled.div<{ columns: number }>`
  display: grid;
  grid-template-columns: repeat(${(p) => p.columns}, 1fr);
  gap: 0.5rem;
`;
