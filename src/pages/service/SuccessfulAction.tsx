import { useNavigate } from "react-router-dom";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { Modal } from "@mui/material";

interface IProps {
    openCard: boolean;
    title: string;
    description: string;
    btnWord: string;
    iconType: string;
    navigateTo: string;
    handleOnClose: () => void;
}

export default function SuccessfulAction(props: IProps) {
    const navigate = useNavigate();
    if (!props.openCard) {
        return null;
    }
    return (
        <>
            <Modal
                open={props.openCard}
                sx={{
                    background: "#FFFFFF",
                    "& .MuiBackdrop-root": {
                        backgroundColor: "rgba(255, 255, 255, 1)", // Fully opaque white background
                    },
                }}
                BackdropProps={{
                    style: {
                        backgroundColor: "rgba(255, 255, 255, 1)", // Fully opaque white background
                    },
                }}>
                <div>
                    <div className="flex flex-col justify-center items-center h-screen">
                        <div className="flex flex-col justify-between items-center h-full w-5/6">
                            <div className="flex flex-col flex-grow justify-center">
                                <div className="flex justify-center my-12">
                                    <CheckCircleOutlinedIcon
                                        sx={{
                                            color: "#020873",
                                            fontSize: "10rem",
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col items-center mb-[10vw]">
                                    <div className="text-[32px] font-bold text-center">
                                        {props.title}
                                    </div>
                                    <div className="text-center">
                                        {props.description}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                navigate(`/${props.navigateTo}`);
                                props.handleOnClose();
                            }}
                            type="button"
                            style={{ marginBottom: "56px" }}
                            className="py-3 px-10 bg-[#020873] text-white rounded-lg w-[90vw] sm:w-[80vw] md:w-[70vw] lg:w-[60vw] xl:w-[50vw] 2xl:w-[40vw]"
                            // onClick={() => setShowDialog(true)}
                        >
                            {props.btnWord}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
