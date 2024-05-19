import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import CloseIcon from '@mui/icons-material/Close';

interface IProps {
    context: string;
    isClose: boolean;
    isTyping?: boolean;
    isEdit?: boolean;
    // handleClose?: (event: React.KeyboardEvent | React.MouseEvent) => void;
    handleClose?: () => void;
}

export default function Header(props: IProps) {

    return (
        <div className="flex items-center justify-between">
            <div
                onClick={props.handleClose}
            >
                {props.isClose ? (
                    <CloseIcon
                        sx={{
                            width: "20px",
                            height: "20px",
                            cursor: "pointer",
                        }}
                    />
                ) : (
                    <ArrowBackIosNewOutlinedIcon
                        sx={{
                            width: "20px",
                            height: "20px",
                            cursor: "pointer",
                        }}
                    />
                )}

            </div>

            <div className="font-bold" style={{ fontSize: "14px" }}>
                {props.context}
            </div>

            <div>
                {props.isEdit && props.isEdit ? (
                    <div style={{ width: "20px", height: "20px" }} />
                ) : (
                    <div style={{ width: "20px", height: "20px" }} />
                )}

            </div>
        </div>
    );
}
