import { orbitTextFieldSx } from "./orbitInputStyles";

export const orbitTimePickerProps = {
  textField: {
    fullWidth: true,
    margin: "normal",
    sx: orbitTextFieldSx,
  },

  popper: {
    sx: {
      "& .MuiPaper-root": {
        background: "#0f172a",
        color: "#f8fafc",
        border: "1px solid rgba(96,165,250,.25)",
        borderRadius: 3,
        boxShadow: "0 24px 60px rgba(0,0,0,.6)",
      },

      "& .MuiMultiSectionDigitalClock-root": {
        background: "#0f172a",
        color: "#f8fafc",
      },

      "& .MuiMultiSectionDigitalClockSection-root": {
        scrollbarColor: "#475569 #0f172a",
      },

      "& .MuiMultiSectionDigitalClockSection-item": {
        color: "#cbd5e1",
        borderRadius: 2,
        fontWeight: 700,

        "&:hover": {
          background: "rgba(96,165,250,.14)",
        },

        "&.Mui-selected": {
          background: "#2563eb !important",
          color: "#fff",
        },
      },

      "& .MuiDialogActions-root": {
        borderTop: "1px solid rgba(255,255,255,.06)",
      },

      "& .MuiButton-root": {
        color: "#93c5fd",
        fontWeight: 800,
      },
    },
  },
};