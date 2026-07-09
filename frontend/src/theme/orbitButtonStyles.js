export const orbitPrimaryButtonSx = {
  height: 46,
  px: 3,

  borderRadius: "14px",

  textTransform: "none",

  fontSize: 15,

  fontWeight: 800,

  background: "#2563eb",

  transition: "all .25s ease",

  "&:hover": {
    background: "#1d4ed8",
    transform: "translateY(-1px)",
    boxShadow: "0 12px 30px rgba(37,99,235,.35)",
  },

  "&:disabled": {
    background: "#334155",
    color: "#94a3b8",
  },
};

export const orbitSecondaryButtonSx = {
  height: 46,

  px: 3,

  borderRadius: "14px",

  textTransform: "none",

  fontSize: 15,

  fontWeight: 800,

  color: "#f8fafc",

  border: "1px solid rgba(96,165,250,.25)",

  background: "rgba(15,23,42,.45)",

  transition: "all .25s ease",

  "&:hover": {
    borderColor: "#60a5fa",
    background: "rgba(96,165,250,.08)",
    transform: "translateY(-1px)",
  },
};

export const orbitDangerButtonSx = {
  height: 46,

  px: 3,

  borderRadius: "14px",

  textTransform: "none",

  fontWeight: 800,

  background: "#dc2626",

  "&:hover": {
    background: "#b91c1c",
  },
};

export const orbitIconButtonSx = {
  width: 46,
  height: 46,

  borderRadius: "14px",

  color: "#cbd5e1",

  background: "rgba(15,23,42,.45)",

  border: "1px solid rgba(96,165,250,.12)",

  transition: ".25s",

  "&:hover": {
    background: "rgba(96,165,250,.08)",
    borderColor: "#60a5fa",
  },
};