/** @jsxImportSource @emotion/react */
"use client";

import styled from "@emotion/styled";
import { GoPlus } from "react-icons/go";
import colors from "@styles/theme";

interface IconButtonProps {
  label: string; // 버튼에 표시할 텍스트
  bgcolor?: string; // 버튼 배경색
  color?: string; // 버튼 글자 색
  disabled?: boolean;
  width?: string;
  onClick?: () => void;
}

export default function IconButton({
  label,
  bgcolor = colors.maincolor,
  color = "white",
  disabled = false,
  width = "100%",

  onClick,
}: IconButtonProps) {
  return (
    <ButtonWrapper
      onClick={onClick}
      bgcolor={bgcolor}
      color={color}
      disabled={disabled}
      width={width}
    >
      <GoPlus size={16} />
      <span>{label}</span>
    </ButtonWrapper>
  );
}

const ButtonWrapper = styled.button<{
  bgcolor: string;
  color: string;
  disabled: boolean;
  width: string;
}>`
  width: ${(props) => props.width};
  display: flex;
  align-items: center;
  gap: 0.3rem; /* 아이콘과 텍스트 간격 */
  padding: 0.5rem 0.75rem;
  height: 100%;
  background-color: ${(props) => props.bgcolor};
  border: none;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(props) => props.color};
  cursor: pointer;
  disabled: ${(props) => props.disabled};
`;
