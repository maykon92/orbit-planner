import api from "./api";

export const getPublicFeed = async () => {
  const { data } = await api.get("/posts/feed");
  return data.posts || data;
};

export const getMyPosts = async () => {
  const { data } = await api.get("/posts/my-posts");
  return data;
};

export const createPost = async (postData) => {
  const { data } = await api.post("/posts", postData);
  return data;
};

export const likePost = async (postId) => {
  const { data } = await api.post(`/posts/${postId}/like`);
  return data;
};

export const addComment = async (postId, text) => {
  const { data } = await api.post(`/posts/${postId}/comments`, { text });
  return data;
};

export const updatePost = async (postId, postData) => {
  const { data } = await api.put(`/posts/${postId}`, postData);
  return data;
};

export const deletePost = async (postId) => {
  const { data } = await api.delete(`/posts/${postId}`);
  return data;
};