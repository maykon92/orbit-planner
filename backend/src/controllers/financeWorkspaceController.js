import { getWorkspaceDetails } from "../services/financeWorkspaceService.js";

export const getWorkspace = async (req, res) => {
  try {
    const workspace = await getWorkspaceDetails(
      req.params.workspaceId,
      req.user._id
    );

    res.json(workspace);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};