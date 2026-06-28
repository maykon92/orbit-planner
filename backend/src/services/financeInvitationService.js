import FinanceInvitation from "../models/FinanceInvitation.js";
import FinanceWorkspace from "../models/FinanceWorkspace.js";
import Notification from "../models/Notification.js";

// ======================================================
// CREATE
// ======================================================

export const createInvitation = async ({
  workspaceId,
  senderId,
  recipientId,
}) => {
  const exists = await FinanceInvitation.findOne({
    workspace: workspaceId,
    recipient: recipientId,
    status: "pending",
  });

  if (exists) {
    throw new Error("Invitation already exists.");
  }

  const workspace = await FinanceWorkspace.findOne({
    _id: workspaceId,
    ownerId: senderId,
  });

  if (!workspace) {
    throw new Error("Only the workspace owner can send invitations.");
  }

  const invitation = await FinanceInvitation.create({
    workspace: workspaceId,
    sender: senderId,
    recipient: recipientId,
  });

  await Notification.create({
    recipient: recipientId,
    sender: senderId,
    type: "finance_invitation",
    message: "invited you to join a shared finance.",
    financeInvitation: invitation._id,
  });

  return invitation;
};

// ======================================================
// READ
// ======================================================

export const getPendingInvitations = async (userId) => {
  return await FinanceInvitation.find({
    recipient: userId,
    status: "pending",
  })
    .populate("sender", "name avatar email")
    .populate("workspace", "name type");
};

// ======================================================
// ACCEPT
// ======================================================

export const acceptInvitation = async (invitationId, userId) => {
  const invitation = await FinanceInvitation.findOne({
    _id: invitationId,
    recipient: userId,
    status: "pending",
  });

  if (!invitation) {
    throw new Error("Invitation not found.");
  }

  const workspace = await FinanceWorkspace.findById(invitation.workspace);

  if (!workspace) {
    throw new Error("Workspace not found.");
  }

  const alreadyMember = workspace.members.some(
    (member) => member.userId.toString() === userId.toString()
  );

  if (!alreadyMember) {
    workspace.members.push({
      userId,
      role: "member",
      status: "active",
    });

    await workspace.save();
  }

  invitation.status = "accepted";
  await invitation.save();

  await Notification.deleteMany({
    financeInvitation: invitation._id,
  });

  await Notification.create({
    recipient: invitation.sender,
    sender: userId,
    type: "finance_invitation_accepted",
    message: "accepted your shared finance invitation.",
    financeInvitation: invitation._id,
  });

  return await FinanceWorkspace.findById(workspace._id).populate(
    "members.userId",
    "name avatar email"
  );
};

// ======================================================
// DECLINE
// ======================================================

export const declineInvitation = async (
  invitationId,
  userId
) => {
  const invitation =
    await FinanceInvitation.findOne({
      _id: invitationId,
      recipient: userId,
      status: "pending",
    });

  if (!invitation) {
    throw new Error("Invitation not found.");
  }

  invitation.status = "declined";
  await invitation.save();

  await Notification.deleteMany({
    financeInvitation: invitation._id,
  });

  return invitation;
};