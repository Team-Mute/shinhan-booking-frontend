import React, { useState } from "react";
import styled from "@emotion/styled";
import colors from "@styles/theme";

interface SwitchProps {
  initial?: boolean;
  width?: string;
  height?: string;
  onToggle?: (state: boolean) => void;
}

const Switch = ({
  initial = false,
  width = "3.25rem",
  height = "2rem",
  onToggle,
}: SwitchProps) => {
  const [on, setOn] = useState(initial);

  const handleToggle = () => {
    setOn(!on);
    onToggle?.(!on);
  };

  return (
    <SwitchWrapper
      onClick={handleToggle}
      isOn={on}
      width={width}
      height={height}
    >
      <SwitchCircle isOn={on} />
    </SwitchWrapper>
  );
};

export default Switch;

const SwitchWrapper = styled.div<{
  isOn: boolean;
  width: string;
  height: string;
}>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  border-radius: 4.68rem;
  background-color: ${({ isOn }) =>
    isOn ? colors.maincolor : colors.graycolor10};
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;
`;

const SwitchCircle = styled.div<{ isOn: boolean }>`
  width: 1.5rem;
  height: 1.5rem;
  background-color: #fff;
  border-radius: 50%;
  position: absolute;
  top: 50%; /* wrapper 세로의 절반 위치 */
  transform: translateY(-50%); /* 자기 키의 절반만큼 위로 */
  left: ${({ isOn }) => (isOn ? "calc(100% - 1.8rem)" : "0.2rem")};
  transition: left 0.3s;
`;
