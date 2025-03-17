export const config = {
  app: {
    backendUrl:
      import.meta.env.MODE === "development"
        ? "http://localhost:3000"
        : import.meta.env.VITE_API_BASE_URL,
  },
};
