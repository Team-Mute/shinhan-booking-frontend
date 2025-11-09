"use client";
import React from "react";
import styled from "@emotion/styled";
import MySideBar from "../components/sideBar";

export default function MyPageUserInfo() {
  return (
    <Container>
      <MySideBar />
      <Wrapper>
        <Title>
          회원정보 페이지
          <br />
          공사중 입니다.
        </Title>
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  padding-right: 81px;
  font-family: "Pretendard", sans-serif;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    padding: 20px;
    box-sizing: border-box;
    gap: 16px;
    z-index: 100;
  }
`;

const Title = styled.h1`
  font-weight: 600;
  font-size: 60px;
  color: #191f28;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;
