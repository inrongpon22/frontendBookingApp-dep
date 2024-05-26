import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useParams } from "react-router-dom";

interface IProps {
    isClose: boolean;
    context: string;
    handleClose?: () => void;
}

export default function Header(props: IProps) {
    const navigate = useNavigate();
    const { businessId } = useParams();
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get("type");
    const handleClick = () => {
        if (props.handleClose) {
            props.handleClose();
        } else {
            if (type && type === "add") {
                navigate(`/service-setting/${businessId}`);
            } else {
                navigate(`/business-profile/${businessId}`);
            }
        }
    };
    return (
        <div className="flex items-center justify-between">
            <div onClick={handleClick}>
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
                <div style={{ width: "20px", height: "20px" }} />
            </div>
        </div>
    );
}
