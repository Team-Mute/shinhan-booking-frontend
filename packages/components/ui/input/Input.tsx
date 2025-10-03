import React, { InputHTMLAttributes } from "react";
import styled from "@emotion/styled";
import colors from "@styles/theme";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
  infoMessage?: string;
  width?: string;
}

const Input = ({
  errorMessage,
  infoMessage,
  width = "100%",
  ...props
}: Props) => {
  return (
    <Wrapper>
      <StyledInput {...props} width={width} isError={!!errorMessage} />
      {errorMessage && <Text isError={!!errorMessage}>{errorMessage}</Text>}
      {!errorMessage && infoMessage && (
        <Text isError={!!errorMessage}>{infoMessage}</Text>
      )}
    </Wrapper>
  );
};

export default Input;

const height = "2.875rem";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Text = styled.span<{ isError: boolean }>`
  color: ${({ isError }) => (isError ? "#ff4d4f" : colors.graycolor100)};
  font-size: 12px;
  margin-top: 4px;
`;

const StyledInput = styled.input<{ isError: boolean; width: string }>`
  width: ${({ width }) => width};
  height: ${height};
  padding-left: 12px;
  background-color: #ffffff;
  border: 1px solid ${({ isError }) => (isError ? "#ff4d4f" : "#e8e9e9")};
  border-radius: 8px;
  font-size: 14px;
  color: ${colors.graycolor100}

  &::placeholder {
    color: #8c8f93;
  }

  &:focus {
    outline: none;
    border-color: #c1c1c1;
  }
`;
