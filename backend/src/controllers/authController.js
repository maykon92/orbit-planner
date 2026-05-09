import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import Tab from "../models/Tab.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, selectedTabs } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      selectedTabs: selectedTabs || ["agenda"],
    });

    const defaultTabs = selectedTabs?.length ? selectedTabs : ["agenda"];

    const tabTemplates = {
      agenda: { name: "Agenda", icon: "calendar" },
      books: { name: "Books", icon: "book" },
      movies: { name: "Movies", icon: "movie" },
      series: { name: "Series", icon: "tv" },
      travel: { name: "Travel", icon: "flight" },
      fitness: { name: "Fitness", icon: "fitness" },
      work: { name: "Work", icon: "work" },
      study: { name: "Study", icon: "school" },
      finance: { name: "Finance", icon: "wallet" },
    };

    const tabsToCreate = defaultTabs.map((type) => ({
      userId: user._id,
      name: tabTemplates[type]?.name || type,
      type,
      icon: tabTemplates[type]?.icon || "folder",
      isPublic: false,
      aiEnabled: true,
    }));

    await Tab.insertMany(tabsToCreate);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      selectedTabs: user.selectedTabs,
      avatar: user.avatar,
      bio: user.bio,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      selectedTabs: user.selectedTabs,
      avatar: user.avatar,
      bio: user.bio,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    selectedTabs: req.user.selectedTabs,
    avatar: req.user.avatar,
    bio: req.user.bio,
    createdAt: req.user.createdAt,
  });
};

export const updateProfile = async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.name = name ?? user.name;
    user.bio = bio ?? user.bio;
    user.avatar = avatar ?? user.avatar;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      bio: updatedUser.bio,
      avatar: updatedUser.avatar,
      selectedTabs: updatedUser.selectedTabs,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};