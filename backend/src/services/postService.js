import Post from "../models/Post.js";

export const createUserPost = async ({
  userId,
  itemId = null,
  caption,
  visibility = "private",
  photos = [],
}) => {
  return await Post.create({
    userId,
    itemId,
    caption,
    visibility,
    photos,
  });
};

export const findMyPosts = async (userId) => {
  return await Post.find({ userId })
    .populate("userId", "name email avatar")
    .populate("itemId", "title type")
    .populate("comments.userId", "name avatar")
    .sort({ createdAt: -1 });
};

export const findPublicPosts = async ({ page = 1, limit = 10, type }) => {
  const skip = (page - 1) * limit;

  let query = { visibility: "public" };

  let postsQuery = Post.find(query)
    .populate("userId", "name email avatar")
    .populate("itemId", "title type")
    .populate("comments.userId", "name avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const posts = await postsQuery;

  const filteredPosts = type
    ? posts.filter((post) => post.itemId?.type === type)
    : posts;

  const total = filteredPosts.length;

  return {
    posts: filteredPosts,
    page,
    pages: Math.ceil(total / limit) || 1,
    total,
  };
};

export const findUserPostById = async (postId, userId) => {
  return await Post.findOne({
    _id: postId,
    userId,
  });
};

export const findPostById = async (postId) => {
  return await Post.findById(postId)
    .populate("userId", "name email avatar")
    .populate("itemId", "title type")
    .populate("comments.userId", "name avatar");
};

export const deleteUserPost = async (postId, userId) => {
  const post = await findUserPostById(postId, userId);

  if (!post) {
    return null;
  }

  await post.deleteOne();

  return post;
};