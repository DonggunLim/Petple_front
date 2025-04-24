import { FC, useEffect, useRef } from "react";
import { ContentProps } from "../types";
import { useDropdownContext } from "./Root";

const Content: FC<ContentProps> = ({ children, className }) => {
  const dropdownContentRef = useRef<HTMLUListElement>(null);
  const { open, triggerRef, closeDropdown } = useDropdownContext();

  const handleClickOutside = (e: MouseEvent) => {
    if (triggerRef.current?.contains(e.target as Node)) {
      return;
    }
    if (
      dropdownContentRef.current &&
      !dropdownContentRef.current.contains(e.target as Node)
    ) {
      closeDropdown();
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    open && (
      <ul ref={dropdownContentRef} className={className}>
        {children}
      </ul>
    )
  );
};

export default Content;
