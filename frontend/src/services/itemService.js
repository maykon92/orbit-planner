import api from "./api";

export const deleteItem = async (itemId) => {
  const { data } = await api.delete(`/items/${itemId}`);
  return data;
};

export const updateItem = async (itemId, itemData) => {
  const { data } = await api.put(`/items/${itemId}`, itemData);
  return data;
};