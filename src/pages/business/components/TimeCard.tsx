import { alpha, Box } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { IServiceTime } from "../interfaces/business";
import { useNavigate } from "react-router-dom";

export default function TimeCard() {
    const navigate = useNavigate();
    const serviceTime = JSON.parse(
        localStorage.getItem("serviceTime") || "[{}]"
    ) as IServiceTime[];
    return (
        <>
            {serviceTime.map((item, index) => (
                <div
                    key={index}
                    style={{ borderColor: `${alpha("#000000", 0.2)}` }}
                    className="flex flex-col p-3 text-sm border rounded-lg focus:outline-none">
                    <div className="flex justify-between">
                        <div style={{ fontSize: "14px" }}>
                            {item.availableFromDate} -{" "}
                            {item.availableToDate == ""
                                ? "Present"
                                : item.availableToDate}
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
                                onClick={() =>
                                    navigate(`/serviceTime?edit=${index}`)
                                }
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
                        {item?.daysOpen?.map((day) => day + ", ")}
                    </div>
                    {item?.manualCapacity.map((element, index) => (
                        <div key={index}>
                            <div className="flex justify-between">
                                <li className="p-2 list-disc">
                                    {element.startTime} - {element.endTime}
                                </li>
                                <div
                                    style={{ color: alpha("#000000", 0.5) }}
                                    className="flex justify-between gap-3 items-center p-3">
                                    {`(${element.capacity} guest)`}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </>
    );
}
