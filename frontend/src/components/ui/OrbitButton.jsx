import { Button } from "@mui/material";
import {
  orbitPrimaryButtonSx,
  orbitSecondaryButtonSx,
  orbitDangerButtonSx,
  orbitIconButtonSx,
} from "../../theme";

const variantMap = {
  primary: orbitPrimaryButtonSx,
  secondary: orbitSecondaryButtonSx,
  danger: orbitDangerButtonSx,
  upload: orbitIconButtonSx,
};

const muiVariantMap = {
  primary: "contained",
  secondary: "outlined",
  danger: "contained",
  upload: "outlined",
};

const OrbitButton = ({
  children,
  variant = "primary",
  sx = {},
  ...props
}) => {
  return (
    <Button
      variant={muiVariantMap[variant] || "contained"}
      sx={{
        ...(variantMap[variant] || orbitPrimaryButtonSx),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default OrbitButton;