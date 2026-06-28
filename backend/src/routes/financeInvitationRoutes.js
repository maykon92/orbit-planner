import express from "express";

import { authGuard } from "../middlewares/authMiddleware.js";

import {
  createFinanceInvitation,
  getMyFinanceInvitations,
  acceptFinanceInvitation,
  declineFinanceInvitation,
} from "../controllers/financeInvitationController.js";

const router = express.Router();

// Todas as rotas precisam do usuário autenticado
router.use(authGuard);

// ======================================================
// Create Invitation
// ======================================================

router.post(
  "/",
  createFinanceInvitation
);

// ======================================================
// Get My Invitations
// ======================================================

router.get(
  "/",
  getMyFinanceInvitations
);

// ======================================================
// Accept Invitation
// ======================================================

router.put(
  "/:invitationId/accept",
  acceptFinanceInvitation
);

// ======================================================
// Decline Invitation
// ======================================================

router.put(
  "/:invitationId/decline",
  declineFinanceInvitation
);

export default router;