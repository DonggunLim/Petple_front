import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Routes } from "./components";
import { ToastContainer } from "./components/UI/Toast/components";
import { HelmetProvider } from "react-helmet-async";
import { Analytics } from "@vercel/analytics/react";

export const queryClient = new QueryClient();

const App = () => {
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
