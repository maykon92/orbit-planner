import {
  createUserTab,
  findTabsByUser,
  findUserTabById,
  deleteUserTab,
} from "../services/tabService.js";

export const createTab = async (req, res) => {
  try {
    const { name, type, icon, isPublic, aiEnabled } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: "Name and type are required." });
    }

    const tab = await createUserTab({
      userId: req.user._id,
      name,
      type,
      icon,
      isPublic,
      aiEnabled,
    });

    res.status(201).json(tab);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTabs = async (req, res) => {
  try {
    const tabs = await findTabsByUser(req.user._id);

    res.json(tabs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTabById = async (req, res) => {
  try {
    const tab = await findUserTabById(req.params.id, req.user._id);

    if (!tab) {
      return res.status(404).json({ message: "Tab not found." });
    }

    res.json(tab);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTab = async (req, res) => {
  try {
    const tab = await findUserTabById(req.params.id, req.user._id);

    if (!tab) {
      return res.status(404).json({ message: "Tab not found." });
    }

    tab.name = req.body.name ?? tab.name;
    tab.icon = req.body.icon ?? tab.icon;
    tab.isPublic = req.body.isPublic ?? tab.isPublic;
    tab.aiEnabled = req.body.aiEnabled ?? tab.aiEnabled;

    const updatedTab = await tab.save();

    res.json(updatedTab);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTab = async (req, res) => {
  try {
    const deletedTab = await deleteUserTab(req.params.id, req.user._id);

    if (!deletedTab) {
      return res.status(404).json({ message: "Tab not found." });
    }

    res.json({
      message: "Tab and related items deleted successfully.",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};