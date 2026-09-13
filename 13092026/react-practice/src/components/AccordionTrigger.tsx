import React from "react";
import { useAccordionContext } from "../hook/useAccordionContext";

interface AccordionTriggerProps {
  value: string;
  children: React.ReactNode;
}

function AccordionTrigger({
  value,
  children,
}: AccordionTriggerProps) {
  const { value: active, setValue } =
    useAccordionContext();

  const isOpen = active === value;

  return (
    <button
      type="button"
      className="accordion-trigger"
      onClick={() => setValue(value)}
    >
      <span>{children}</span>

      <span>
        {isOpen ? "−" : "+"}
      </span>
    </button>
  );
}

export default AccordionTrigger;