import styled from "@emotion/styled";
import colors from "@styles/theme";

interface ButtonProps {
  isActive?: boolean;
  width?: string | number;
}

const Button = styled.button<ButtonProps>`
  width: ${({ width }) =>
    width !== undefined
      ? typeof width === "number"
        ? `${width}px`
        : width
      : "353px"};
  height: 46px;
  border-radius: 8px;
  border: none;
  background-color: ${({ isActive }) =>
    isActive ? colors.maincolor : colors.graycolor10};
  color: ${({ isActive }) => (isActive ? "white" : colors.graycolor100)};
  cursor: ${({ isActive }) => (isActive ? "pointer" : "not-allowed")};
  font-size: 14px;
  transition: background-color 0.3s ease;
`;

export default Button;
