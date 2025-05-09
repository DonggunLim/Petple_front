import baseInstance from "./axios";

const updateLikes = async (data: { likeStatus: boolean; postId: number }) => {
  try {
    await baseInstance.post(`/posts/${data.postId}/like`, {
      likeStatus: data.likeStatus,
    });
  } catch (error) {
    throw error;
  }
};

export { updateLikes };
