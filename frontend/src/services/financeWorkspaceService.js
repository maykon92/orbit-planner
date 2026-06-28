import api from "./api";

// ======================================================
// WORKSPACES
// ======================================================

export const getFinanceWorkspaces = async () => {
  const { data } = await api.get("/finance/workspaces");

  return data;
};

export const createFinanceWorkspace = async (workspace) => {
  const { data } = await api.post(
    "/finance/workspaces",
    workspace
  );

  return data;
};

export const getFinanceWorkspaceDetails = async (workspaceId) => {
  const { data } = await api.get(`/finance/workspaces/${workspaceId}`);
  return data;
};

// ======================================================
// INVITATIONS
// ======================================================

export const createFinanceInvitation = async ({
  workspaceId,
  recipientId,
}) => {
  const { data } = await api.post(
    "/finance/invitations",
    {
      workspaceId,
      recipientId,
    }
  );

  return data;
};

export const getMyFinanceInvitations = async () => {
  const { data } = await api.get(
    "/finance/invitations"
  );

  return data;
};

export const acceptFinanceInvitation = async (
  invitationId
) => {
  const { data } = await api.put(
    `/finance/invitations/${invitationId}/accept` 
  );

  return data;
};

export const declineFinanceInvitation = async (
  invitationId
) => {
  const { data } = await api.put(
    `/finance/invitations/${invitationId}/decline`
  );

  return data;
};