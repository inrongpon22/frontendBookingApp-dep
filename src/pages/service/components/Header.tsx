import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { useNavigate } from "react-router-dom";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

interface IProps {
    context: string;
    toggleDeleteBox?: () => void;
}

export default function Header(props: IProps) {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-between">
            <div onClick={() => navigate(-1)}>
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

            <div onClick={props.toggleDeleteBox}>
                <SettingsOutlinedIcon />
            </div>
        </div>
    );
}
