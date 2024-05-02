import { alpha, Box } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { IServiceInfo } from "../interfaces/service";
import { useNavigate, useParams } from "react-router-dom";

export default function ServiceCard() {
    const { businessId } = useParams();
    const navigate = useNavigate();
    const serviceInfo = JSON.parse(
        localStorage.getItem("serviceInfo") || "{}"
    ) as IServiceInfo;

    return (
        <div
            style={{ borderColor: `${alpha("#000000", 0.2)}` }}
            className="flex flex-col p-3 text-sm border rounded-lg focus:outline-none">
            <div className="flex justify-between">
                <div className=" font-bold " style={{ fontSize: "14px" }}>
                    {serviceInfo?.serviceName}
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
                        onClick={() => navigate(`/serviceInfo/${businessId}?edit=true`)}
                        sx={{
                            cursor: "pointer",
                            color: "#020873",
                            width: "20px",
                            height: "20px",
                        }}
                    />
                </Box>
            </div>
            <div style={{ fontSize: "14px", marginTop: "-10px" }}>
                {serviceInfo?.serviceDescription}
            </div>
            <div style={{ fontSize: "14px" }}>
                {serviceInfo?.price} {serviceInfo?.currency}
            </div>
        </div>
    );
}
