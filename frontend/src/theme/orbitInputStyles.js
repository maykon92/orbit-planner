export const orbitTextFieldSx = {
  mb: 2,
  "& .MuiInputLabel-root": {
    color: "#94a3b8",
    fontWeight: 700,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#60a5fa",
  },
  "& .MuiOutlinedInput-root": {
    minHeight: 56,
    borderRadius: "14px",
    background: "rgba(15,23,42,.82)",
    color: "#f8fafc",
    "& fieldset": {
      borderColor: "rgba(96,165,250,.25)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(96,165,250,.45)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 3px rgba(59,130,246,.12)",
    },
  },
  "& .MuiInputBase-input": {
    color: "#f8fafc",
    fontWeight: 700,
  },
  "& textarea": {
    color: "#f8fafc",
  },
};

export const orbitFormSelectSx = {
  mb: 2.5,
  "& .MuiInputLabel-root": {
    color: "#94a3b8",
    fontWeight: 700,
    background: "#0f172a",
    px: 0.6,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#60a5fa",
  },
  "& .MuiOutlinedInput-root": {
    minHeight: 58,
    borderRadius: "14px",
    background: "rgba(15,23,42,.82)",
    color: "#f8fafc",
    "& fieldset": {
      borderColor: "rgba(96,165,250,.25)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(96,165,250,.45)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 3px rgba(59,130,246,.12)",
    },
  },
  "& .MuiSelect-select": {
    minHeight: "unset !important",
    py: "17px",
    fontSize: 16,
    fontWeight: 800,
    color: "#f8fafc",
  },
  "& .MuiSvgIcon-root": {
    color: "#94a3b8",
  },
};

export const orbitCompactSelectSx = {
  minWidth: 200,
  "& .MuiInputLabel-root": {
    color: "#94a3b8",
    fontWeight: 700,
    background: "#111827",
    px: 0.6,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#60a5fa",
  },
  "& .MuiOutlinedInput-root": {
    height: 50,
    borderRadius: "14px",
    background: "rgba(15,23,42,.82)",
    color: "#f8fafc",
    "& fieldset": {
      borderColor: "rgba(96,165,250,.25)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(96,165,250,.45)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 3px rgba(59,130,246,.12)",
    },
  },
  "& .MuiSelect-select": {
    py: "12px",
    fontSize: 16,
    fontWeight: 800,
    color: "#f8fafc",
  },
  "& .MuiSvgIcon-root": {
    color: "#94a3b8",
  },
};

export const orbitMenuProps = {
  slotProps: {
    paper: {
      sx: {
        mt: 1,
        background: "#0f172a",
        color: "#f8fafc",
        border: "1px solid rgba(96,165,250,.25)",
        borderRadius: 3,
        boxShadow: "0 20px 55px rgba(0,0,0,.55)",
        "& .MuiMenuItem-root": {
          color: "#f8fafc",
          fontWeight: 700,
          background: "transparent",
          borderRadius: 2,
          mx: 1,
          my: 0.4,
        },
        "& .MuiMenuItem-root:hover": {
          background: "rgba(96,165,250,.12)",
        },
        "& .MuiMenuItem-root.Mui-selected": {
          background: "rgba(37,99,235,.25)",
          color: "#fff",
        },
        "& .MuiMenuItem-root.Mui-selected:hover": {
          background: "rgba(37,99,235,.35)",
        },
      },
    },
  },
};

export const orbitSelectSx = orbitFormSelectSx;