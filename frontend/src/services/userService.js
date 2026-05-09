import api from "./api";

export const updateProfile = async (profileData) => {
  const { data } = await api.put("/auth/profile", profileData);
  return data;
};