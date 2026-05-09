import Tab from "../models/Tab.js";

import {
  createUserItem,
  findItemsByTab,
  findUserItemById,
  deleteUserItem,
} from "../services/itemService.js";

export const createItem = async (req, res) => {
  try {
    const { tabId, title, description, status, data, photos } = req.body;

    if (!tabId || !title) {
      return res.status(400).json({ message: "Tab ID and title are required." });
    }

    const tab = await Tab.findOne({
      _id: tabId,
      userId: req.user._id,
    });

    if (!tab) {
      return res.status(404).json({ message: "Tab not found." });
    }

    const item = await createUserItem({
      userId: req.user._id,
      tabId,
      type: tab.type,
      title,
      description,
      status,
      data,
      photos,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getItemsByTab = async (req, res) => {
  try {
    const { tabId } = req.params;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const { status, search } = req.query;

    const tab = await Tab.findOne({
      _id: tabId,
      userId: req.user._id,
    });

    if (!tab) {
      return res.status(404).json({ message: "Tab not found." });
    }

    const result = await findItemsByTab({
      tabId,
      userId: req.user._id,
      page,
      limit,
      status,
      search,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = await findUserItemById(req.params.id, req.user._id);

    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const item = await findUserItemById(req.params.id, req.user._id);

    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    item.title = req.body.title ?? item.title;
    item.description = req.body.description ?? item.description;
    item.status = req.body.status ?? item.status;
    item.data = req.body.data ?? item.data;
    item.photos = req.body.photos ?? item.photos;

    const updatedItem = await item.save();

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const deletedItem = await deleteUserItem(req.params.id, req.user._id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found." });
    }

    res.json({
      message: "Item deleted successfully. Related posts were kept without item reference.",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};