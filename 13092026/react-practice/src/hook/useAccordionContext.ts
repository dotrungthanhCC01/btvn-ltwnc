import { useContext } from "react";
import { AccordionContext } from "../stores/AccordionContext";

export function useAccordionContext() {
  const context = useContext(AccordionContext);

  if (!context) {
    throw new Error(
      "useAccordionContext must be used within a ContextProvider",
    );
  }

  return context;
}
