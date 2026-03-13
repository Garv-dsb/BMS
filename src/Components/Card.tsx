import React from "react";

// Card Props
interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`p-4 rounded-xl bg-white dark:bg-white/5 backdrop-blur-sm shadow-md dark:shadow-sm border border-gray-100 dark:border-transparent transition-colors duration-200 ${className}`}
    >
      {children}
    </div>
  );
}
