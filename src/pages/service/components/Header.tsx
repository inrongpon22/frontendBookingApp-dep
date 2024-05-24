import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { useNavigate, useParams } from "react-router-dom";

interface IProps {
    context: string;
    handleClose?: () => void;
}

export default function Header(props: IProps) {
    const navigate = useNavigate();
    const { businessId } = useParams();
    const handleClick = () => {
        if (props.handleClose) {
            props.handleClose();
        } else {
            navigate(`/business-profile/${businessId}`);
        }
    };
    return (
        <div className="flex items-center justify-between">
            <div onClick={handleClick}>
                <ArrowBackIosNewOutlinedIcon
                    sx={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                    }}
                />
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
