import {
  createInvitation,
  getPendingInvitations,
  acceptInvitation,
  declineInvitation,
} from "../services/financeInvitationService.js";

// ======================================================
// CREATE INVITATION
// ======================================================

export const createFinanceInvitation = async (req, res) => {
  try {
    const { workspaceId, recipientId } = req.body;

    if (!workspaceId || !recipientId) {
      return res.status(400).json({
        message: "Workspace ID and recipient ID are required.",
      });
    }

    const invitation = await createInvitation({
      workspaceId,
      senderId: req.user._id,
      recipientId,
    });

    res.status(201).json(invitation);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================================
// GET MY PENDING INVITATIONS
// ======================================================

export const getMyFinanceInvitations = async (req, res) => {
  try {
    const invitations = await getPendingInvitations(
      req.user._id
    );

    res.json(invitations);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================================
// ACCEPT INVITATION
// ======================================================

export const acceptFinanceInvitation = async (req, res) => {
  try {
    const workspace = await acceptInvitation(
      req.params.invitationId,
      req.user._id
    );

    res.json({
      message: "Invitation accepted successfully.",
      workspace,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================================
// DECLINE INVITATION
// ======================================================

export const declineFinanceInvitation = async (req, res) => {
  try {
    await declineInvitation(
      req.params.invitationId,
      req.user._id
    );

    res.json({
      message: "Invitation declined successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};