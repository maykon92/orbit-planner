const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const getImageUrl = (path) => {
  if (!path) return "";

  if (path.startsWith("http")) return path;

  return `${API_BASE_URL}${path}`;
};