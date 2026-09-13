import React from "react";

interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
}

function AccordionItem({
  value,
  children,
}: AccordionItemProps) {
  return (
    <div className="accordion-item" data-value={value}>
      {children}
    </div>
  );
}

export default AccordionItem;