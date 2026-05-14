import User from "../models/User.js";
import Post from "../models/Post.js";

export const findPublicUserProfile = async (userId) => {
  const user = await User.findById(userId).select(
    "name avatar bio followers following createdAt"
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
      followersCount: user.followers.length,
      followingCount: user.following.length,
    },
  };
};

export const toggleFollowUser = async (currentUserId, targetUserId) => {
  if (currentUserId.toString() === targetUserId.toString()) {
    throw new Error("You cannot follow yourself.");
  }

  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);

  if (!targetUser) {
    return null;
  }

  const alreadyFollowing = currentUser.following.some(
    (id) => id.toString() === targetUserId.toString()
  );

  if (alreadyFollowing) {
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetUserId.toString()
    );

    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUserId.toString()
    );
  } else {
    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);
  }

  await currentUser.save();
  await targetUser.save();

  return {
    following: !alreadyFollowing,
    followersCount: targetUser.followers.length,
    followingCount: targetUser.following.length,
  };
};