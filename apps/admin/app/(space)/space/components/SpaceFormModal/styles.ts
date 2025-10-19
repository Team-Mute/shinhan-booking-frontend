import styled from "@emotion/styled";
import colors from "@styles/theme";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContainer = styled.div`
  width: 29.375rem;
  max-width: 700px;
  height: 34.9rem;
  background: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  padding: 1.5rem 3.66rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

export const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  padding-left: 3.56rem;
`;

export const DeleteIconWrapper = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  border-radius: 0.75rem;
  color: white;
  background-color: ${colors.maincolor};
`;

export const Footer = styled.div`
  height: 5.875rem;
  padding: 0 3.7rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;
