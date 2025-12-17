import React from "react";

interface FormSectionHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export const FormSectionHeading: React.FC<FormSectionHeadingProps> = ({
  children,
  className = "",
}) => {
  return <h2 className={`card-title mb-4 ${className}`}>{children}</h2>;
};
