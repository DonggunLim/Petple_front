import { PostFormData } from "@/types/post.type";
import baseInstance from "./axios";

const getPosts = async (pageParam: number) => {
  try {
    const response = await baseInstance.get(`/posts?page=${pageParam}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getPopularPost = async () => {
  try {
    const response = await baseInstance.get("/posts/popular");
    return response.data.posts;
  } catch (error) {
    throw error;
  }
};

const getPostById = async (id: string) => {
  try {
    const response = await baseInstance.get(`/posts/post/${id}`);
    return response.data.post;
  } catch (error) {
    throw error;
  }
};

const addPost = async (data: {
  tags: Array<string>;
  images: Array<string>;
  description: string;
}) => {
  try {
    await baseInstance.post("/posts/post", data);
  } catch (error) {
    throw error;
  }
};

const updatePostById = async (data: PostFormData) => {
  try {
    await baseInstance.put(`/posts/post/${data.id}`, data);
  } catch (error) {
    throw error;
  }
};

const deletePostById = async (id: string) => {
  try {
    await baseInstance.delete(`/posts/post/${id}`);
  } catch (error) {
    throw error;
  }
};

const getUserPosts = async (nickName: string, page: number) => {
  try {
    const response = await baseInstance.get(`/posts/${nickName}?page=${page}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getLikePosts = async (nickName: string, page: number) => {
  try {
    const response = await baseInstance.get(
      `/posts/like/${nickName}?page=${page}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export {
  addPost,
  getPostById,
  updatePostById,
  deletePostById,
  getPosts,
  getPopularPost,
  getUserPosts,
  getLikePosts,
};
