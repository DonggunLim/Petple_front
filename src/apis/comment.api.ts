import baseInstance from "./axios";

const addComment = async (data: {
  postId: number;
  parentId: number | null;
  content: string;
}) => {
  try {
    await baseInstance.post("/comments", data);
  } catch (error) {
    throw error;
  }
};

const deleteComment = async (commentId: number) => {
  try {
    await baseInstance.delete(`/comments/${commentId}`);
  } catch (error) {
    throw error;
  }
};

const updateComment = async (data: { id: number; content: string }) => {
  try {
    await baseInstance.put(`/comments/${data.id}`, {
      content: data.content,
    });
  } catch (error) {
    throw error;
  }
};

export { addComment, deleteComment, updateComment };
