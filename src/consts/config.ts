export const config = {
  app: {
    backendUrl:
      import.meta.env.MODE === "development"
        ? "http://localhost:3000"
        : "http://34.47.125.88/socket-chat",
  },
};
