import React from "react";
import { FormSectionHeading } from "./FormSectionHeading";

interface FormSectionProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  children,
  title,
  className = "",
}) => {
  return (
    <div className={`card bg-base-100 shadow-sm ${className}`}>
      <div className="card-body">
        {title && <FormSectionHeading>{title}</FormSectionHeading>}
        {children}
      </div>
    </div>
  );
};
