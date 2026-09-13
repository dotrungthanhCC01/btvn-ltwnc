import React from "react";

interface AccordionContextType {
  value: string | null;
  setValue: (v: string | null) => void;
}

export const AccordionContext =
  React.createContext<AccordionContextType | null>(null);
