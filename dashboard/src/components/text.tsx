import { FC, ReactNode } from "react";

interface TextProps {
  children: ReactNode;
  className?: string;
}

const Text: FC<TextProps> = ({ children, className = "" }) => {
  return <p className={`dark:text-white ${className}`}>{children}</p>;
};

export default Text;
