import {
  ALLOWED_TAB_TYPES,
  ALLOWED_ITEM_STATUS,
  ALLOWED_POST_VISIBILITY,
} from "../utils/constants.js";

export const getAppConfig = (req, res) => {
  res.json({
    tabTypes: ALLOWED_TAB_TYPES,
    itemStatus: ALLOWED_ITEM_STATUS,
    postVisibility: ALLOWED_POST_VISIBILITY,
  });
};