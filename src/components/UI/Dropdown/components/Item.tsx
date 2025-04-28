import { FC } from "react";
import { useDropdownContext } from "./Root";
import { ItemProps } from "../types";

const Item: FC<ItemProps> = ({ children, className, onClick }) => {
  const { closeDropdown } = useDropdownContext();
  const handleClick = () => {
    closeDropdown();
    onClick?.();
  };
  return (
    <li className={className} onClick={handleClick}>
      {children}
    </li>
  );
};

export default Item;
