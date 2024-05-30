import { useContext, useEffect, useState } from "react";
import { addService, updateService } from "../../api/service";
import { Divider, alpha } from "@mui/material";
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
import { useNavigate, useParams } from "react-router-dom";
import ConfirmCard from "../../components/dialog/ConfirmCard";
import BusinessPreview from "./BusinessPreview";
import {
    IServiceInfo,
    IServiceEditTime,
    IServiceByServiceId,
} from "../../interfaces/services/Iservice";
import { GlobalContext } from "../../contexts/BusinessContext";
import toast from "react-hot-toast";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AddServiceInfo from "./AddServiceInfo";
import { IBusinessesById } from "../../interfaces/business";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

interface IParams {
    serviceId: number;
    handleClose?: () => void;
    serviceMutate?: () => void;
}

export default function ServiceDetail(props: IParams) {
    const token = localStorage.getItem("token");
    const { businessId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get("type");

    const { setShowDialog, setDialogState } = useContext(GlobalContext);

    // service Info
    const [isHideEndTime, setIsHideEndTime] = useState(false);
    const [isAutoApprove, setIsAutoApprove] = useState(false);
    const [isHidePrice, setIsHidePrice] = useState(false);
    const [isEditInfo, setIsEditInfo] = useState(false);
    const [isEditTime, setIsEditTime] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isAddTime, setIsAddTime] = useState(false);
    const [isOpenPreview, setIsOpenPreview] = useState(false);
    const [isCreateService, setIsCreateService] = useState(true);
    const [isCloseServiceCard, setIsCloseServiceCard] = useState(false);
    const [isCloseCard, setIsCloseCard] = useState(false);
    const [modifyServiceInfo, setModifyServiceInfo] = useState<IServiceInfo>(); // for update service info
    const [modifyServiceTime, setModifyServiceTime] = useState<
        IServiceEditTime[]
    >([]); // for update service time
    const [openConfirm, setOpenConfirm] = useState(false);
    const {
        data: serviceInfo,
        isLoading: serviceLoading,
        mutate: serviceMutate,
    } = useSWR<IServiceByServiceId>(
        `${app_api}/getServiceByServiceId/${props.serviceId}`,
        fetcher
    );
    const { data: businessData } = useSWR<IBusinessesById>(
        businessId && `${app_api}/business/${businessId}`,
        fetcher
    );

    useEffect(
        () => {
            if (!type) {
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
    const handleOpenPreview = () => {
        setIsOpenPreview(!isOpenPreview);
    };
    const handleOpenServiceInfo = () => {
        setIsCreateService(!isCreateService);
    };

    const handleDeleteServiceTime = async () => {
        if (type) {
            const updatedTimeDetails = modifyServiceTime.filter(
                (_item: IServiceEditTime, i: number) => i !== selectedIndex
            );
            setModifyServiceTime(updatedTimeDetails);
            if (updatedTimeDetails.length === 0) {
                setIsAddTime(true);
            } else {
                setSelectedIndex(updatedTimeDetails.length - 1);
            }
        } else {
            if (serviceInfo) {
                const updatedTimeDetails = serviceInfo.bookingSlots.filter(
                    (_item: IServiceEditTime, i: number) => i !== selectedIndex
                );
                setModifyServiceTime(updatedTimeDetails);
                if (updatedTimeDetails.length === 0) {
                    setIsAddTime(true);
                } else {
                    setSelectedIndex(updatedTimeDetails.length - 1);
                    serviceMutate();
                }
            }
        }
    };

    const handleSetServiceInfo = (serviceInFo: IServiceInfo) => {
        setModifyServiceInfo(serviceInFo);
    };
    const handleSetServiceTime = (serviceTime: IServiceEditTime[]) => {
        setModifyServiceTime(serviceTime);
    };

    const handleIsModifiedData = () => {
        if (serviceInfo) {
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
        }
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

    const ismodifyServiceInfoUndefined = () => {
        return (
            modifyServiceInfo?.serviceName === undefined ||
            modifyServiceInfo?.serviceDescription === undefined ||
            modifyServiceInfo?.price === undefined ||
            modifyServiceInfo?.currency === undefined
        );
    };

    const handleCreateUpdateService = async () => {
        if (
            type &&
            modifyServiceInfo &&
            modifyServiceTime &&
            token &&
            businessData
        ) {
            const insertData = {
                businessId: Number(businessId ?? ""),
                title: modifyServiceInfo.serviceName,
                description: modifyServiceInfo.serviceDescription,
                price: modifyServiceInfo.price,
                isAutoApprove: isAutoApprove,
                currency: modifyServiceInfo.currency,
                openTime: businessData.openTime.substring(0, 5),
                closeTime: businessData.closeTime.substring(0, 5),
                bookingSlots: modifyServiceTime.map((time) => ({
                    daysOpen: time.daysOpen,
                    availableFromDate: time.availableFromDate,
                    availableToDate:
                        time.availableToDate === ""
                            ? null
                            : time.availableToDate,
                    slotsTime: time.slotsTime,
                    duration: time.duration,
                    isLimitBooking: time.isLimitBooking,
                    maximumAllow: time.isLimitBooking ? time.maximumAllow : 0,
                })),
                availableFromDate: modifyServiceTime[0].availableFromDate,
                availableToDate:
                    modifyServiceTime[0].availableToDate === ""
                        ? null
                        : modifyServiceTime[0].availableToDate,
                isHidePrice: isHidePrice,
                isHideEndTime: isHideEndTime,
            };
            await addService(insertData, token).then(() => {
                props.serviceMutate && props.serviceMutate();
                localStorage.removeItem("serviceInfo");
                localStorage.removeItem("serviceTime");
                toast(t("addService"), {
                    icon: <CheckCircleOutlineIcon sx={{ color: "green" }} />,
                });
                if (type && type == "create") {
                    navigate(`/business-profile/${businessId}`);
                } else {
                    navigate(`/service-setting/${businessId}`);
                }
            });
        } else {
            if (
                serviceInfo &&
                modifyServiceInfo &&
                modifyServiceTime &&
                token &&
                businessData
            ) {
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
                await updateService(serviceInfo.id, insertData, token);
                setShowDialog(false);
                toast(t("editSuccess"), {
                    icon: <CheckCircleOutlineIcon sx={{ color: "green" }} />,
                });
                setDialogState("phone-input");
                props.serviceMutate && props.serviceMutate();
                serviceMutate();
                props.handleClose && props.handleClose();
            }
        }
    };

    const mergeDayOpen = (dayOpen: string[]) => {
        return dayOpen.join(",");
    };

    const dayOfOpenLength = modifyServiceTime?.flatMap((time) =>
        mergeDayOpen(time.daysOpen).split(",")
    ).length;

    return (
        <>
            <ConfirmCard
                open={openConfirm}
                handleClose={() => setOpenConfirm(false)}
                handleConfirm={handleConfirmClose}
                title={t("title:discardChanges")}
                description={t("desc:discardChanges")}
                bntConfirm={t("button:discard")}
                bntBack={t("button:back")}
            />
            {type ? (
                isAddTime ? (
                    <AddServiceTime
                        isClose={isCloseServiceCard}
                        isAddServiceTime={isAddTime}
                        serviceTime={modifyServiceTime ?? []}
                        handleAddTime={handleAddTime}
                        handleCloseCreateService={handleOpenServiceInfo}
                    />
                ) : isCreateService ? (
                    <AddServiceInfo
                        serviceInfo={modifyServiceInfo}
                        isClose={isCloseCard}
                        isEdit={isEditInfo}
                        handleAddTime={handleAddTime}
                        handleSetServiceInfo={handleSetServiceInfo}
                        handleClose={() => {
                            handleOpenServiceInfo();
                            setIsCloseCard(false);
                        }}
                    />
                ) : isOpenPreview ? (
                    <>
                        <BusinessPreview
                            businessId={Number(businessId)}
                            title={modifyServiceInfo?.serviceName ?? ""}
                            description={
                                modifyServiceInfo?.serviceDescription ?? ""
                            }
                            price={modifyServiceInfo?.price ?? 0}
                            isAutoApprove={isAutoApprove}
                            currency={modifyServiceInfo?.currency ?? ""}
                            bookingSlots={modifyServiceTime ?? []}
                            availableFromDate={""}
                            availableToDate={""}
                            isHidePrice={isHidePrice}
                            isHideEndTime={isHideEndTime}
                            handleClose={handleOpenPreview}
                        />
                    </>
                ) : isEditTime ? (
                    modifyServiceTime && (
                        <EditServiceTime
                            serviceTime={modifyServiceTime}
                            openTime={
                                modifyServiceTime[selectedIndex].slotsTime[0]
                                    .startTime
                            }
                            closeTime={
                                modifyServiceTime[selectedIndex].slotsTime[
                                    modifyServiceTime[selectedIndex].slotsTime
                                        .length - 1
                                ].endTime
                            }
                            editIndex={selectedIndex}
                            isAddTime={isAddTime}
                            isClose={isCloseServiceCard}
                            handleSetEditTime={() => {
                                handleSetEditTime();
                                setIsCloseServiceCard(false);
                            }}
                            handleSetServiceTime={handleSetServiceTime}
                            handleCloseCreateService={handleOpenServiceInfo}
                        />
                    )
                ) : (
                    <div
                        className={`w-full sm:w-auto md:w-full lg:w-auto xl:w-full overflow-x-hidden`}
                        style={{ width: "100vw" }}>
                        <div className="pr-4 pl-4 pt-6">
                            <Header
                                isClose={false}
                                context={t("title:serviceInformation")}
                                handleClose={handleSetEditTime}
                            />
                        </div>
                        <Divider sx={{ marginTop: "16px", width: "100%" }} />
                        <div className="flex flex-col pr-4 pl-4 mb-[80px]">
                            <div className="mt-4 flex flex-col gap-3">
                                {modifyServiceInfo && (
                                    <ServiceCard
                                        serviceName={
                                            modifyServiceInfo.serviceName
                                        }
                                        serviceDescription={
                                            modifyServiceInfo.serviceDescription
                                        }
                                        price={modifyServiceInfo.price}
                                        currency={modifyServiceInfo.currency}
                                        handleSetEditInfo={() => {
                                            handleOpenServiceInfo();
                                            setIsEditInfo(true);
                                            setIsCloseCard(true);
                                        }}
                                    />
                                )}
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
                                                        item.availableToDate ??
                                                        ""
                                                    }
                                                    slotsTime={item.slotsTime}
                                                    selectedIndex={index}
                                                    handleSetEditTime={() => {
                                                        handleSetEditTime();
                                                        setIsCloseServiceCard(
                                                            true
                                                        );
                                                    }}
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
                                    disabled={dayOfOpenLength === 7}
                                    style={{
                                        display: "flex",
                                        background:
                                            dayOfOpenLength === 7
                                                ? `${alpha("#CCCCCC", 0.3)}`
                                                : `${alpha("#020873", 0.1)}`,
                                        width: "135px",
                                        height: "27px",
                                        fontSize: "14px",
                                        borderRadius: "8px",
                                        justifyContent: "center",
                                        color:
                                            dayOfOpenLength === 7
                                                ? `${alpha("#020873", 0.3)}`
                                                : `${alpha("#020873", 1)}`,
                                    }}
                                    onClick={() => {
                                        handleAddTime();
                                        setIsCloseServiceCard(true);
                                    }}
                                    className={`items-center gap-1 p-1`}>
                                    <AddCircleOutlineIcon
                                        sx={{ fontSize: "13px" }}
                                    />
                                    <div className=" font-medium ">
                                        {t("button:addServiceTime")}
                                    </div>
                                </button>

                                <SettingServiceBtn
                                    modifyServiceInfo={modifyServiceInfo}
                                    modufyServiceTime={modifyServiceTime}
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
                                    handleUpdateService={
                                        handleCreateUpdateService
                                    }
                                    handleOpenPreview={handleOpenPreview}
                                />
                            </div>
                        </div>
                    </div>
                )
            ) : (
                <>
                    <Loading openLoading={serviceLoading} />
                    {!ismodifyServiceInfoUndefined() &&
                        modifyServiceInfo &&
                        serviceInfo &&
                        (isEditInfo ? (
                            modifyServiceInfo && (
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
                            )
                        ) : isEditTime ? (
                            modifyServiceTime && (
                                <EditServiceTime
                                    serviceTime={modifyServiceTime}
                                    openTime={
                                        modifyServiceTime[selectedIndex]
                                            .slotsTime[0].startTime
                                    }
                                    closeTime={
                                        modifyServiceTime[selectedIndex]
                                            .slotsTime[
                                            modifyServiceTime[selectedIndex]
                                                .slotsTime.length - 1
                                        ].endTime
                                    }
                                    editIndex={selectedIndex}
                                    isAddTime={isAddTime}
                                    isClose={true}
                                    handleSetEditTime={handleSetEditTime}
                                    handleSetServiceTime={handleSetServiceTime}
                                />
                            )
                        ) : isAddTime ? (
                            <AddServiceTime
                                isClose={true}
                                isAddServiceTime={false}
                                serviceTime={serviceInfo.bookingSlots}
                                handleAddTime={handleAddTime}
                            />
                        ) : isOpenPreview ? (
                            <>
                                <BusinessPreview
                                    businessId={Number(businessId)}
                                    title={modifyServiceInfo?.serviceName ?? ""}
                                    description={
                                        modifyServiceInfo?.serviceDescription ??
                                        ""
                                    }
                                    price={modifyServiceInfo?.price ?? 0}
                                    isAutoApprove={isAutoApprove}
                                    currency={modifyServiceInfo?.currency ?? ""}
                                    bookingSlots={modifyServiceTime ?? []}
                                    availableFromDate={""}
                                    availableToDate={""}
                                    isHidePrice={isHidePrice}
                                    isHideEndTime={isHideEndTime}
                                    handleClose={handleOpenPreview}
                                />
                            </>
                        ) : (
                            <div
                                className={`w-full sm:w-auto md:w-full lg:w-auto xl:w-full overflow-x-hidden`}
                                style={{ width: "100vw" }}>
                                <div className="pr-4 pl-4 pt-6">
                                    <Header
                                        isClose={false}
                                        context={t("title:serviceInformation")}
                                        handleClose={handleCloseCardDetail}
                                    />
                                </div>
                                <Divider
                                    sx={{ marginTop: "16px", width: "100%" }}
                                />
                                <div className="flex flex-col pr-4 pl-4 mb-[80px]">
                                    <div className="mt-4 flex flex-col gap-3">
                                        <ServiceCard
                                            serviceId={serviceInfo.id}
                                            serviceName={
                                                modifyServiceInfo.serviceName
                                            }
                                            serviceDescription={
                                                modifyServiceInfo.serviceDescription
                                            }
                                            price={modifyServiceInfo.price}
                                            currency={
                                                modifyServiceInfo.currency
                                            }
                                            handleSetEditInfo={
                                                handleSetEditInfo
                                            }
                                            handleCloseAfterDelete={
                                                props.handleClose &&
                                                props.handleClose
                                            }
                                        />

                                        {modifyServiceTime &&
                                            modifyServiceTime.map(
                                                (
                                                    item: IServiceEditTime,
                                                    index: number
                                                ) => (
                                                    <div key={index}>
                                                        <TimeCard
                                                            daysOpen={
                                                                item.daysOpen
                                                            }
                                                            availableFromDate={
                                                                item.availableFromDate
                                                            }
                                                            availableToDate={
                                                                item.availableToDate ??
                                                                ""
                                                            }
                                                            slotsTime={
                                                                item.slotsTime
                                                            }
                                                            selectedIndex={
                                                                index
                                                            }
                                                            handleSetEditTime={
                                                                handleSetEditTime
                                                            }
                                                            handleSelectIndex={(
                                                                index: number
                                                            ) =>
                                                                setSelectedIndex(
                                                                    index
                                                                )
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
                                                background: `${alpha(
                                                    "#020873",
                                                    0.1
                                                )}`,
                                                width: "135px",
                                                height: "27px",
                                                fontSize: "14px",
                                                borderRadius: "8px",
                                                justifyContent: "center",
                                            }}
                                            onClick={handleAddTime}
                                            className=" items-center gap-1 p-1 ">
                                            <AddCircleOutlineIcon
                                                sx={{ fontSize: "13px" }}
                                            />
                                            <div className=" font-medium ">
                                                {t("button:addServiceTime")}
                                            </div>
                                        </button>

                                        <SettingServiceBtn
                                            modifyServiceInfo={
                                                modifyServiceInfo
                                            }
                                            modufyServiceTime={
                                                modifyServiceTime
                                            }
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
                                            handleUpdateService={
                                                handleCreateUpdateService
                                            }
                                            handleOpenPreview={
                                                handleOpenPreview
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                </>
            )}
        </>
    );
}
