import React from "react";
import styled from "@emotion/styled";
import colors from "@styles/theme";
import { marginRight } from "../utils";

interface TabItem {
  key: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  activeKey: string;
  onChange: (key: string) => void;
  items: TabItem[];
  right?: React.ReactNode;
}

const Tabs: React.FC<TabsProps> = ({ activeKey, onChange, items, right }) => {
  return (
    <Wrap>
      <Bar>
        <ul>
          {items.map((it) => (
            <li key={it.key}>
              <TabButton
                data-active={activeKey === it.key}
                onClick={() => onChange(it.key)}
              >
                {it.label}
              </TabButton>
            </li>
          ))}
        </ul>
        {right}
      </Bar>
      <Content>
        {items.find((it) => it.key === activeKey)?.content ?? null}
      </Content>
    </Wrap>
  );
};

export default Tabs;

// --- styled ---
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const Bar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px solid ${colors.graycolor20};
  ul {
    display: flex;
    list-style: none;
    gap: 1rem;
  }
  margin-right: ${marginRight};
`;

const TabButton = styled.button`
  line-height: 2.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: ${colors.graycolor50};
  border-bottom: 1.5px solid transparent;
  &[data-active="true"] {
    color: ${colors.graycolor100};
    border-color: ${colors.graycolor100};
  }
`;

const Content = styled.div`
  flex: 1;
  padding-top: 1.47rem;
`;
