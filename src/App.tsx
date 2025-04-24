import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Routes } from "./components";
import { ToastContainer } from "./components/UI/Toast/components";
import { HelmetProvider } from "react-helmet-async";
import { Analytics } from "@vercel/analytics/react";
import { useEffect } from "react";
import { useAlarmStore } from "./zustand/alarmStore";
import userAuthStore from "./zustand/userAuth";

export const queryClient = new QueryClient();

const App = () => {
  const user = userAuthStore();
  const { addAlarm } = useAlarmStore();

  useEffect(() => {
    if (!user.userId) {
      return;
    }
    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_BASE_URL}/api/alarms/connect`,
      { withCredentials: true }
    );

    eventSource.onmessage = (event) => {
      const alarm = JSON.parse(event.data);
      addAlarm([alarm]);
    };

    return () => {
      eventSource.close();
    };
  }, [user.userId]);
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Routes />
      </HelmetProvider>
      <ToastContainer />
      {import.meta.env.MODE === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
      <Analytics />
    </QueryClientProvider>
  );
};

export default App;
