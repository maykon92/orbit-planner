import { Box, Stack, Typography } from "@mui/material";

const PageHeader = ({
  title,
  subtitle,
  actions,
  logo = "/orbit_planner_logo.png",
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", lg: "center" },
        gap: 3,
        mb: 4,
        py: { xs: 2, md: 3 },
      }}
    >
      <Stack direction="row" spacing={2.2} sx={{alignItems:"center"}}>
        <Box
          component="img"
          src={logo}
          alt={title}
          sx={{
            width: { xs: 46, md: 54 },
            height: { xs: 46, md: 54 },
            objectFit: "contain",
            filter:
              "drop-shadow(0 0 12px rgba(96,165,250,.35)) drop-shadow(0 0 20px rgba(139,92,246,.25))",
          }}
        />

        <Box>
          <Typography
            sx={{
              color: "#f8fafc",
              fontSize: { xs: 34, md: 46 },
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-1.4px",
            }}
          >
            {title}
          </Typography>

          {subtitle && (
            <Typography
              sx={{
                mt: 1,
                color: "#8fa0bf",
                fontSize: { xs: 14, md: 16 },
                fontWeight: 500,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Stack>

      {actions && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{
            alignItems: { xs: "stretch", sm: "center" },
            width: { xs: "100%", lg: "auto" },
          }}
        >
          {actions}
        </Stack>
      )}
    </Box>
  );
};

export default PageHeader;