import { alpha, Switch, styled } from "@mui/material";
import ServiceCard from "./components/ServiceCard";
import TimeCard from "./components/TimeCard";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { IServiceInfo, IServiceTime } from "./interfaces/business";
import { addService } from "../../api/service";
import Header from "./components/Header";
import { Divider } from "@mui/material";

const PinkSwitch = styled(Switch)(({ theme }) => ({
    "& .MuiSwitch-switchBase.Mui-checked": {
        color: "#FFFFFF",
        "&:hover": {
            backgroundColor: alpha(
                "#020873",
                theme.palette.action.hoverOpacity
            ),
        },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
        color: "#020873",
        backgroundColor: "#020873",
    },
}));

const label = { inputProps: { "aria-label": "Color switch demo" } };

export default function CreateService() {
    const navigate = useNavigate();
    const businessId = parseInt(localStorage.getItem("businessId") ?? "");
    const token = localStorage.getItem("token");

    const serviceInfo = JSON.parse(
        localStorage.getItem("serviceInfo") || "{}"
    ) as IServiceInfo;
    const serviceTime = JSON.parse(
        localStorage.getItem("serviceTime") ||
            JSON.stringify([
                {
                    daysOpen: [],
                    selectedSlots: [],
                    duration: 1,
                    openTime: "",
                    closeTime: "",
                    guestNumber: 1,
                    manualCapacity: [],
                    availableFromDate: new Date().toISOString().split("T")[0],
                    availableToDate: "",
                },
            ])
    ) as IServiceTime[];

    const [isAutoApprove, setIsAutoApprove] = useState(true);
    const [isHidePrice, setIsHidePrice] = useState(true);

    const handleCreateService = async () => {
        const insertData = {
            businessId: businessId,
            title: serviceInfo.serviceName,
            duration: serviceTime[0].duration,
            description: serviceInfo.serviceDescription,
            price: serviceInfo.price,
            requireApproval: isAutoApprove,
            daysOpen: serviceTime[0].daysOpen,
            currency: serviceInfo.currency,
            openTime: serviceTime[0].openTime,
            closeTime: serviceTime[0].closeTime,
            bookingSlots: serviceTime[0].manualCapacity,
            availableFromDate: serviceTime[0].availableFromDate,
            availableToDate:
                serviceTime[0].availableToDate === ""
                    ? null
                    : serviceTime[0].availableToDate,
        };

        try {
            if (token === null) throw new Error("Token is not found");
            await addService(insertData, token);
            localStorage.removeItem("serviceInfo");
            localStorage.removeItem("serviceTime");
            navigate(`/service/${businessId}`);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className="pr-4 pl-4 pt-6">
                <Header context={"Service Info"} />
            </div>
            <Divider sx={{ marginTop: "16px", width: "100%" }} />
            <div className="flex flex-col pr-4 pl-4">
                <div
                    style={{ marginBottom: "100px" }}
                    className="mt-4 flex flex-col gap-3">
                    <ServiceCard />
                    <TimeCard />

                    {/* <button
                style={{
                    display: "flex",
                    background: `${alpha("#020873", 0.1)}`,
                    width: "135px",
                    height: "27px",
                    fontSize: "14px",
                    borderRadius: "8px",
                }}
                className=" items-center gap-1 p-1 ">
                <AddCircleOutlineIcon sx={{ fontSize: "13px" }} />
                <div
                    className=" font-medium "
                    onClick={() => navigate("/createBusiness/4")}>
                    Add more time
                </div>
            </button> */}

                    <p className=" font-bold " style={{ fontSize: "14px" }}>
                        Service setting
                    </p>

                    <div
                        style={{ borderColor: `${alpha("#000000", 0.2)}` }}
                        className="flex justify-between p-3 text-sm border rounded-lg focus:outline-none items-center">
                        <div>Auto-approve reservations</div>
                        <PinkSwitch
                            {...label}
                            defaultChecked
                            onClick={() => setIsAutoApprove(!isAutoApprove)}
                        />
                    </div>
                    <div
                        style={{ borderColor: `${alpha("#000000", 0.2)}` }}
                        className="flex justify-between p-3 text-sm border rounded-lg focus:outline-none items-center">
                        <div>Hide the service price</div>
                        <PinkSwitch
                            {...label}
                            defaultChecked
                            onClick={() => setIsHidePrice(!isHidePrice)}
                        />
                    </div>

                    <div className="w-full flex justify-center fixed bottom-0 inset-x-0 gap-2">
                        {/* <button
                    className="border text-white mt-4 rounded-lg font-semibold mb-6"
                    style={{
                        borderColor: `${alpha("#000000", 0.2)}`,
                        color: "black",
                        width: "166px",
                        height: "51px",
                        cursor: "pointer",
                        backgroundColor: "white",
                        fontSize: "14px",
                    }}>
                    Preview
                </button> */}
                        <button
                            onClick={handleCreateService}
                            type="submit"
                            className="text-white mt-4 rounded-lg font-semibold mb-6"
                            style={{
                                // width: "166px",
                                width: "90%",
                                height: "51px",
                                cursor: "pointer",
                                backgroundColor: "#020873",
                                fontSize: "14px",
                            }}>
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
