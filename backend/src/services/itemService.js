import Item from "../models/Item.js";
import Post from "../models/Post.js";

export const createUserItem = async ({
  userId,
  tabId,
  type,
  title,
  description = "",
  status = "active",
  data = {},
  photos = [],
}) => {
  return await Item.create({
    userId,
    tabId,
    type,
    title,
    description,
    status,
    data,
    photos,
  });
};

export const findItemsByTab = async ({
  tabId,
  userId,
  page = 1,
  limit = 10,
  status,
  search,
}) => {
  const skip = (page - 1) * limit;

  const query = {
    tabId,
    userId,
  };

  if (status) {
    query.status = status;
  }

  if (search) {
    query.title = {
      $regex: search,
      $options: "i",
    };
  }

  const items = await Item.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Item.countDocuments(query);

  return {
    items,
    page,
    pages: Math.ceil(total / limit) || 1,
    total,
  };
};

export const findUserItemById = async (itemId, userId) => {
  return await Item.findOne({
    _id: itemId,
    userId,
  });
};

export const deleteUserItem = async (itemId, userId) => {
  const item = await findUserItemById(itemId, userId);

  if (!item) {
    return null;
  }

  await Post.updateMany(
    {
      itemId,
      userId,
    },
    {
      $set: { itemId: null },
    }
  );

  await item.deleteOne();

  return item;
};

export const getUpcomingItems = async (userId) => {
  return await Item.find({
    userId,
  })
    .sort({ createdAt: -1 })
    .limit(5);
};