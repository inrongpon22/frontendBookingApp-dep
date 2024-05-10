import { Box, CircularProgress, Modal, Typography } from "@mui/material";

interface ILoading {
    openLoading: boolean;
}

const styleLoading = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    "&:focus": {
        outline: "none",
    },
    "&:active": {
        boxShadow: "none",
    },
    textAlign: "center",
};

export default function Loading(props: ILoading) {
    return (
        <>
            <Modal open={props.openLoading}>
                <Box sx={styleLoading}>
                    <CircularProgress
                        disableShrink
                        size={80}
                        color="inherit"
                        sx={{ color: "#ECD0FF" }}
                    />
                    <Typography variant="h5">Please wait...</Typography>
                </Box>
            </Modal>
        </>
    );
}
