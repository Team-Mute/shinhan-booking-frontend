import React, { InputHTMLAttributes } from "react";
import styled from "@emotion/styled";
import colors from "@styles/theme";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder?: string;
  width?: string;
}

const Textarea = ({
  width = "353px",
  placeholder = "내용을 입력해주세요",
  ...props
}: Props) => {
  return (
    <Wrapper>
      <StyledTextarea width={width} placeholder={placeholder} {...props} />
    </Wrapper>
  );
};

export default Textarea;

const height = "5.68rem";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledTextarea = styled.textarea<{ width: string }>`
  width: ${({ width }) => width};
  height: ${height};
  padding-left: 12px;
  background-color: #ffffff;
  border: 1px solid ${colors.graycolor10};
  border-radius: 8px;

  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.00963rem;
  color: ${colors.graycolor100};

  border: 1px solid ${colors.graycolor10};
  padding: 1rem 0.75rem;
  border-radius: 0.5rem;
  min-height: 5.6rem;

  &::placeholder {
    color: #8c8f93;
  }

  &:focus {
    outline: none;
    border-color: #c1c1c1;
  }
`;
