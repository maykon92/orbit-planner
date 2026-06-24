import api from "./api";

export const updateProfile = async (profileData) => {
  const { data } = await api.put("/auth/profile", profileData);
  return data;
};

export const searchProfiles = async (query) => {
  const response = await api.get(`/users/search?q=${query}`);
  return response.data;
};