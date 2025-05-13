import useToast from "@/components/UI/Toast/hooks/useToast";
import userStore from "@/zustand/userStore";
import { FC, PropsWithChildren, useEffect } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute: FC<PropsWithChildren> = ({ children }) => {
  const { user } = userStore();
  const { toast } = useToast();
  useEffect(() => {
    if (!user?.id) {
      toast({ type: "INFO", description: "로그인이 필요합니다." });
    }
  }, [user]);

  return !!user?.id ? children : <Navigate to="/login" replace={true} />;
};

export default ProtectedRoute;
