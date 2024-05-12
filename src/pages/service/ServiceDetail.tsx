import { alpha } from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import {
    getServiceByServiceId,
    updateServiceShowHide,
    updateServiceTime,
} from "../../api/service";
import { Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import Header from "./components/Header";
import SettingServiceBtn from "./components/SettingServiceBtn";
import EditServiceInfo from "./EditServiceInfo";
import ServiceCard from "./components/ServiceCard";
import EditServiceTime from "./EditServiceTime";
import TimeCard from "./components/TimeCard";
import AddServiceTime from "./AddServiceTime";
import { IServiceEditTime } from "../business/interfaces/service";

interface IParams {
    serviceId: number;
    handleClose: () => void;
}

export default function ServiceDetail(props: IParams) {
    const navigate = useNavigate();
    const { businessId } = useParams();
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
    const [isAddTime, setIsAddTime] = useState(false);

    useEffect(() => {
        const fetchService = async () => {
            try {
                if (token === null) throw new Error("Token is not found");
                const service = await getServiceByServiceId(
                    Number(props.serviceId),
                    token
                );
                setServiceInfo(service);
                setIsAutoApprove(service.isAutoApprove);
                setIsHideEndTime(service.isHideEndTime);
                setIsHidePrice(service.isHidePrice);
            } catch (error) {
                console.log(error);
            }
        };
        fetchService();
    }, [props.serviceId, token]);

    const handleSetEditInfo = () => {
        setIsEditInfo(!isEditInfo);
    };
    const handleSetEditTime = () => {
        setIsEditTime(!isEditTime);
    };

    const handleAddTime = () => {
        setIsAddTime(!isAddTime);
    };

    const handleUpdateService = async () => {
        const insertData = {
            isHidePrice: isHidePrice,
            isHideEndTime: isHideEndTime,
            isAutoApprove: isAutoApprove,
        };
        await updateServiceShowHide(insertData, token || "", serviceInfo.id);
        navigate(`/service-setting/${businessId}`);
    };

    const handleDeleteServiceTime = async () => {
        const updatedTimeDetails = serviceInfo.bookingSlots.filter(
            (_item: IServiceEditTime, i: number) => i !== selectedIndex
        );
        await updateServiceTime(
            updatedTimeDetails,
            token || "",
            serviceInfo.id
        );
        setServiceInfo({
            ...serviceInfo,
            bookingSlots: updatedTimeDetails,
        });
    };

    return (
        <>
            {serviceInfo &&
                (isEditInfo ? (
                    <EditServiceInfo
                        serviceName={serviceInfo.title}
                        serviceDescription={serviceInfo.description}
                        price={serviceInfo.price}
                        currency={serviceInfo.currency}
                        serviceId={serviceInfo.id}
                        handleSetEditInfo={handleSetEditInfo}
                    />
                ) : isEditTime ? (
                    <EditServiceTime
                        serviceTime={serviceInfo.bookingSlots}
                        duration={serviceInfo.duration}
                        openTime={serviceInfo.openTime}
                        closeTime={serviceInfo.closeTime}
                        editIndex={selectedIndex}
                        serviceId={serviceInfo.id}
                        isAddTime={isAddTime}
                        handleSetEditTime={handleSetEditTime}
                    />
                ) : isAddTime ? (
                    <AddServiceTime
                        serviceTime={serviceInfo.bookingSlots}
                        duration={serviceInfo.duration}
                        openTime={serviceInfo.openTime}
                        closeTime={serviceInfo.closeTime}
                        serviceId={serviceInfo.id}
                        handleAddTime={handleAddTime}
                    />
                ) : (
                    <div>
                        <div className="pr-4 pl-4 pt-6">
                            <Header
                                context={t("title:serviceInformation")}
                                handleClose={props.handleClose}
                            />
                        </div>
                        <Divider sx={{ marginTop: "16px", width: "100%" }} />
                        <div className="flex flex-col pr-4 pl-4">
                            <div
                                className="mt-4 flex flex-col gap-3">
                                <ServiceCard
                                    serviceId={serviceInfo.id}
                                    serviceName={serviceInfo.title}
                                    serviceDescription={serviceInfo.description}
                                    price={serviceInfo.price}
                                    currency={serviceInfo.currency}
                                    handleSetEditInfo={handleSetEditInfo}
                                />

                                {serviceInfo.bookingSlots.map(
                                    (item: IServiceEditTime, index: number) => (
                                        <div key={index}>
                                            <TimeCard
                                                daysOpen={item.daysOpen}
                                                availableFromDate={
                                                    item.availableFromDate
                                                }
                                                availableToDate={
                                                    item.availableToDate
                                                }
                                                slotsTime={item.slotsTime}
                                                selectedIndex={index}
                                                handleSetEditTime={
                                                    handleSetEditTime
                                                }
                                                handleSelectIndex={(
                                                    index: number
                                                ) => setSelectedIndex(index)}
                                                handleDeleteServiceTime={
                                                    handleDeleteServiceTime
                                                }
                                            />
                                        </div>
                                    )
                                )}

                                <button
                                    style={{
                                        display: "flex",
                                        background: `${alpha("#020873", 0.1)}`,
                                        width: "135px",
                                        height: "27px",
                                        fontSize: "14px",
                                        borderRadius: "8px",
                                        justifyContent: "center",
                                    }}
                                    className=" items-center gap-1 p-1 ">
                                    <AddCircleOutlineIcon
                                        sx={{ fontSize: "13px" }}
                                    />
                                    <div
                                        className=" font-medium "
                                        onClick={handleAddTime}>
                                        {t("button:addMoreTime")}
                                    </div>
                                </button>

                                <p
                                    className=" font-bold "
                                    style={{ fontSize: "14px" }}>
                                    {t("serviceSetting")}
                                </p>

                                <SettingServiceBtn
                                    isAutoApprove={isAutoApprove}
                                    isHidePrice={isHidePrice}
                                    isHideEndTime={isHideEndTime}
                                    handleAutoApprove={() =>
                                        setIsAutoApprove(!isAutoApprove)
                                    }
                                    handleHidePrice={() =>
                                        setIsHidePrice(!isHidePrice)
                                    }
                                    handleHideEndTime={() =>
                                        setIsHideEndTime(!isHideEndTime)
                                    }
                                />

                                <div className="w-full flex justify-center bottom-0 inset-x-0 gap-2">
                                    <button
                                        className="border text-white mt-4 rounded-lg font-semibold"
                                        style={{
                                            borderColor: `${alpha(
                                                "#000000",
                                                0.2
                                            )}`,
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
                                        onClick={handleUpdateService}
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
                ))}
        </>
    );
}
