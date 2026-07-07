import { orbitTextFieldSx } from "./orbitInputStyles";

export const orbitDatePickerProps = {
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
                border: "1px solid #1f2937",
                borderRadius: 3,
                boxShadow: "0 20px 60px rgba(0,0,0,.45)",
            },

            "& .MuiPickersDay-root": {
                color: "#cbd5e1",
                borderRadius: 2,
            },

            "& .MuiPickersDay-root:hover": {
                background: "rgba(96,165,250,.16)",
            },

            "& .MuiPickersDay-root.Mui-selected": {
                background: "#2563eb",
                color: "#fff",
            },

            "& .MuiDayCalendar-weekDayLabel": {
                color: "#94a3b8",
                fontWeight: 600,
            },

            "& .MuiPickersCalendarHeader-label": {
                color: "#fff",
                fontWeight: 700,
            },

            "& .MuiSvgIcon-root": {
                color: "#94a3b8",
            },

            "& button": {
                color: "#94a3b8",
            },
        },
    },
};