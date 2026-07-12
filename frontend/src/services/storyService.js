import api from "./api";

/* ===========================
   Stories
=========================== */

export const getStories = async () => {
  const { data } = await api.get("/stories");
  return data;
};

export const createStory = async (storyData) => {
  const { data } = await api.post("/stories", storyData);
  return data;
};

export const deleteStory = async (storyId) => {
  const { data } = await api.delete(`/stories/${storyId}`);
  return data;
};

export const markStoryAsViewed = async (storyId) => {
  const { data } = await api.put(`/stories/${storyId}/view`);
  return data;
};

/* ===========================
   Likes
=========================== */

export const toggleStoryLike = async (storyId) => {
  const { data } = await api.put(`/stories/${storyId}/like`);
  return data;
};

/* ===========================
   Replies
=========================== */

export const replyToStory = async ({
  storyId,
  message,
}) => {
  const { data } = await api.post(
    `/stories/${storyId}/replies`,
    {
      message,
    }
  );

  return data;
};

export const getStoryReplies = async (storyId) => {
  const { data } = await api.get(
    `/stories/${storyId}/replies`
  );

  return data;
};

export const markStoryRepliesAsRead = async (
  storyId
) => {
  const { data } = await api.put(
    `/stories/${storyId}/replies/read`
  );

  return data;
};