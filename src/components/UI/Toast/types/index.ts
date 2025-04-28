import { PropsWithChildren, ReactNode } from "react";

interface BaseProps extends PropsWithChildren {}
export type ToastAlertType = "INFO" | "SUCCESS" | "ERROR" | "NONE";
export type ToastPositionType =
  | "top-right"
  | "bottom-right"
  | "bottom-left"
  | "top-left"
  | "top-middle";
export type ToastType = {
  title?: string;
  description: string | ReactNode;
  type?: ToastAlertType;
  position?: ToastPositionType;
  time?: number;
};

/* Toast Context */
export interface ToastContextProps {}

/* Root component */
export interface RootProps extends BaseProps {
  position?: ToastPositionType;
}

/* Title component */
export interface TitleProps extends BaseProps {}

/* Description component */
export interface DescriptionProps extends BaseProps {
  type?: ToastAlertType;
}

/* Action component */
export interface ActionProps extends BaseProps {}

/* useToast */
export interface UseToastProps {}
