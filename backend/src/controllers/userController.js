import { toggleFollowUser, findPublicUserProfile, searchUsers  } from "../services/userService.js";

export const getPublicProfile = async (req, res) => {
  try {
    const profile = await findPublicUserProfile(req.params.id);

    if (!profile) {
      return res.status(404).json({
        message: "User not found.",
      }); 
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const followUser = async (req, res) => {
  try {
    const result = await toggleFollowUser(req.user._id, req.params.id);

    if (!result) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const searchProfiles = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json([]);
    }

    const users = await searchUsers(q, req.user._id);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};