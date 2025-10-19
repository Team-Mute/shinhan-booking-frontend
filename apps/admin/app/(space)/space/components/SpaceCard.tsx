"use client";

import styled from "@emotion/styled";
import colors from "@styles/theme";

interface SpaceCardProps {
  imageUrl: string;
  title: string;
  region: string;
  manager: string;
  isPrivate?: boolean; // 비공개 여부
  onEdit?: () => void; // 수정
  onDelete?: () => void; // 삭제
}

const SpaceCard = ({
  imageUrl,
  title,
  region,
  manager,
  isPrivate,
  onEdit,
  onDelete,
}: SpaceCardProps) => {
  return (
    <Container>
      {/* 1. 사진 */}
      <ImageWrapper>
        <CardImage src={imageUrl} alt={title} />
        {isPrivate && <OverlayText>비공개 중입니다</OverlayText>}
      </ImageWrapper>
      <ContentsWrapper>
        {/* 2. 공간명 */}
        <Title>{title}</Title>

        {/* 3. 지역 */}
        <Region>
          <img src="/icons/region.svg" />
          <span>{region}</span>
        </Region>

        {/* 4. 담당자 */}
        <Manager>담당자: {manager}</Manager>
      </ContentsWrapper>

      {/* 5. 버튼 */}
      <ButtonGroup>
        <ActionButton flex={3} bg={colors.maincolor5} onClick={onEdit}>
          수정하기
        </ActionButton>

        <ActionButton
          flex={1}
          bg={colors.graycolor5}
          text={colors.graycolor100}
          onClick={onDelete}
        >
          삭제
        </ActionButton>
      </ButtonGroup>
    </Container>
  );
};

export default SpaceCard;

// --- styled ---
const Container = styled.div`
  width: 22rem;
  height: 19.125rem;
  background-color: white;
  display: flex;
  flex-direction: column;
  border-radius: 0.75rem;
  overflow: hidden;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 10rem;
  background-color: #f0f0f0;
`;

const ContentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 0.2rem;
  height: 6.125rem;
  border-left: 1px solid ${colors.graycolor10};
  border-right: 1px solid ${colors.graycolor10};
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const OverlayText = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  font-size: 1rem;
  font-weight: 400;
`;

const DraftBadge = styled.div`
  position: absolute;
  top: 0.61rem;
  right: 0.81rem;
  background: ${colors.sementicFillStrong}66;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 1.25rem;
  font-size: 0.75rem;
  font-weight: 600;
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 600;
`;

const Region = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #555;
  font-size: 0.875rem;
`;

const Manager = styled.div`
  font-size: 0.875rem;
  color: #333;
`;

const ButtonGroup = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: space-around;
  //   padding: 0.75rem 1rem;
  //   background-color: yellow;
  border-top: 1px solid #eee;
  height: 3rem;
`;

const ActionButton = styled.button<{
  flex?: number;
  bg?: string;
  text?: string;
  borderLeft?: boolean;
}>`
  flex: ${({ flex }) => flex || 1};
  background: ${({ bg }) => bg || "transparent"};
  border: none;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  color: ${({ text }) => text || colors.maincolor};
  position: relative;

  ${({ borderLeft }) =>
    borderLeft &&
    `
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 20%;
      bottom: 20%;
      width: 1px;
      background-color: #ddd;
    }
  `}
`;
