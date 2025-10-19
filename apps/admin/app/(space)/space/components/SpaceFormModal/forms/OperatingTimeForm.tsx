import React, { useState } from "react";
import { SectionHeader } from "./common";
import styled from "@emotion/styled";
import { Operation as OperationType } from "@admin/types/dto/space.dto";
import { DAYS, TIME_OPTIONS } from "@admin/lib/constants/space";
import SelectBox2 from "@components/ui/selectbox/Selectbox2";
import { Switch } from "@components/index";
import { GapBox } from "@admin/components/GapBox";
import CalendarModal from "../../CalendarModal";
import colors from "@styles/theme";

interface OperatingTimeFormProps {
  form: any;
  setForm: (f: any) => void;
}

const OperatingTimeForm: React.FC<OperatingTimeFormProps> = ({
  form,
  setForm,
}) => {
  const [isCalendarOpen, setCalendarOpen] = useState(false);

  const updateDay = (idx: number, patch: Partial<OperationType>) => {
    const next = [...form.space.operations];
    next[idx] = { ...next[idx], ...patch };

    // 시작/종료 시간 검증
    const [startH, startM] = next[idx].from.split(":").map(Number);
    const [endH, endM] = next[idx].to.split(":").map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    // 시작 시간이 종료 시간보다 크면 종료 시간을 자동으로 시작+30분으로 조정
    if (endMinutes <= startMinutes) {
      const newEndH = Math.floor((startMinutes + 30) / 60);
      const newEndM = (startMinutes + 30) % 60;
      next[idx].to = `${String(newEndH).padStart(2, "0")}:${String(
        newEndM
      ).padStart(2, "0")}`;
    }

    setForm({ ...form, space: { ...form.space, operations: next } });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <SectionHeader>운영시간 설정</SectionHeader>

      {form.space.operations.map((op, i) => {
        const [startH, startM] = op.from.split(":").map(Number);
        const startMinutes = startH * 60 + startM;

        const [endH, endM] = op.to.split(":").map(Number);
        const endMinutes = endH * 60 + endM;

        // 시작 시간 옵션: 종료 시간보다 같거나 이후는 disabled
        const startOptions = TIME_OPTIONS.map((t) => {
          const [h, m] = t.value.split(":").map(Number);
          const minutes = h * 60 + m;
          return {
            ...t,
            disabled: minutes >= endMinutes,
          };
        });

        // 종료 시간 옵션: 시작 시간보다 같거나 이전은 disabled
        const endOptions = TIME_OPTIONS.map((t) => {
          const [h, m] = t.value.split(":").map(Number);
          return { ...t, disabled: h * 60 + m <= startMinutes };
        });

        return (
          <Operation key={DAYS[i]}>
            <h5>{DAYS[i]}</h5>

            {op.isOpen ? (
              <TimeBox>
                <SelectBox2
                  options={startOptions}
                  value={op.from}
                  onChange={(v: string) => updateDay(i, { from: v })}
                  width="6.75rem"
                />
                <h4>~</h4>
                <SelectBox2
                  options={endOptions}
                  value={op.to}
                  onChange={(v: string) => updateDay(i, { to: v })}
                  width="6.75rem"
                />
              </TimeBox>
            ) : (
              <TimeBox>
                <span style={{ color: colors.negativecolor, fontWeight: 500 }}>
                  휴무일
                </span>
              </TimeBox>
            )}

            <SwitchWrapper>
              <Switch
                initial={op.isOpen}
                onToggle={(checked: boolean) =>
                  updateDay(i, { isOpen: checked })
                }
              />
            </SwitchWrapper>
            <span>{op.isOpen ? "운영" : "휴무"}</span>
          </Operation>
        );
      })}

      <GapBox h="1.75rem" />

      <SectionHeader>
        <span>휴무일 설정</span>
      </SectionHeader>

      <AddHolidayBtn onClick={() => setCalendarOpen(true)}>
        + 추가하기
      </AddHolidayBtn>
      <GapBox h="2rem" />

      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setCalendarOpen(false)}
        onSelect={(start, end) => {
          // addHoliday(start, end);
        }}
      />
    </div>
  );
};

export default OperatingTimeForm;

// --- styled ---
export const Operation = styled.div`
  display: flex;
  align-items: center;
  height: 2.875rem;
  width: 100%;
  margin-bottom: 0.5rem;

  h4 {
    padding: 0 0.59rem;
  }
  h5 {
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 2.875rem;
    letter-spacing: -0.00963rem;
    margin-right: 1rem;
  }
  span {
    padding: 0 0.59rem;
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 2.875rem;
    letter-spacing: -0.00825rem;
  }
`;

export const TimeBox = styled.div`
  width: 15.5rem; // SelectBox2와 동일한 너비
  display: flex;
  align-items: center;
  // justify-content: center;
`;

export const SwitchWrapper = styled.div`
  margin-left: 0.5rem;
`;

export const AutomaticHoliday = styled.button`
  border-radius: 0.25rem;
  border: 1px solid ${colors.graycolor10};
  padding: 0.38rem 0.5rem;
  color: ${colors.graycolor100};
  font-size: 0.625rem;
  font-weight: 600;
  cursor: pointer;
`;

export const AddHolidayBtn = styled.button`
  color: ${colors.maincolor};
  gap: 0.5rem;
  cursor: pointer;
  display: flex;

  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.5rem; /* 171.429% */
  letter-spacing: -0.00963rem;
`;
