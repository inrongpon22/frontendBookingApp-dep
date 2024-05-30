import { useTranslation } from "react-i18next";
import Header from "./components/Header";
import { ThemeProvider, alpha, createTheme } from "@mui/material";
import ListServiceCard from "./components/ListServiceCard";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ServiceDetail from "./ServiceDetail";
import { SwipeableList, SwipeableListItem, Type } from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import useSWR from "swr";
import { app_api, fetcher } from "../../helper/url";
export type Anchor = "top" | "left" | "bottom" | "right";
import { trailingActions } from "./components/swipeable-list";
import { IService } from "../../interfaces/services/Iservice";
import { GlobalContext } from "../../contexts/BusinessContext";
import Loading from "../../components/dialog/Loading";

const theme = createTheme({
    palette: {
        info: {
            main: "#E6F1FD",
        },
    },
});

export default function ServiceSetting() {
    const { businessId } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { setIsGlobalLoading } = useContext(GlobalContext);
    const [selectedId, setSelectedId] = useState<number>(0);
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

    const mergeDayOpen = (serviceId: number) => {
        const dayOpen: string[] = []; // Initialize dayOpen as an empty array
        serviceData &&
            serviceData
                .filter((service) => service.id == serviceId)
                .map((item) => {
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

    const handleSelectService = (serviceId: number) => {
        setSelectedId(serviceId);
        setIsEditService(true);
    };

    useEffect(() => {
        setIsGlobalLoading(serviceLoading);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [serviceLoading]);

    return (
        <ThemeProvider theme={theme}>
            {isEditService ? (
                <ServiceDetail
                    serviceId={selectedId}
                    handleClose={() => setIsEditService(false)}
                    serviceMutate={serviceMutate}
                />
            ) : (
                <div className=" overflow-y-auto bg-[#F7F7F7] h-dvh">
                    <Loading openLoading={serviceLoading} />
                    <div className="pr-4 pl-4 py-6 bg-[#ffffff]">
                        <Header context={t("title:serviceInformation")} isClose={false} />
                    </div>
                    <div className="flex pb-6 justify-center bg-[#ffffff]">
                        <button
                            onClick={() => navigate(`/service/${businessId}?type=add`)}
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
                                                    daysOpen={mergeDayOpen(
                                                        service.id
                                                    )}
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
        </ThemeProvider>
    );
}
