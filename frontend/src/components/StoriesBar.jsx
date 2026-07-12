import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Avatar,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SendIcon from "@mui/icons-material/Send";

import {
  deleteStory,
  getStories,
  markStoryAsViewed,
  replyToStory,
  toggleStoryLike,
} from "../services/storyService";

import { getImageUrl } from "../utils/getImageUrl";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

import CreateStoryModal from "./CreateStoryModal";

const STORY_DURATION = 5000;
const PROGRESS_INTERVAL = 50;

const StoriesBar = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const elapsedTimeRef = useRef(0);

  const [stories, setStories] = useState([]);

  const [selectedGroupIndex, setSelectedGroupIndex] =
    useState(null);

  const [selectedStoryIndex, setSelectedStoryIndex] =
    useState(0);

  const [loadingStories, setLoadingStories] =
    useState(false);

  const [deletingStory, setDeletingStory] =
    useState(false);

  const [likingStory, setLikingStory] =
    useState(false);

  const [replyMessage, setReplyMessage] =
    useState("");

  const [sendingReply, setSendingReply] =
    useState(false);

  const [isReplyFocused, setIsReplyFocused] =
    useState(false);

  const [storyProgress, setStoryProgress] =
    useState(0);

  const [isStoryPaused, setIsStoryPaused] =
    useState(false);

  const [openCreateStoryModal, setOpenCreateStoryModal] =
    useState(false);

  const loadStories = useCallback(async () => {
    if (!user?._id) {
      setStories([]);
      return;
    }

    try {
      setLoadingStories(true);

      const response = await getStories();

      const storiesData = Array.isArray(response)
        ? response
        : response?.stories || [];

      setStories(storiesData);
    } catch (error) {
      console.error(
        "Error loading stories:",
        error?.response?.data || error
      );

      setStories([]);
    } finally {
      setLoadingStories(false);
    }
  }, [user?._id]);

  useEffect(() => {
    setSelectedGroupIndex(null);
    setSelectedStoryIndex(0);
    setStoryProgress(0);
    setIsStoryPaused(false);
    setIsReplyFocused(false);
    setReplyMessage("");
    setStories([]);

    elapsedTimeRef.current = 0;

    if (!user?._id) return;

    loadStories();
  }, [user?._id, loadStories]);

  const groupedStories = useMemo(() => {
    const groupsMap = new Map();

    stories.forEach((story) => {
      const storyUser = story.userId;
      const storyUserId = storyUser?._id;

      if (!storyUserId) return;

      if (!groupsMap.has(storyUserId)) {
        groupsMap.set(storyUserId, {
          user: storyUser,
          stories: [],
        });
      }

      groupsMap.get(storyUserId).stories.push(story);
    });

    const groups = Array.from(groupsMap.values());

    groups.forEach((group) => {
      group.stories.sort(
        (firstStory, secondStory) =>
          new Date(firstStory.createdAt).getTime() -
          new Date(secondStory.createdAt).getTime()
      );
    });

    groups.sort((firstGroup, secondGroup) => {
      const firstIsCurrentUser =
        firstGroup.user?._id?.toString() ===
        user?._id?.toString();

      const secondIsCurrentUser =
        secondGroup.user?._id?.toString() ===
        user?._id?.toString();

      if (firstIsCurrentUser && !secondIsCurrentUser) {
        return -1;
      }

      if (!firstIsCurrentUser && secondIsCurrentUser) {
        return 1;
      }

      const firstHasUnseen = firstGroup.stories.some(
        (story) => !story.hasViewed
      );

      const secondHasUnseen = secondGroup.stories.some(
        (story) => !story.hasViewed
      );

      if (firstHasUnseen && !secondHasUnseen) {
        return -1;
      }

      if (!firstHasUnseen && secondHasUnseen) {
        return 1;
      }

      const firstLatestStory =
        firstGroup.stories[firstGroup.stories.length - 1];

      const secondLatestStory =
        secondGroup.stories[secondGroup.stories.length - 1];

      return (
        new Date(
          secondLatestStory?.createdAt || 0
        ).getTime() -
        new Date(
          firstLatestStory?.createdAt || 0
        ).getTime()
      );
    });

    return groups;
  }, [stories, user?._id]);

  const selectedGroup =
    selectedGroupIndex !== null
      ? groupedStories[selectedGroupIndex]
      : null;

  const selectedStory =
    selectedGroup?.stories?.[selectedStoryIndex] || null;

  const storyOwnerId =
    selectedGroup?.user?._id?.toString();

  const currentUserId =
    user?._id?.toString();

  const isCurrentUserStory =
    Boolean(storyOwnerId && storyOwnerId === currentUserId);

  const currentUserGroupIndex = groupedStories.findIndex(
    (group) =>
      group.user?._id?.toString() ===
      currentUserId
  );

  const currentUserGroup =
    currentUserGroupIndex >= 0
      ? groupedStories[currentUserGroupIndex]
      : null;

  const currentUserHasStories = Boolean(
    currentUserGroup?.stories?.length
  );

  const storyIsPaused =
    isStoryPaused ||
    isReplyFocused ||
    sendingReply ||
    likingStory ||
    deletingStory;

  const updateStoryAsViewedLocally = useCallback(
    (storyId) => {
      setStories((previousStories) =>
        previousStories.map((story) =>
          story._id === storyId
            ? {
                ...story,
                hasViewed: true,
              }
            : story
        )
      );
    },
    []
  );

  const markCurrentStoryAsViewed = useCallback(
    async (story) => {
      if (!story || story.hasViewed) return;

      try {
        await markStoryAsViewed(story._id);

        updateStoryAsViewedLocally(story._id);
      } catch (error) {
        console.error(
          "Error marking Story as viewed:",
          error?.response?.data || error
        );
      }
    },
    [updateStoryAsViewedLocally]
  );

  const resetStoryTimer = useCallback(() => {
    elapsedTimeRef.current = 0;

    setStoryProgress(0);
    setIsStoryPaused(false);
    setIsReplyFocused(false);
    setReplyMessage("");
  }, []);

  const handleOpenGroup = useCallback(
    async (groupIndex) => {
      const group = groupedStories[groupIndex];

      if (!group?.stories?.length) return;

      const firstUnseenStoryIndex =
        group.stories.findIndex(
          (story) => !story.hasViewed
        );

      const initialStoryIndex =
        firstUnseenStoryIndex >= 0
          ? firstUnseenStoryIndex
          : 0;

      const initialStory =
        group.stories[initialStoryIndex];

      setSelectedGroupIndex(groupIndex);
      setSelectedStoryIndex(initialStoryIndex);

      resetStoryTimer();

      await markCurrentStoryAsViewed(initialStory);
    },
    [
      groupedStories,
      markCurrentStoryAsViewed,
      resetStoryTimer,
    ]
  );

  const handleCloseViewer = useCallback(() => {
    setSelectedGroupIndex(null);
    setSelectedStoryIndex(0);
    setStoryProgress(0);
    setIsStoryPaused(false);
    setIsReplyFocused(false);
    setReplyMessage("");

    elapsedTimeRef.current = 0;
  }, []);

  const handleNextStory = useCallback(async () => {
    if (
      selectedGroupIndex === null ||
      !selectedGroup
    ) {
      return;
    }

    const nextStoryIndex =
      selectedStoryIndex + 1;

    if (
      nextStoryIndex <
      selectedGroup.stories.length
    ) {
      const nextStory =
        selectedGroup.stories[nextStoryIndex];

      setSelectedStoryIndex(nextStoryIndex);

      resetStoryTimer();

      await markCurrentStoryAsViewed(nextStory);

      return;
    }

    const nextGroupIndex =
      selectedGroupIndex + 1;

    if (
      nextGroupIndex <
      groupedStories.length
    ) {
      const nextGroup =
        groupedStories[nextGroupIndex];

      const firstStory =
        nextGroup?.stories?.[0];

      if (!firstStory) {
        handleCloseViewer();
        return;
      }

      setSelectedGroupIndex(nextGroupIndex);
      setSelectedStoryIndex(0);

      resetStoryTimer();

      await markCurrentStoryAsViewed(firstStory);

      return;
    }

    handleCloseViewer();
  }, [
    groupedStories,
    handleCloseViewer,
    markCurrentStoryAsViewed,
    resetStoryTimer,
    selectedGroup,
    selectedGroupIndex,
    selectedStoryIndex,
  ]);

  const handlePreviousStory = useCallback(async () => {
    if (
      selectedGroupIndex === null ||
      !selectedGroup
    ) {
      return;
    }

    const previousStoryIndex =
      selectedStoryIndex - 1;

    if (previousStoryIndex >= 0) {
      const previousStory =
        selectedGroup.stories[previousStoryIndex];

      setSelectedStoryIndex(previousStoryIndex);

      resetStoryTimer();

      await markCurrentStoryAsViewed(previousStory);

      return;
    }

    const previousGroupIndex =
      selectedGroupIndex - 1;

    if (previousGroupIndex >= 0) {
      const previousGroup =
        groupedStories[previousGroupIndex];

      const lastStoryIndex =
        previousGroup.stories.length - 1;

      const previousStory =
        previousGroup.stories[lastStoryIndex];

      setSelectedGroupIndex(previousGroupIndex);
      setSelectedStoryIndex(lastStoryIndex);

      resetStoryTimer();

      await markCurrentStoryAsViewed(previousStory);
    }
  }, [
    groupedStories,
    markCurrentStoryAsViewed,
    resetStoryTimer,
    selectedGroup,
    selectedGroupIndex,
    selectedStoryIndex,
  ]);

  const handleDeleteStory = async () => {
    if (!selectedStory || deletingStory) return;

    try {
      setDeletingStory(true);

      await deleteStory(selectedStory._id);

      const remainingGroupStories =
        selectedGroup?.stories?.filter(
          (story) =>
            story._id !== selectedStory._id
        ) || [];

      setStories((previousStories) =>
        previousStories.filter(
          (story) =>
            story._id !== selectedStory._id
        )
      );

      showToast?.(
        "Story deleted successfully."
      );

      if (remainingGroupStories.length === 0) {
        handleCloseViewer();
        return;
      }

      const nextIndex = Math.min(
        selectedStoryIndex,
        remainingGroupStories.length - 1
      );

      setSelectedStoryIndex(nextIndex);

      resetStoryTimer();
    } catch (error) {
      console.error(
        "Error deleting Story:",
        error?.response?.data || error
      );

      showToast?.(
        error?.response?.data?.message ||
          error?.message ||
          "Error deleting Story."
      );
    } finally {
      setDeletingStory(false);
    }
  };

  const handleLikeStory = async () => {
    if (!selectedStory || likingStory) return;

    const storyId = selectedStory._id;

    try {
      setLikingStory(true);

      const response =
        await toggleStoryLike(storyId);

      setStories((previousStories) =>
        previousStories.map((story) =>
          story._id === storyId
            ? {
                ...story,

                likedByCurrentUser:
                  response.liked,

                likesCount:
                  response.likesCount,

                likes:
                  Array.isArray(response.likes)
                    ? response.likes
                    : story.likes,
              }
            : story
        )
      );
    } catch (error) {
      console.error(
        "Error liking Story:",
        error?.response?.data || error
      );

      showToast?.(
        error?.response?.data?.message ||
          error?.message ||
          "Error updating Story like."
      );
    } finally {
      setLikingStory(false);
    }
  };

  const handleReplyStory = async () => {
    const message = replyMessage.trim();

    if (
      !selectedStory ||
      !message ||
      sendingReply
    ) {
      return;
    }

    try {
      setSendingReply(true);

      await replyToStory({
        storyId: selectedStory._id,
        message,
      });

      setReplyMessage("");
      setIsReplyFocused(false);

      showToast?.(
        "Reply sent successfully."
      );
    } catch (error) {
      console.error(
        "Error replying to Story:",
        error?.response?.data || error
      );

      showToast?.(
        error?.response?.data?.message ||
          error?.message ||
          "Error sending Story reply."
      );
    } finally {
      setSendingReply(false);
    }
  };

  const handleReplyKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      handleReplyStory();
    }
  };

  useEffect(() => {
    if (!selectedStory || storyIsPaused) {
      return undefined;
    }

    const startedAt = Date.now();

    const progressInterval =
      window.setInterval(() => {
        const sessionElapsedTime =
          Date.now() - startedAt;

        const totalElapsedTime =
          elapsedTimeRef.current +
          sessionElapsedTime;

        const nextProgress = Math.min(
          (totalElapsedTime / STORY_DURATION) *
            100,
          100
        );

        setStoryProgress(nextProgress);

        if (
          totalElapsedTime >= STORY_DURATION
        ) {
          window.clearInterval(
            progressInterval
          );
        }
      }, PROGRESS_INTERVAL);

    const remainingTime = Math.max(
      STORY_DURATION -
        elapsedTimeRef.current,
      0
    );

    const nextStoryTimeout =
      window.setTimeout(() => {
        elapsedTimeRef.current = 0;

        handleNextStory();
      }, remainingTime);

    return () => {
      const sessionElapsedTime =
        Date.now() - startedAt;

      elapsedTimeRef.current = Math.min(
        elapsedTimeRef.current +
          sessionElapsedTime,
        STORY_DURATION
      );

      window.clearInterval(
        progressInterval
      );

      window.clearTimeout(
        nextStoryTimeout
      );
    };
  }, [
    selectedStory?._id,
    storyIsPaused,
    handleNextStory,
  ]);

  const handlePauseStory = () => {
    if (!selectedStory) return;

    setIsStoryPaused(true);
  };

  const handleResumeStory = () => {
    if (!selectedStory) return;

    setIsStoryPaused(false);
  };

  const stopViewerEvent = (event) => {
    event.stopPropagation();
  };

  return (
    <>
      <Box
        sx={{
          mb: 3,
          px: { xs: 1, md: 0 },
          overflowX: "auto",
          overflowY: "hidden",

          "&::-webkit-scrollbar": {
            height: 5,
          },

          "&::-webkit-scrollbar-thumb": {
            background: "#334155",
            borderRadius: 999,
          },
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            width: "max-content",
            minWidth: "100%",
          }}
        >
          <Box
            onClick={() => {
              if (currentUserHasStories) {
                handleOpenGroup(
                  currentUserGroupIndex
                );

                return;
              }

              setOpenCreateStoryModal(true);
            }}
            sx={{
              width: 82,
              flexShrink: 0,
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <Box
              sx={{
                position: "relative",

                width: 72,
                height: 72,

                mx: "auto",
                mb: 0.8,

                p: currentUserHasStories
                  ? "3px"
                  : 0,

                borderRadius: "50%",

                background: currentUserHasStories
                  ? "linear-gradient(135deg,#2563eb,#7c3aed,#ec4899)"
                  : "transparent",

                transition: "all .25s ease",

                "&:hover": {
                  transform: "scale(1.06)",

                  boxShadow:
                    currentUserHasStories
                      ? "0 0 25px rgba(99,102,241,.4)"
                      : "0 12px 30px rgba(0,0,0,.3)",
                },
              }}
            >
              <Avatar
                src={
                  user?.avatar
                    ? getImageUrl(user.avatar)
                    : ""
                }
                sx={{
                  width: "100%",
                  height: "100%",

                  border:
                    currentUserHasStories
                      ? "3px solid #0b1120"
                      : "2px solid rgba(148,163,184,.35)",
                }}
              >
                {user?.name?.charAt(0) || "U"}
              </Avatar>

              <Box
                role="button"
                aria-label="Add Story"
                onClick={(event) => {
                  event.stopPropagation();

                  setOpenCreateStoryModal(true);
                }}
                sx={{
                  position: "absolute",
                  right: -2,
                  bottom: -2,

                  width: 26,
                  height: 26,

                  display: "grid",
                  placeItems: "center",

                  borderRadius: "50%",

                  color: "#fff",
                  background: "#2563eb",

                  border: "3px solid #0b1120",

                  zIndex: 2,

                  transition: "all .2s ease",

                  "&:hover": {
                    background: "#1d4ed8",
                    transform: "scale(1.08)",
                  },
                }}
              >
                <AddIcon sx={{ fontSize: 17 }} />
              </Box>
            </Box>

            <Typography
              sx={{
                color: currentUserHasStories
                  ? "#f8fafc"
                  : "#cbd5e1",

                fontSize: 12,

                fontWeight:
                  currentUserHasStories
                    ? 800
                    : 700,

                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {loadingStories
                ? "Loading..."
                : "Your Story"}
            </Typography>
          </Box>

          {groupedStories.map(
            (group, groupIndex) => {
              const isCurrentUser =
                group.user?._id?.toString() ===
                currentUserId;

              if (isCurrentUser) {
                return null;
              }

              const hasUnseen =
                group.stories.some(
                  (story) =>
                    !story.hasViewed
                );

              return (
                <Box
                  key={group.user._id}
                  onClick={() =>
                    handleOpenGroup(groupIndex)
                  }
                  sx={{
                    width: 82,
                    flexShrink: 0,

                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  <Box
                    sx={{
                      width: 72,
                      height: 72,

                      mx: "auto",
                      mb: 0.8,
                      p: "3px",

                      borderRadius: "50%",

                      background: hasUnseen
                        ? "linear-gradient(135deg,#2563eb,#7c3aed,#ec4899)"
                        : "rgba(100,116,139,.35)",

                      transition:
                        "all .25s ease",

                      "&:hover": {
                        transform:
                          "scale(1.06)",

                        boxShadow: hasUnseen
                          ? "0 0 25px rgba(99,102,241,.4)"
                          : "0 12px 30px rgba(0,0,0,.3)",
                      },
                    }}
                  >
                    <Avatar
                      src={
                        group.user.avatar
                          ? getImageUrl(
                              group.user.avatar
                            )
                          : ""
                      }
                      sx={{
                        width: "100%",
                        height: "100%",

                        border:
                          "3px solid #0b1120",
                      }}
                    >
                      {group.user.name?.charAt(
                        0
                      ) || "U"}
                    </Avatar>
                  </Box>

                  <Typography
                    sx={{
                      color: hasUnseen
                        ? "#f8fafc"
                        : "#94a3b8",

                      fontSize: 12,

                      fontWeight: hasUnseen
                        ? 800
                        : 600,

                      overflow: "hidden",
                      textOverflow:
                        "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {group.user.name}
                  </Typography>
                </Box>
              );
            }
          )}
        </Stack>
      </Box>

      <Dialog
        open={Boolean(selectedStory)}
        onClose={handleCloseViewer}
        fullScreen
        slotProps={{
          paper: {
            sx: {
              background: "rgba(2,6,23,.98)",
            },
          },
        }}
      >
        {selectedStory && (
          <DialogContent
            onMouseDown={handlePauseStory}
            onMouseUp={handleResumeStory}
            onMouseLeave={handleResumeStory}
            onTouchStart={handlePauseStory}
            onTouchEnd={handleResumeStory}
            onTouchCancel={handleResumeStory}
            sx={{
              p: 0,

              position: "relative",

              display: "grid",
              placeItems: "center",

              overflow: "hidden",
              userSelect: "none",

              touchAction: "manipulation",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 10,
                left: 16,
                right: 16,

                zIndex: 20,

                display: "flex",
                gap: 0.8,
              }}
            >
              {selectedGroup?.stories?.map(
                (story, index) => {
                  const isCompleted =
                    index <
                    selectedStoryIndex;

                  const isActive =
                    index ===
                    selectedStoryIndex;

                  return (
                    <Box
                      key={story._id}
                      sx={{
                        flex: 1,
                        height: 3,

                        overflow: "hidden",

                        borderRadius: 999,

                        background:
                          "rgba(255,255,255,.3)",
                      }}
                    >
                      <Box
                        sx={{
                          width: isCompleted
                            ? "100%"
                            : isActive
                              ? `${storyProgress}%`
                              : "0%",

                          height: "100%",

                          background: "#fff",

                          borderRadius: 999,

                          transition: isActive
                            ? `width ${PROGRESS_INTERVAL}ms linear`
                            : "none",
                        }}
                      />
                    </Box>
                  );
                }
              )}
            </Box>

            <Box
              component="img"
              src={getImageUrl(
                selectedStory.image
              )}
              alt={
                selectedStory.caption ||
                "Story"
              }
              draggable={false}
              sx={{
                width: "100%",
                height: "100%",
                maxWidth: 620,

                objectFit: "contain",

                background: "#020617",

                pointerEvents: "none",
              }}
            />

            <Stack
              direction="row"
              spacing={1.2}
              sx={{
                alignItems: "center",
                position: "absolute",
                top: 24,
                left: 20,
                right: 115,

                zIndex: 21,
              }}
            >
              <Avatar
                src={
                  selectedGroup?.user?.avatar
                    ? getImageUrl(
                        selectedGroup.user.avatar
                      )
                    : ""
                }
                sx={{
                  width: 42,
                  height: 42,

                  border:
                    "2px solid rgba(255,255,255,.8)",
                }}
              />

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: 800,

                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selectedGroup?.user?.name}
                </Typography>

                <Typography
                  sx={{
                    color: "#cbd5e1",
                    fontSize: 12,
                  }}
                >
                  Story {selectedStoryIndex + 1} of{" "}
                  {selectedGroup?.stories?.length || 0}

                  {storyIsPaused
                    ? " · Paused"
                    : ""}
                </Typography>
              </Box>
            </Stack>

            <IconButton
              aria-label="Close Story"
              onMouseDown={stopViewerEvent}
              onMouseUp={stopViewerEvent}
              onTouchStart={stopViewerEvent}
              onTouchEnd={stopViewerEvent}
              onClick={handleCloseViewer}
              sx={{
                position: "absolute",
                top: 22,
                right: 18,

                zIndex: 22,

                color: "#fff",

                background:
                  "rgba(15,23,42,.65)",

                "&:hover": {
                  background:
                    "rgba(30,41,59,.9)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>

            {isCurrentUserStory && (
              <IconButton
                aria-label="Delete Story"
                disabled={deletingStory}
                onMouseDown={stopViewerEvent}
                onMouseUp={stopViewerEvent}
                onTouchStart={stopViewerEvent}
                onTouchEnd={stopViewerEvent}
                onClick={handleDeleteStory}
                sx={{
                  position: "absolute",
                  top: 72,
                  right: 18,

                  zIndex: 22,

                  color: "#fca5a5",

                  background:
                    "rgba(127,29,29,.5)",

                  "&:hover": {
                    background:
                      "rgba(185,28,28,.72)",
                  },

                  "&.Mui-disabled": {
                    color: "#64748b",

                    background:
                      "rgba(51,65,85,.45)",
                  },
                }}
              >
                {deletingStory ? (
                  <CircularProgress
                    size={20}
                    sx={{ color: "inherit" }}
                  />
                ) : (
                  <DeleteOutlineIcon />
                )}
              </IconButton>
            )}

            <IconButton
              aria-label="Previous Story"
              onMouseDown={stopViewerEvent}
              onMouseUp={stopViewerEvent}
              onTouchStart={stopViewerEvent}
              onTouchEnd={stopViewerEvent}
              onClick={handlePreviousStory}
              disabled={
                selectedGroupIndex === 0 &&
                selectedStoryIndex === 0
              }
              sx={{
                position: "absolute",

                left: { xs: 8, sm: 24 },
                top: "50%",

                zIndex: 22,

                transform:
                  "translateY(-50%)",

                color: "#fff",

                background:
                  "rgba(15,23,42,.58)",

                "&:hover": {
                  background:
                    "rgba(30,41,59,.9)",
                },

                "&.Mui-disabled": {
                  opacity: 0,
                },
              }}
            >
              <ChevronLeftIcon />
            </IconButton>

            <IconButton
              aria-label="Next Story"
              onMouseDown={stopViewerEvent}
              onMouseUp={stopViewerEvent}
              onTouchStart={stopViewerEvent}
              onTouchEnd={stopViewerEvent}
              onClick={handleNextStory}
              sx={{
                position: "absolute",

                right: { xs: 8, sm: 24 },
                top: "50%",

                zIndex: 22,

                transform:
                  "translateY(-50%)",

                color: "#fff",

                background:
                  "rgba(15,23,42,.58)",

                "&:hover": {
                  background:
                    "rgba(30,41,59,.9)",
                },
              }}
            >
              <ChevronRightIcon />
            </IconButton>

            <Box
              onMouseDown={stopViewerEvent}
              onMouseUp={stopViewerEvent}
              onTouchStart={stopViewerEvent}
              onTouchEnd={stopViewerEvent}
              sx={{
                position: "absolute",

                left: { xs: 10, sm: 20 },
                right: { xs: 10, sm: 20 },
                bottom: { xs: 12, sm: 22 },

                maxWidth: 600,

                mx: "auto",
                p: { xs: 1.5, sm: 2 },

                zIndex: 23,

                borderRadius: 4,

                color: "#fff",

                background:
                  "rgba(15,23,42,.78)",

                border:
                  "1px solid rgba(255,255,255,.1)",

                boxShadow:
                  "0 22px 60px rgba(0,0,0,.45)",

                backdropFilter: "blur(18px)",
              }}
            >
              <Stack
                direction="row"
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                spacing={2}
              >
                <Box>
                  <Typography
                    sx={{
                      color: "#f8fafc",
                      fontWeight: 800,
                      fontSize: 14,
                    }}
                  >
                    {selectedStory.likesCount ||
                      selectedStory.likes?.length ||
                      0}{" "}
                    {(
                      selectedStory.likesCount ||
                      selectedStory.likes?.length ||
                      0
                    ) === 1
                      ? "like"
                      : "likes"}
                  </Typography>
                </Box>

                <IconButton
                  aria-label={
                    selectedStory.likedByCurrentUser
                      ? "Unlike Story"
                      : "Like Story"
                  }
                  disabled={likingStory}
                  onClick={handleLikeStory}
                  sx={{
                    width: 44,
                    height: 44,

                    flexShrink: 0,

                    color:
                      selectedStory.likedByCurrentUser
                        ? "#fb7185"
                        : "#fff",

                    background:
                      selectedStory.likedByCurrentUser
                        ? "rgba(244,63,94,.18)"
                        : "rgba(255,255,255,.08)",

                    border:
                      selectedStory.likedByCurrentUser
                        ? "1px solid rgba(251,113,133,.3)"
                        : "1px solid rgba(255,255,255,.1)",

                    transition:
                      "all .2s ease",

                    "&:hover": {
                      color: "#fb7185",

                      background:
                        "rgba(244,63,94,.2)",

                      transform: "scale(1.08)",
                    },
                  }}
                >
                  {likingStory ? (
                    <CircularProgress
                      size={20}
                      sx={{ color: "inherit" }}
                    />
                  ) : selectedStory.likedByCurrentUser ? (
                    <FavoriteIcon />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
              </Stack>

              {selectedStory.caption && (
                <Typography
                  sx={{
                    mt: 1.2,

                    color: "#f1f5f9",

                    fontSize: 14,
                    lineHeight: 1.6,

                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {selectedStory.caption}
                </Typography>
              )}

              {!isCurrentUserStory && (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    mt: selectedStory.caption
                    ? 1.6
                    : 1.2,
                    alignItems: "flex-end",
                  }}
                >
                  <TextField
                    fullWidth
                    multiline
                    maxRows={3}
                    placeholder="Reply to this Story..."
                    value={replyMessage}
                    disabled={sendingReply}
                    onFocus={() =>
                      setIsReplyFocused(true)
                    }
                    onBlur={() =>
                      setIsReplyFocused(false)
                    }
                    onKeyDown={handleReplyKeyDown}
                    onChange={(event) =>
                      setReplyMessage(
                        event.target.value
                      )
                    }
                    slotProps={{
                      htmlInput: {
                        maxLength: 500,
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#f8fafc",

                        borderRadius: "14px",

                        background:
                          "rgba(2,6,23,.72)",

                        "& fieldset": {
                          borderColor:
                            "rgba(148,163,184,.2)",
                        },

                        "&:hover fieldset": {
                          borderColor:
                            "rgba(96,165,250,.45)",
                        },

                        "&.Mui-focused fieldset": {
                          borderColor:
                            "#60a5fa",
                        },
                      },

                      "& textarea::placeholder": {
                        color: "#64748b",
                        opacity: 1,
                      },
                    }}
                  />

                  <IconButton
                    aria-label="Send Story reply"
                    disabled={
                      sendingReply ||
                      !replyMessage.trim()
                    }
                    onMouseDown={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    onClick={handleReplyStory}
                    sx={{
                      width: 46,
                      height: 46,

                      flexShrink: 0,

                      color: "#fff",
                      background: "#2563eb",

                      borderRadius: "14px",

                      "&:hover": {
                        background: "#1d4ed8",
                      },

                      "&.Mui-disabled": {
                        color: "#64748b",

                        background:
                          "rgba(51,65,85,.65)",
                      },
                    }}
                  >
                    {sendingReply ? (
                      <CircularProgress
                        size={20}
                        sx={{ color: "inherit" }}
                      />
                    ) : (
                      <SendIcon fontSize="small" />
                    )}
                  </IconButton>
                </Stack>
              )}
            </Box>
          </DialogContent>
        )}
      </Dialog>

      <CreateStoryModal
        open={openCreateStoryModal}
        onClose={() =>
          setOpenCreateStoryModal(false)
        }
        onCreated={async () => {
          await loadStories();

          showToast?.(
            "Story published successfully."
          );
        }}
      />
    </>
  );
};

export default StoriesBar;