import styled from "@emotion/styled";
import colors from "@styles/theme";

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

export default Chip;
