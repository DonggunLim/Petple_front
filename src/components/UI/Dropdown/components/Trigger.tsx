import { FC } from "react";
import { TriggerProps } from "../types";
import { useDropdownContext } from "./Root";

const Trigger: FC<TriggerProps> = ({ children, className }) => {
  const { toggleOpen, triggerRef } = useDropdownContext();

  return (
    <button ref={triggerRef} onClick={toggleOpen} className={className}>
      {children}
    </button>
  );
};

export default Trigger;
