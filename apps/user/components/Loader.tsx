"use client";

import React, { ReactNode } from "react";
import styled from "@emotion/styled";
import { FadeLoader } from "react-spinners";
import { useLoaderStore } from "../store/loaderStore";
import colors from "@styles/theme";

interface LoaderProps {
  children: ReactNode;
}

/**
 * Loader 컴포넌트
 * ----------------
 * @description
 * 1. 전역 로딩 상태(useLoaderStore.loading)를 감지
 * 2. 로딩 중이면 FadeLoader 표시
 * 3. 로딩이 끝나면 children을 렌더링
 */
const Loader: React.FC<LoaderProps> = ({ children }) => {
  const { loading } = useLoaderStore();

  return (
    <>
      {children}
      {loading && (
        <Overlay>
          <FadeLoader color={colors.maincolor} />
        </Overlay>
      )}
    </>
  );
};

export default Loader;

// --- styled ---
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
