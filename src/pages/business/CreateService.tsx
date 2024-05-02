import { alpha } from "@mui/material";
import ServiceCard from "./components/ServiceCard";
import TimeCard from "./components/TimeCard";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { IServiceInfo, IServiceTime } from "./interfaces/service";
import { addService } from "../../api/service";
import Header from "./components/Header";
import { Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ToggleButton as MuiToggleButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

export default function CreateService() {
    const { businessId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const { t } = useTranslation();
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
    const [isHideEndTime, setIsHideEndTime] = useState(false);

    const [isAutoApprove, setIsAutoApprove] = useState(false);
    const [isHidePrice, setIsHidePrice] = useState(false);

    const handleCreateService = async () => {
        const insertData = {
            businessId: Number(businessId ?? ""),
            title: serviceInfo.serviceName,
            duration: serviceTime[0].duration,
            description: serviceInfo.serviceDescription,
            price: serviceInfo.price,
            requireApproval: isAutoApprove,
            daysOpen: serviceTime[0].daysOpen,
            currency: serviceInfo.currency,
            openTime: serviceTime[0].openTime,
            closeTime: serviceTime[0].closeTime,
            bookingSlots: [
                {
                    daysOpen: serviceTime[0].daysOpen,
                    availableFromDate: serviceTime[0].availableFromDate,
                    availableToDate:
                        serviceTime[0].availableToDate === ""
                            ? null
                            : serviceTime[0].availableToDate,
                    slotsTime: serviceTime[0].manualCapacity,
                },
            ],
            availableFromDate: serviceTime[0].availableFromDate,
            availableToDate:
                serviceTime[0].availableToDate === ""
                    ? null
                    : serviceTime[0].availableToDate,
            isHidePrice: isHidePrice,
            isHideEndTime: isHideEndTime,
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
                <Header context={t("title:serviceInformation")} />
            </div>
            <Divider sx={{ marginTop: "16px", width: "100%" }} />
            <div className="flex flex-col pr-4 pl-4">
                <div
                    style={{ marginBottom: "100px" }}
                    className="mt-4 flex flex-col gap-3">
                    <ServiceCard />
                    <TimeCard />

                    <button
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
                            onClick={() =>
                                navigate(`/serviceTime/${businessId}`)
                            }>
                            Add more time
                        </div>
                    </button>

                    <p className=" font-bold " style={{ fontSize: "14px" }}>
                        {t("serviceSetting")}
                    </p>

                    <div
                        style={{ borderColor: `${alpha("#000000", 0.2)}` }}
                        className="flex justify-between p-3 text-sm border rounded-lg focus:outline-none items-center">
                        <div>{t("isAutoApprove")}</div>
                        <MuiToggleButton
                            value={isAutoApprove}
                            aria-label="Toggle switch"
                            onClick={() => setIsAutoApprove(!isAutoApprove)}
                            sx={{
                                width: 49, height: 28, borderRadius: 16, backgroundColor: isAutoApprove ? '#020873' : '#ffffff',
                                border: isAutoApprove ? '2px solid #020873' : '2px solid  #9E9E9E', ":focus"
                                    : { outline: "none" }, ":hover": { backgroundColor: isAutoApprove ? '#020873' : '#ffffff' }
                            }}
                        >
                            <span
                                style={{
                                    width: 23, height: 23, marginLeft: isAutoApprove ? '' : "1px", marginRight: isAutoApprove ? '100px' : " ",
                                    backgroundColor: isAutoApprove ? '#ffffff' : '#9E9E9E', color: isAutoApprove ? '#020873' : '#ffffff', borderRadius: "50%"
                                }}
                                className={`absolute left-0 rounded-full 
                                shadow-md flex items-center justify-center transition-transform duration-300 ${isAutoApprove ? 'transform translate-x-full' : ''
                                    }`}
                            >
                                {isAutoApprove ? <CheckIcon sx={{ fontSize: "14px" }} /> : <CloseIcon sx={{ fontSize: "14px" }} />}
                            </span>
                        </MuiToggleButton>
                    </div>
                    <div
                        style={{ borderColor: `${alpha("#000000", 0.2)}` }}
                        className="flex justify-between p-3 text-sm border rounded-lg focus:outline-none items-center">
                        <div>{t("isHideServPrice")}</div>
                        <MuiToggleButton
                            value={isHidePrice}
                            aria-label="Toggle switch"
                            onClick={() => setIsHidePrice(!isHidePrice)}
                            sx={{
                                width: 49, height: 28, borderRadius: 16, backgroundColor: isHidePrice ? '#020873' : '#ffffff',
                                border: isHidePrice ? '2px solid #020873' : '2px solid  #9E9E9E', ":focus"
                                    : { outline: "none" }, ":hover": { backgroundColor: isHidePrice ? '#020873' : '#ffffff' }
                            }}
                        >
                            <span
                                style={{
                                    width: 23, height: 23, marginLeft: isHidePrice ? '' : "1px", marginRight: isHidePrice ? '100px' : " ",
                                    backgroundColor: isHidePrice ? '#ffffff' : '#9E9E9E', color: isHidePrice ? '#020873' : '#ffffff', borderRadius: "50%"
                                }}
                                className={`absolute left-0 rounded-full 
                                shadow-md flex items-center justify-center transition-transform duration-300 ${isHidePrice ? 'transform translate-x-full' : ''
                                    }`}
                            >
                                {isHidePrice ? <CheckIcon sx={{ fontSize: "14px" }} /> : <CloseIcon sx={{ fontSize: "14px" }} />}
                            </span>
                        </MuiToggleButton>
                    </div>

                    <div
                        style={{ borderColor: `${alpha("#000000", 0.2)}` }}
                        className="flex justify-between p-3 text-sm border rounded-lg focus:outline-none items-center">
                        <div>{t("isHideEndDate")}</div>
                        <MuiToggleButton
                            value={isHideEndTime}
                            aria-label="Toggle switch"
                            onChange={() => setIsHideEndTime(!isHideEndTime)}
                            sx={{
                                width: 49, height: 28, borderRadius: 16, backgroundColor: isHideEndTime ? '#020873' : '#ffffff',
                                border: isHideEndTime ? '2px solid #020873' : '2px solid  #9E9E9E', ":focus"
                                    : { outline: "none" }, ":hover": { backgroundColor: isHideEndTime ? '#020873' : '#ffffff' }
                            }}
                        >
                            <span
                                style={{
                                    width: 23, height: 23, marginLeft: isHideEndTime ? '' : "1px", marginRight: isHideEndTime ? '100px' : " ",
                                    backgroundColor: isHideEndTime ? '#ffffff' : '#9E9E9E', color: isHideEndTime ? '#020873' : '#ffffff', borderRadius: "50%"
                                }}
                                className={`absolute left-0 rounded-full 
                                shadow-md flex items-center justify-center transition-transform duration-300 ${isHideEndTime ? 'transform translate-x-full' : ''
                                    }`}
                            >
                                {isHideEndTime ? <CheckIcon sx={{ fontSize: "14px" }} /> : <CloseIcon sx={{ fontSize: "14px" }} />}
                            </span>
                        </MuiToggleButton>
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
                            {t("button:confirm")}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
