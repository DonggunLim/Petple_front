import { PropsWithChildren } from "react";

export type DropdownContextProps = {
  open: boolean;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  closeDropdown: () => void;
  toggleOpen: () => void;
};

interface BaseProps extends PropsWithChildren {
  className?: string;
}
export interface RootProps extends BaseProps {}
export interface TriggerProps extends BaseProps {}
export interface ContentProps extends BaseProps {}
export interface ItemProps extends BaseProps {
  onClick?: () => void;
}
