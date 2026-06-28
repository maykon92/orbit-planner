import FinanceWorkspace from "../models/FinanceWorkspace.js";

export const getWorkspaceDetails = async (workspaceId, userId) => {
  const workspace = await FinanceWorkspace.findOne({
    _id: workspaceId,
    members: {
      $elemMatch: {
        userId,
        status: "active",
      },
    },
  })
    .populate("ownerId", "name avatar email")
    .populate("members.userId", "name avatar email");

  if (!workspace) {
    throw new Error("Workspace not found or access denied.");
  }

  return {
    _id: workspace._id,
    name: workspace.name,
    type: workspace.type,
    createdAt: workspace.createdAt,
    owner: {
      _id: workspace.ownerId?._id,
      name: workspace.ownerId?.name,
      avatar: workspace.ownerId?.avatar,
      email: workspace.ownerId?.email,
    },
    members: workspace.members.map((member) => ({
      _id: member.userId?._id,
      name: member.userId?.name,
      avatar: member.userId?.avatar,
      email: member.userId?.email,
      role: member.role,
      status: member.status,
    })),
  };
};