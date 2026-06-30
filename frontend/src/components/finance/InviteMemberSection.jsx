import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import useUserSearch from "../../hooks/useUserSearch";
import UserSearchResult from "./UserSearchResult";

const InviteMemberSection = ({ workspace, onUpdated }) => {
  const { query, users, loading, handleSearch, clearSearch } = useUserSearch();

  return (
    <Box>
      <Typography sx={{ fontWeight: 900, color: "#fff", mb: 2, fontSize: 22 }}>
        Invite Member
      </Typography>

      <TextField
        fullWidth
        placeholder="Search user..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#94a3b8" }} />
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <IconButton onClick={clearSearch} sx={{ color: "#94a3b8" }}>
                <CloseIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            height: 64,
            background: "#111827",
            borderRadius: 4,
            color: "#fff",
            fontWeight: 800,
            "& fieldset": { borderColor: "#2563eb" },
            "&:hover fieldset": { borderColor: "#3b82f6" },
            "&.Mui-focused fieldset": { borderColor: "#2563eb" },
          },
        }}
      />

      {loading && (
        <Stack direction="row" sx={{justifyContent:"center"}} py={3}>
          <CircularProgress />
        </Stack>
      )}

      {!loading &&
        users.map((user) => (
          <UserSearchResult
            key={user._id}
            user={user}
            workspace={workspace}
            clearSearch={clearSearch}
            onUpdated={onUpdated}
          />
        ))}
    </Box>
  );
};

export default InviteMemberSection;