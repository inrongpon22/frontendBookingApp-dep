import { alpha, Box } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

interface IData {
    address: string;
}

export default function LocationCard(props: IData) {
    return (
        <div className="mt-4 border-solid border border-black-200 rounded-lg">
            <div className="w-full p-4">
                <div className="flex justify-between">
                    <div>
                        <p className="font-bold" style={{ fontSize: "14px" }}>
                            Location Name
                        </p>
                        <p style={{ fontSize: "14px" }}>{props.address}</p>
                    </div>
                    <Box
                        sx={{
                            display: "flex",
                            height: "32px",
                            padding: "8px",
                            borderRadius: "8px",
                            background: `${alpha("#020873", 0.1)}`,
                            alignContent: "center",
                            alignItems: "center",
                        }}>
                        <EditOutlinedIcon
                            sx={{
                                color: "#020873",
                                width: "20px",
                                height: "20px",
                            }}
                        />
                    </Box>
                </div>
            </div>
        </div>
    );
}
