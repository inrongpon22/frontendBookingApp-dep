import { alpha, Modal, Typography } from "@mui/material";

interface IProps {
    open: boolean;
    title: string;
    description: string;
    bntConfirm: string;
    bntBack: string;
    handleClose: () => void;
    handleConfirm: () => void;
}

export default function ConfirmCard(props: IProps) {
    return (
        <Modal onClose={props.handleClose} open={props.open}>
            <div
                style={{
                    top: "50%",
                    left: "50%",
                    width: "343px",
                    height: "auto",
                    background: "white",
                    transform: "translate(-50%, -50%)",
                    outline: "none",
                }}
                className="absolute focus:bg-none rounded-lg p-6">
                <Typography
                    textAlign={"center"}
                    id="modal-modal-title"
                    sx={{ fontWeight: "bold", fontSize: "17px" }}>
                    {props.title}
                </Typography>
                <Typography
                    sx={{
                        textAlign: "center",
                        color: alpha("#000000", 0.6),
                        fontSize: "14px",
                    }}>
                    {props.description}
                </Typography>
                <div className="flex justify-between gap-2 mt-4">
                    <button
                        onClick={() => props.handleClose()}
                        style={{
                            width: "151px",
                            height: "51px",
                            fontWeight: "bold",
                            borderColor: alpha("#000000", 0.2),
                            fontSize: "14px",
                        }}
                        className="border p-4 rounded-lg text-[#020873]">
                        {props.bntBack}
                    </button>
                    <button
                        onClick={() => props.handleConfirm()}
                        className="p-4 rounded-lg text-white"
                        style={{
                            width: "151px",
                            height: "51px",
                            fontWeight: "bold",
                            background: "#020873",
                            fontSize: "14px",
                        }}>
                        {props.bntConfirm}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
