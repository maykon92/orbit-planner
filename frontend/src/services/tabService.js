import api from "./api";

export const getTabs = async () => {
  const { data } = await api.get("/tabs");
  return data;
};

export const createTab = async (tabData) => {
  const { data } = await api.post("/tabs", tabData);
  return data;
};

export const updateTab = async (tabId, tabData) => {
  const { data } = await api.put(`/tabs/${tabId}`, tabData);
  return data;
};

export const deleteTab = async (tabId) => {
  const { data } = await api.delete(`/tabs/${tabId}`);
  return data;
};