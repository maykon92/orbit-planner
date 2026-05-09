import Tab from "../models/Tab.js";
import Item from "../models/Item.js";

export const createUserTab = async ({
  userId,
  name,
  type,
  icon,
  isPublic = false,
  aiEnabled = true,
}) => {
  return await Tab.create({
    userId,
    name,
    type,
    icon,
    isPublic,
    aiEnabled,
  });
};

export const findTabsByUser = async (userId) => {
  return await Tab.find({ userId }).sort({ createdAt: -1 });
};

export const findUserTabById = async (tabId, userId) => {
  return await Tab.findOne({
    _id: tabId,
    userId,
  });
};

export const deleteUserTab = async (tabId, userId) => {
  const tab = await findUserTabById(tabId, userId);

  if (!tab) {
    return null;
  }

  await Item.deleteMany({
    tabId,
    userId,
  });

  await tab.deleteOne();

  return tab;
};