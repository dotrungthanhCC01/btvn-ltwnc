import React from "react";
import { useAccordionContext } from "../hook/useAccordionContext";

interface AccordionContentProps {
  value: string;
  children: React.ReactNode;
}

function AccordionContent({ value, children }: AccordionContentProps) {
  const { value: active } = useAccordionContext();

  const isOpen = active === value;

  if (!isOpen) {
    return null;
  }

  return <div className="accordion-content">{children}</div>;
}

export default AccordionContent;
