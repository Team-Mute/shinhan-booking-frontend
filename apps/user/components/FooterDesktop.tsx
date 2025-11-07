"user client";

import styled from "@emotion/styled";
import Logo from "@user/svg-icons/shinhanLogo.svg";
import colors from "@styles/theme";
import { media } from "@styles/breakpoints";

/**
 * FooterDesktop 컴포넌트
 * ----------------------
 * 데스크탑 화면에서만 보이는 하단 푸터 컴포넌트.
 *
 * @remarks
 * - 주소, 연락처(이메일, 사업자등록번호) 정보 및 저작권 표시 포함.
 * - 모바일 화면에서는 media 쿼리를 통해 숨김 처리됨.
 */
const FooterDesktop = () => {
  return (
    <Container>
      <ContentsWrapper>
        {/* 신한 로고 */}
        <StyledLogo />
        <InfoWrapper>
          {/* 주소 정보 */}
          <AddressWrapper>
            <span>서울특별시 중구 명동10길 52 신한익스페이스</span>
            <span>서울특별시 중구 세종대로 9길 20(태평로 2가)</span>
          </AddressWrapper>

          {/* 연락처 및 사업자 정보 */}
          <ContactWrapper>
            <span>E-mail: shdf@shinhan.com</span>
            <span>사업자등록번호:202-82-05586</span>
          </ContactWrapper>
        </InfoWrapper>
      </ContentsWrapper>
      {/* 저작권 정보 */}
      <Copyright>
        <span>© 2020 Shinhan Financial Group Hope Foundation.</span>
      </Copyright>
    </Container>
  );
};

export default FooterDesktop;

// --- styled ---
const Container = styled.div`
  display: none;
  /* 모바일 이상에서만 보임 */
  ${media.mobileUp} {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
`;
const ContentsWrapper = styled.div`
  display: flex;
  gap: 0.6rem;
  padding: 1.5rem 10rem;
  width: 100%;
  margin-top: 3rem;
`;

const StyledLogo = styled(Logo)`
  color: black;
  width: 11rem;
  height: 1.5rem;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const AddressWrapper = styled.div`
  display: flex;
  flex-direction: column;

  font-size: 0.875rem;
  font-style: normal;
  font-weight: 600;
  line-height: 145%; /* 1.26875rem */
  letter-spacing: -0.00438rem;
`;

const ContactWrapper = styled.div`
  margin-top: 1.5rem;

  display: flex;
  gap: 0.75rem;

  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: 145%; /* 1.26875rem */
  letter-spacing: -0.00438rem;

  color: ${colors.graycolor50};
`;

const Copyright = styled.div`
  display: flex;
  justify-content: center;
  height: 3.75rem;
  padding: 1.38rem 3.75rem;

  font-size: 0.6875rem;
  font-style: normal;
  font-weight: 500;
  line-height: 145%; /* 0.99688rem */
  letter-spacing: -0.00344rem;

  color: ${colors.graycolor50};
`;
