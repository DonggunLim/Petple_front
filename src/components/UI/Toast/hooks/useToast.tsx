import { useRef } from "react";
import { ToastType } from "../types";
import { useToastStore } from "@/zustand/toastStore";

const useToast = () => {
  const { addToast, removeToast } = useToastStore();
  const timerId = useRef<number>(0);

  const toast = ({
    title,
    description,
    type,
    position,
    time = 3000,
  }: ToastType) => {
    if (timerId.current) clearTimeout(timerId.current);
    addToast({ title, description, type, position });
    timerId.current = window.setTimeout(() => {
      removeToast();
    }, time);
  };

  return { toast, removeToast };
};

export default useToast;
