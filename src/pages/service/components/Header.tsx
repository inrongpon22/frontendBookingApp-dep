import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";

interface IProps {
    context: string;
    handleClose?: () => void;
}

export default function Header(props: IProps) {

    return (
        <div className="flex items-center justify-between">
            <div onClick={props.handleClose}>
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
