import User from "../models/User.js";
import Post from "../models/Post.js";

export const findPublicUserProfile = async (userId) => {
  const user = await User.findById(userId).select(
    "name avatar bio createdAt"
  );

  if (!user) {
    return null;
  }

  const posts = await Post.find({
    userId,
    visibility: "public",
  })
    .populate("itemId", "title type")
    .sort({ createdAt: -1 });

  const totalLikes = posts.reduce(
    (acc, post) => acc + post.likes.length,
    0
  );

  return {
    user,
    posts,
    stats: {
      totalPosts: posts.length,
      totalLikes,
    },
  };
};