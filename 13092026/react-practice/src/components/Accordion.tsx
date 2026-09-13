import React from "react";

import { AccordionContext } from "../stores/AccordionContext";

import AccordionItem from "./AccordionItem";
import AccordionTrigger from "./AccordionTrigger";
import AccordionContent from "./AccordionContent";

interface AccordionProps {
  defaultValue?: string | null;
  children: React.ReactNode;
}

function AccordionRoot({
  defaultValue = null,
  children,
}: AccordionProps) {
  const [value, setValue] =
    React.useState<string | null>(defaultValue);

  return (
    <AccordionContext.Provider
      value={{
        value,
        setValue,
      }}
    >
      <div className="accordion">
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

const Accordion = Object.assign(
  AccordionRoot,
  {
    Item: AccordionItem,
    Trigger: AccordionTrigger,
    Content: AccordionContent,
  }
);

export default Accordion;