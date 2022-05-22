import {
  accordionActionsClasses,
  Box,
  Button,
  ButtonGroup,
  Container,
} from "@mui/material";

const actions = [
  "Stop Trip",
  "Excuse Call",
  "Request Pickup",
  "Request Emergency Service",
  "Update Location",
];

export const SafeActions = () => {
  return (
    <Box
      alignItems="center"
      justifyContent="center"
      height="70vh"
      sx={{ display: "flex" }}
    >
      <ButtonGroup
        orientation="vertical"
        aria-label="vertical contained button group"
        variant="contained"
      >
        {actions.map((action, index) => {
          const actionMB = index !== actions.length - 1 ? "10px" : "0";
          return (
            <Button size="large" key={action} sx={{ mb: actionMB }}>
              {action}
            </Button>
          );
        })}
      </ButtonGroup>
    </Box>
  );
};
