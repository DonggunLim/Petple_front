import { createContext, useContext, useState, FC, useRef } from "react";
import type { DropdownContextProps, RootProps } from "../types";

const DropdownContext = createContext<DropdownContextProps | null>(null);

export const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error("useDropdownContext should be used within DropdownContext");
  }
  return context;
};

const Root: FC<RootProps> = ({ children }) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };
  const closeDropdown = () => {
    setOpen(false);
  };

  return (
    <DropdownContext.Provider
      value={{ open, closeDropdown, toggleOpen, triggerRef }}
    >
      <div style={{ position: "relative" }}>{children}</div>
    </DropdownContext.Provider>
  );
};

export default Root;
