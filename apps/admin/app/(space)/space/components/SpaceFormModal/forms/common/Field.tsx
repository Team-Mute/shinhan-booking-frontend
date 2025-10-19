import styled from "@emotion/styled";
import colors from "@styles/theme";
import { marginRight } from "../../utils";

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  margin-right: ${marginRight};
`;

export const Label = styled.label`
  color: ${colors.graycolor100};
  font-size: 0.875rem;
  font-weight: 500;
`;
