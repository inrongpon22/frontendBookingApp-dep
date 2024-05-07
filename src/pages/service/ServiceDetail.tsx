import { alpha } from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { getServiceByServiceId } from "../../api/service";
import { Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import Header from "../business/components/Header";
import SettingServiceBtn from "./components/SettingServiceBtn";
import EditServiceInfo from "./EditServiceInfo";
import ServiceCard from "./components/ServiceCard";
import EditServiceTime from "./EditServiceTime";
import TimeCard from "./components/TimeCard";

export default function ServiceDetail() {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const { t } = useTranslation();
    const [serviceInfo, setServiceInfo] = useState<any>();

    // service Info
    const [isHideEndTime, setIsHideEndTime] = useState(false);
    const [isAutoApprove, setIsAutoApprove] = useState(false);
    const [isHidePrice, setIsHidePrice] = useState(false);
    const [isEditInfo, setIsEditInfo] = useState(false);
    const [isEditTime, setIsEditTime] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    // const [selectedIndex, setSelectedIndex] = useState(0);


    // const handleCreateService = async () => {
    //     const insertData = {
    //         businessId: Number(businessId ?? ""),
    //         title: serviceInfo.serviceName,
    //         duration: serviceTime[0].duration,
    //         description: serviceInfo.serviceDescription,
    //         price: serviceInfo.price,
    //         requireApproval: isAutoApprove,
    //         daysOpen: serviceTime[0].daysOpen,
    //         currency: serviceInfo.currency,
    //         openTime: serviceTime[0].openTime,
    //         closeTime: serviceTime[0].closeTime,
    //         bookingSlots: [
    //             {
    //                 daysOpen: serviceTime[0].daysOpen,
    //                 availableFromDate: serviceTime[0].availableFromDate,
    //                 availableToDate:
    //                     serviceTime[0].availableToDate === ""
    //                         ? null
    //                         : serviceTime[0].availableToDate,
    //                 slotsTime: serviceTime[0].manualCapacity,
    //             },
    //         ],
    //         availableFromDate: serviceTime[0].availableFromDate,
    //         availableToDate:
    //             serviceTime[0].availableToDate === ""
    //                 ? null
    //                 : serviceTime[0].availableToDate,
    //         isHidePrice: isHidePrice,
    //         isHideEndTime: isHideEndTime,
    //     };

    //     try {
    //         if (token === null) throw new Error("Token is not found");
    //         await addService(insertData, token);
    //         localStorage.removeItem("serviceInfo");
    //         localStorage.removeItem("serviceTime");
    //         navigate(`/serviceSetting/${businessId}`);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    useEffect(() => {
        const fetchService = async () => {
            try {
                if (token === null) throw new Error("Token is not found");
                const service = await getServiceByServiceId(Number(serviceId), token);
                setServiceInfo(service);
                const valueInServiceInfo = {
                    serviceName: service.title,
                    serviceDescription: service.description,
                    price: service.price,
                    currency: service.currency,
                    businessId: service.businessId,
                    isHidePrice: service.isHidePrice,
                };
                const valueServiceTime =
                    service.bookingSlots.map((slot: any) => {
                        return {
                            openTime: service.openTime.substring(0, 5),
                            closeTime: service.closeTime.substring(0, 5),
                            daysOpen: slot.daysOpen,
                            duration: service.duration,
                            availableFromDate: slot.availableFromDate,
                            availableToDate: slot.availableToDate,
                            manualCapacity: slot.slotsTime,
                        };
                    });
                localStorage.setItem("serviceTime", JSON.stringify(valueServiceTime));
                localStorage.setItem("serviceInfo", JSON.stringify(valueInServiceInfo));
                setIsAutoApprove(service.isAutoApprove);
                setIsHideEndTime(service.isHideEndTime);
                setIsHidePrice(service.isHidePrice);
            } catch (error) {
                console.log(error);
            }
        };
        fetchService();
    }, [serviceId, token, isEditInfo]);

    const handleSetEditInfo = () => {
        setIsEditInfo(!isEditInfo);
    };
    const handleSetEditTime = () => {
        setIsEditTime(!isEditTime);
    };

    return (
        <>
            {serviceInfo && (
                isEditInfo ? (
                    <>
                        <EditServiceInfo
                            serviceName={serviceInfo.title}
                            serviceDescription={serviceInfo.description}
                            price={serviceInfo.price}
                            currency={serviceInfo.currency}
                            serviceId={serviceInfo.id}
                            handleSetEditInfo={handleSetEditInfo}
                        />
                    </>
                ) : isEditTime ? (
                    <EditServiceTime
                        serviceTime={serviceInfo.bookingSlots}
                        duration={serviceInfo.duration}
                        openTime={serviceInfo.openTime}
                        closeTime={serviceInfo.closeTime}
                    />
                ) : (
                    <div>
                        <div className="pr-4 pl-4 pt-6">
                            <Header context={t("title:serviceInformation")} />
                        </div>
                        <Divider sx={{ marginTop: "16px", width: "100%" }} />
                        <div className="flex flex-col pr-4 pl-4">
                            <div
                                style={{ marginBottom: "100px" }}
                                className="mt-4 flex flex-col gap-3">

                                <ServiceCard
                                    serviceName={serviceInfo.title}
                                    serviceDescription={serviceInfo.description}
                                    price={serviceInfo.price}
                                    currency={serviceInfo.currency}
                                    handleSetEditInfo={handleSetEditInfo}
                                />
                                <TimeCard
                                    timeDetails={serviceInfo.bookingSlots}
                                    isHideEndTime={serviceInfo.isHideEndTime}
                                    handleSetEditTime={handleSetEditTime}
                                />

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
                                            navigate(`/serviceTime/${serviceInfo.businessId}`)
                                        }>
                                        Add more time
                                    </div>
                                </button>

                                <p className=" font-bold " style={{ fontSize: "14px" }}>
                                    {t("serviceSetting")}
                                </p>

                                <SettingServiceBtn
                                    isAutoApprove={isAutoApprove}
                                    isHidePrice={isHidePrice}
                                    isHideEndTime={isHideEndTime}
                                    handleAutoApprove={() => setIsAutoApprove(!isAutoApprove)}
                                    handleHidePrice={() => setIsHidePrice(!isHidePrice)}
                                    handleHideEndTime={() => setIsHideEndTime(!isHideEndTime)}
                                />


                                <div className="w-full flex justify-center fixed bottom-0 inset-x-0 gap-2">
                                    <button
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
                                    </button>
                                    <button
                                        // onClick={handleCreateService}
                                        type="submit"
                                        className="text-white mt-4 rounded-lg font-semibold mb-6"
                                        style={{
                                            width: "166px",
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
                    </div>
                )

            )}
        </>
    );
}
