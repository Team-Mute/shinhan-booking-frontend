import styled from "@emotion/styled";
import colors from "@styles/theme";

interface ButtonProps {
  isActive?: boolean;
  width?: string | number;
  // backColor: 버튼 배경색 (우선 적용)
  backColor?: string;
  // color: 버튼 글씨색 (우선 적용)
  color?: string;
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

  // 1. backColor (배경색) 로직
  background-color: ${({ isActive, backColor }) =>
    // backColor prop이 있으면 해당 색상을 적용
    backColor
      ? backColor
      : // 없으면 isActive 상태에 따라 기본 배경색 적용
      isActive
      ? colors.maincolor
      : colors.graycolor10};

  // 2. color (글씨색) 로직
  color: ${({ isActive, color }) =>
    // color prop이 있으면 해당 색상을 적용
    color
      ? color
      : // 없으면 isActive 상태에 따라 기본 글씨색 적용
      isActive
      ? "white"
      : colors.graycolor100};

  cursor: ${({ isActive }) => (isActive ? "pointer" : "not-allowed")};
  font-size: 14px;
  transition: background-color 0.3s ease;
`;

export default Button;
