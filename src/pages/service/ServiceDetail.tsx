import { alpha, Drawer } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useEffect, useState } from "react";
import { updateService } from "../../api/service";
import { Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import Header from "./components/Header";
import SettingServiceBtn from "./components/SettingServiceBtn";
import EditServiceInfo from "./EditServiceInfo";
import ServiceCard from "./components/ServiceCard";
import EditServiceTime from "./EditServiceTime";
import TimeCard from "./components/TimeCard";
import AddServiceTime from "./AddServiceTime";
import useSWR from "swr";
import { app_api, fetcher } from "../../helper/url";
import Loading from "../../components/dialog/Loading";
import { useParams } from "react-router-dom";
import ConfirmCard from "../../components/dialog/ConfirmCard";
import { Anchor } from "./ServiceSetting";
import BusinessPreview from "./BusinessPreview";
import {
    IServiceInfo,
    IServiceEditTime,
} from "../../interfaces/services/Iservice";

interface IParams {
    serviceId: number;
    handleClose?: () => void;
    serviceMutate?: () => void;
}

export default function ServiceDetail(props: IParams) {
    const token = localStorage.getItem("token");
    const { businessId } = useParams();
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
    const [modifyServiceInfo, setModifyServiceInfo] = useState<IServiceInfo>(); // for update service info
    const [modifyServiceTime, setModifyServiceTime] =
        useState<IServiceEditTime[]>(); // for update service time
    const [openConfirm, setOpenConfirm] = useState(false);
    const {
        data: serviceInfo,
        isLoading: serviceLoading,
        mutate: serviceMutate,
    } = useSWR<any>(
        `${app_api}/getServiceByServiceId/${props.serviceId}`,
        fetcher
    );
    const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    useEffect(
        () => {
            if (serviceInfo) {
                setModifyServiceInfo({
                    serviceName: serviceInfo.title,
                    serviceDescription: serviceInfo.description,
                    price: serviceInfo.price,
                    currency: serviceInfo.currency,
                });
                setModifyServiceTime(serviceInfo.bookingSlots);
                setIsHideEndTime(serviceInfo.isHideEndTime);
                setIsAutoApprove(serviceInfo.isAutoApprove);
                setIsHidePrice(serviceInfo.isHidePrice);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [serviceLoading]
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
            title: modifyServiceInfo?.serviceName,
            description: modifyServiceInfo?.serviceDescription,
            price: modifyServiceInfo?.price,
            currency: modifyServiceInfo?.currency,
            bookingSlots: modifyServiceTime,
            isAutoApprove: isAutoApprove,
            isHidePrice: isHidePrice,
            isHideEndTime: isHideEndTime,
            businessId: Number(businessId),
        };

        await updateService(serviceInfo.id, insertData, token || "");
        props.serviceMutate && props.serviceMutate();
        serviceMutate();
        props.handleClose && props.handleClose();
    };

    const handleDeleteServiceTime = async () => {
        const updatedTimeDetails = serviceInfo.bookingSlots.filter(
            (_item: IServiceEditTime, i: number) => i !== selectedIndex
        );
        setModifyServiceTime(updatedTimeDetails);
        serviceMutate();
    };

    const handleSetServiceInfo = (serviceInFo: IServiceInfo) => {
        setModifyServiceInfo(serviceInFo);
    };
    const handleSetServiceTime = (serviceTime: IServiceEditTime[]) => {
        setModifyServiceTime(serviceTime);
    };

    const toggleDrawer =
        (anchor: Anchor, open: boolean) =>
        (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event.type === "keydown" &&
                ((event as React.KeyboardEvent).key === "Tab" ||
                    (event as React.KeyboardEvent).key === "Shift")
            ) {
                return;
            }
            setState({ ...state, [anchor]: open });
        };

    const handleIsModifiedData = () => {
        return (
            JSON.stringify({
                title: serviceInfo.title,
                description: serviceInfo.description,
                price: serviceInfo.price,
                currency: serviceInfo.currency,
                bookingSlots: serviceInfo.bookingSlots,
                isAutoApprove: serviceInfo.isAutoApprove,
                isHidePrice: serviceInfo.isHidePrice,
                isHideEndTime: serviceInfo.isHideEndTime,
            }) !==
            JSON.stringify({
                title: modifyServiceInfo?.serviceName,
                description: modifyServiceInfo?.serviceDescription,
                price: modifyServiceInfo?.price,
                currency: modifyServiceInfo?.currency,
                bookingSlots: modifyServiceTime,
                isAutoApprove: isAutoApprove,
                isHidePrice: isHidePrice,
                isHideEndTime: isHideEndTime,
            })
        );
    };

    const handleCloseCardDetail = () => {
        if (handleIsModifiedData()) {
            setOpenConfirm(true);
        } else {
            props.handleClose && props.handleClose();
        }
    };

    const handleConfirmClose = () => {
        setOpenConfirm(false);
        props.handleClose && props.handleClose();
    };

    const previewService = () => (
        <BusinessPreview
            businessId={Number(businessId)}
            title={modifyServiceInfo?.serviceName ?? ""}
            description={modifyServiceInfo?.serviceDescription ?? ""}
            price={modifyServiceInfo?.price ?? 0}
            isAutoApprove={isAutoApprove}
            currency={modifyServiceInfo?.currency ?? ""}
            bookingSlots={modifyServiceTime ?? []}
            availableFromDate={""}
            availableToDate={""}
            isHidePrice={isHidePrice}
            isHideEndTime={isHideEndTime}
            handleClose={() => setState({ ...state, bottom: false })}
        />
    );

    return (
        <>
            <Drawer
                anchor={"bottom"}
                open={state["bottom"]}
                onClose={toggleDrawer("bottom", false)}>
                {previewService()}
            </Drawer>
            <ConfirmCard
                open={openConfirm}
                handleClose={() => setOpenConfirm(false)}
                handleConfirm={handleConfirmClose}
                title={t("title:discardChanges")}
                description={t("desc:discardChanges")}
                bntConfirm={t("button:discard")}
                bntBack={t("button:back")}
            />
            <Loading openLoading={serviceLoading} />
            {modifyServiceInfo &&
                (isEditInfo ? (
                    <EditServiceInfo
                        serviceName={modifyServiceInfo.serviceName}
                        serviceDescription={
                            modifyServiceInfo.serviceDescription
                        }
                        price={modifyServiceInfo.price}
                        currency={modifyServiceInfo.currency}
                        handleSetEditInfo={handleSetEditInfo}
                        serviceMutate={serviceMutate}
                        handleSetServiceInfo={handleSetServiceInfo}
                    />
                ) : isEditTime ? (
                    <EditServiceTime
                        serviceTime={modifyServiceTime ?? []}
                        openTime={serviceInfo.openTime}
                        closeTime={serviceInfo.closeTime}
                        editIndex={selectedIndex}
                        isAddTime={isAddTime}
                        handleSetEditTime={handleSetEditTime}
                        handleSetServiceTime={handleSetServiceTime}
                    />
                ) : isAddTime ? (
                    <AddServiceTime
                        serviceTime={serviceInfo.bookingSlots}
                        handleAddTime={handleAddTime}
                    />
                ) : (
                    <div
                        className={`w-full sm:w-auto md:w-full lg:w-auto xl:w-full overflow-x-hidden`}
                        style={{ width: "100vw" }}>
                        <div className="pr-4 pl-4 pt-6">
                            <Header
                                context={t("title:serviceInformation")}
                                handleClose={handleCloseCardDetail}
                            />
                        </div>
                        <Divider sx={{ marginTop: "16px", width: "100%" }} />
                        <div className="flex flex-col pr-4 pl-4">
                            <div className="mt-4 flex flex-col gap-3">
                                <ServiceCard
                                    serviceId={serviceInfo.id}
                                    serviceName={modifyServiceInfo.serviceName}
                                    serviceDescription={
                                        modifyServiceInfo.serviceDescription
                                    }
                                    price={modifyServiceInfo.price}
                                    currency={modifyServiceInfo.currency}
                                    handleSetEditInfo={handleSetEditInfo}
                                />

                                {modifyServiceTime &&
                                    modifyServiceTime.map(
                                        (
                                            item: IServiceEditTime,
                                            index: number
                                        ) => (
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
                                                    ) =>
                                                        setSelectedIndex(index)
                                                    }
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
                                        {t("button:addServiceTime")}
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
                                        onClick={toggleDrawer("bottom", true)}>
                                        {t("button:preview")}
                                    </button>
                                    <button
                                        onClick={handleUpdateService}
                                        type="submit"
                                        className="w-1/2 p-3 text-white bg-deep-blue rounded-lg font-semibold">
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
