import baseInstance from "./axios";

const fetchGoolgeCallback = async (code: string) => {
  try {
    const response = await baseInstance.get(
      `oauth/google/callback?code=${code}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const signinWithGuest = async () => {
  try {
    const response = await baseInstance.get("my/guest-signin");
    return response;
  } catch (error) {
    throw error;
  }
};

export { fetchGoolgeCallback, signinWithGuest };
