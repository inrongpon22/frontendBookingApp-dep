import { alpha } from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useState } from "react";

import { updateServiceShowHide, updateServiceTime } from "../../api/service";
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
import useSWR from "swr";
import { app_api, fetcher } from "../../helper/url";
import Loading from "../../components/dialog/Loading";

interface IParams {
    serviceId: number;
    handleClose?: () => void;
    serviceMutate?: () => void;
}

export default function ServiceDetail(props: IParams) {
    const token = localStorage.getItem("token");
    const { t } = useTranslation();

    // console.log(serviceInfo)

    // service Info
    const [isHideEndTime, setIsHideEndTime] = useState(false);
    const [isAutoApprove, setIsAutoApprove] = useState(false);
    const [isHidePrice, setIsHidePrice] = useState(false);
    const [isEditInfo, setIsEditInfo] = useState(false);
    const [isEditTime, setIsEditTime] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isAddTime, setIsAddTime] = useState(false);
    const {
        data: serviceInfo,
        isLoading: serviceLoading,
        // error: serviceError,
        mutate: serviceMutate,
    } = useSWR<any>(
        `${app_api}/getServiceByServiceId/${props.serviceId}`,
        fetcher
    );

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
        props.serviceMutate && props.serviceMutate();
        props.handleClose && props.handleClose();
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
        serviceMutate();
        // setServiceInfo({
        //     ...serviceInfo,
        //     bookingSlots: updatedTimeDetails,
        // });
    };

    return (
        <>
            <Loading openLoading={serviceLoading} />
            {serviceInfo &&
                (isEditInfo ? (
                    <EditServiceInfo
                        serviceName={serviceInfo.title}
                        serviceDescription={serviceInfo.description}
                        price={serviceInfo.price}
                        currency={serviceInfo.currency}
                        serviceId={serviceInfo.id}
                        handleSetEditInfo={handleSetEditInfo}
                        serviceMutate={serviceMutate}
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
                        serviceMutate={serviceMutate}
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
                    <div
                        className={`w-full sm:w-auto md:w-full lg:w-auto xl:w-full overflow-x-hidden`}
                        style={{ width: "100vw" }}>
                        <div className="pr-4 pl-4 pt-6">
                            <Header
                                context={t("title:serviceInformation")}
                                handleClose={props.handleClose}
                            />
                        </div>
                        <Divider sx={{ marginTop: "16px", width: "100%" }} />
                        <div className="flex flex-col pr-4 pl-4">
                            <div className="mt-4 flex flex-col gap-3">
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

                                <div className="w-full flex justify-center gap-2 my-5">
                                    <button
                                        className="w-1/2 p-3 border text-deep-blue border-deep-blue rounded-lg font-semibold"
                                        onClick={() => navigate("/business-preview")}
                                        >
                                        Preview
                                    </button>
                                    <button
                                        onClick={handleUpdateService}
                                        type="submit"
                                        className="w-1/2 p-3 text-white bg-deep-blue rounded-lg font-semibold"
                                        >
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
