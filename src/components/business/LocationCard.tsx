import { alpha, IconButton } from "@mui/material";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";

interface IData {
    address: string;
}

export default function LocationCard(props: IData) {
    return (
        <div className="mt-4 border-solid border border-black-200 rounded-lg">
            <div className="w-full p-4">
                <div className="flex">
                    <div>
                        <IconButton
                            sx={{
                                background: `${alpha("#54B435", 0.1)}`,
                                mr: "8px",
                            }}
                            size="small">
                            <FmdGoodOutlinedIcon
                                sx={{
                                    color: "#54B435",
                                    width: "20px",
                                    height: "20px",
                                }}
                            />
                        </IconButton>
                    </div>
                    <div>
                        <p className="font-bold" style={{ fontSize: "14px" }}>
                            Location
                        </p>
                        <p style={{ fontSize: "14px" }}>{props.address}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
