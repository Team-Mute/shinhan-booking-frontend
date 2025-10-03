"use client";

import React from "react";
import styled from "@emotion/styled";
import { FadeLoader } from "react-spinners";
import colors from "@styles/theme";

interface LoadingProps {
  isLoading: boolean;
}

const Loading: React.FC<LoadingProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <Overlay>
      <FadeLoader color={colors.maincolor} />
    </Overlay>
  );
};

export default Loading;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;
