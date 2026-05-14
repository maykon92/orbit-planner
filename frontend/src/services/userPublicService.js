import api from "./api";

export const getPublicProfile = async (userId) => {
  const { data } = await api.get(`/users/${userId}`);
  return data;
};

export const toggleFollowUser = async (userId) => {
  const { data } = await api.post(`/users/${userId}/follow`);
  return data;
};