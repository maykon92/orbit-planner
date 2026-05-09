import { findPublicUserProfile } from "../services/userService.js";

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