import { useTranslation } from "react-i18next";
import Header from "./components/Header";
import { alpha } from "@mui/material";
import ListServiceCard from "./components/ListServiceCard";
import { useParams } from "react-router-dom";
import { useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import React from "react";
import ServiceInfo from "../business/ServiceInfo";
import ServiceDetail from "./ServiceDetail";
import { SwipeableList, SwipeableListItem, Type } from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import useSWR from "swr";
import { app_api, fetcher } from "../../helper/url";
import Loading from "../../components/dialog/Loading";
export type Anchor = "top" | "left" | "bottom" | "right";
import { trailingActions } from "./components/swipeable-list";
import { IService } from "../../interfaces/services/Iservice";

export default function ServiceSetting() {
    const { businessId } = useParams();
    const { t } = useTranslation();
    // const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [selectedId, setSelectedId] = useState<number>(0);
    const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    const [open, setOpen] = useState(false);
    const [isEditService, setIsEditService] = useState(false);

    const {
        data: serviceData,
        isLoading: serviceLoading,
        // error: serviceError,
        mutate: serviceMutate,
    } = useSWR<IService[]>(
        businessId && `${app_api}/getListServiceByBusinessId/${businessId}`,
        fetcher
    );

    const mergeDayOpen = () => {
        const dayOpen: string[] = []; // Initialize dayOpen as an empty array
        serviceData &&
            serviceData.map((item) => {
                item.bookingSlots?.map((slot) => {
                    slot.daysOpen.map((day: string) => {
                        dayOpen.push(day);
                    });
                });
            });
        return dayOpen;
    };

    const handleOpenConfirm = (serviceId: number) => {
        setSelectedId(serviceId);
        setOpen(true);
    };
    const handleCloseConfirm = () => setOpen(false);

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

    const addService = (anchor: Anchor) => (
        <Box
            sx={{
                width: anchor === "top" || anchor === "bottom" ? "auto" : 250,
                height: "100vh",
            }}
            role="presentation">
            <ServiceInfo
                isClose={true}
                isEdit={false}
                handleClose={toggleDrawer("bottom", false)}
                handleCloseFromEdit={() =>
                    setState({ ...state, [anchor]: false })
                }
                serviceMutate={serviceMutate}
            />
        </Box>
    );

    const handleSelectService = (serviceId: number) => {
        setSelectedId(serviceId);
        setIsEditService(true);
    };

    return (
        <>
            {isEditService ? (
                <ServiceDetail
                    serviceId={selectedId}
                    handleClose={() => setIsEditService(false)}
                    serviceMutate={serviceMutate}
                />
            ) : (
                <div className=" overflow-y-hidden bg-[#F7F7F7] h-[100vh]">
                    <Loading openLoading={serviceLoading} />
                    <Drawer
                        anchor={"bottom"}
                        open={state["bottom"]}
                        onClose={toggleDrawer("bottom", false)}>
                        {addService("bottom")}
                    </Drawer>
                    <div className="pr-4 pl-4 pt-6">
                        <Header context={t("title:serviceInformation")} />
                    </div>
                    <div className="flex pr-4 pl-4 pt-3 pb-3 mb-4 justify-center">
                        <button
                            onClick={toggleDrawer("bottom", true)}
                            style={{
                                width: "343px",
                                height: "43px",
                                background: `${alpha("#020873", 0.1)}`,
                                color: "#020873",
                            }}
                            className=" font-medium gap-1 bg-primary rounded-lg p-2 mt-4 flex justify-center items-center">
                            <AddCircleOutlineIcon
                                sx={{ fontSize: "18px", color: "#020873" }}
                            />
                            {t("button:createNewService")}
                        </button>
                    </div>
                    <div>
                        <p className="pr-4 pl-4 pt-3 pb-3">
                            {t("services")}{" "}
                            {`(${serviceData &&
                                serviceData.filter(
                                    (item) => item.isDeleted == false
                                ).length
                                })`}{" "}
                        </p>
                        {serviceData &&
                            serviceData
                                .filter((item) => item.isDeleted == false)
                                .map((service, index) => (
                                    <div key={index} className="mb-2">
                                        <SwipeableList
                                            type={Type.IOS}
                                            fullSwipe={false}>
                                            <SwipeableListItem
                                                trailingActions={trailingActions(
                                                    handleOpenConfirm,
                                                    handleSelectService,
                                                    service.id
                                                )}>
                                                <ListServiceCard
                                                    serviceId={selectedId}
                                                    serviceName={service.title}
                                                    price={service.price}
                                                    description={
                                                        service.description
                                                    }
                                                    currency={service.currency}
                                                    openTime={service.openTime}
                                                    closeTime={
                                                        service.closeTime
                                                    }
                                                    daysOpen={mergeDayOpen()}
                                                    openConfirm={open}
                                                    handleOpen={
                                                        handleOpenConfirm
                                                    }
                                                    handleClose={
                                                        handleCloseConfirm
                                                    }
                                                    handleRefresh={
                                                        serviceMutate
                                                    }
                                                    handleSelectService={
                                                        handleSelectService
                                                    }
                                                />
                                            </SwipeableListItem>
                                        </SwipeableList>
                                    </div>
                                ))}
                    </div>
                </div>
            )}
        </>
    );
}
