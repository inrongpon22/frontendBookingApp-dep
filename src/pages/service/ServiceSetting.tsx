import { useTranslation } from "react-i18next";
import Header from "./components/Header";
import { alpha } from "@mui/material";
import ListServiceCard from "./components/ListServiceCard";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getServiceByBusinessId } from "../../api/service";
import { IService } from "../business/interfaces/service";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import React from "react";
import ServiceInfo from "../business/ServiceInfo";
import ServiceDetail from "./ServiceDetail";

export type Anchor = 'top' | 'left' | 'bottom' | 'right';

export default function ServiceSetting() {
    const navigate = useNavigate();
    const { businessId } = useParams();
    const token = localStorage.getItem("token") ?? "";
    const { t } = useTranslation();
    const [services, setServices] = useState<IService[]>([]);
    const [reFresh, setReFresh] = useState(false);
    const [openIndex, setOpenIndex] = useState<number | null>(null); // Track which service is open
    const [selectedId, setSelectedId] = useState<number>(0); // Track which service is selected
    const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer =
        (anchor: Anchor, open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }

                setState({ ...state, [anchor]: open });
            };

    const addService = (anchor: Anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250, height: "100vh" }}
            role="presentation"
        >
            <ServiceInfo
                isClose={true}
                isEdit={false}
                handleClose={toggleDrawer('bottom', false)}
                handleCloseFromEdit={() => setState({ ...state, ['bottom']: false })}
            />
        </Box>
    );
    const serviceDetail = (anchor: Anchor) => (
        <ServiceDetail
            serviceId={selectedId}
            handleClose={() => setState({ ...state, [anchor]: false })}
        />
    );

    useEffect(() => {
        const fetchService = async () => {
            const services: IService[] = await getServiceByBusinessId(
                Number(businessId),
                token
            );
            setServices(services);
        };
        if (token) fetchService();
        else navigate("/");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [businessId, reFresh]);

    const handleDrawerOpen = (index: number) => {
        setOpenIndex(index);
    };

    const handleDrawerClose = () => {
        setOpenIndex(null);
    };

    const handleSlide = (index: number) => (e: any) => {
        e.stopPropagation(); // Prevent event propagation to parent elements
        const threshold = 50;
        const startX = e.touches ? e.touches[0].clientX : e.clientX;
        let isSliding = false;

        const handleMove = (moveEvent: any) => {
            const currentX = moveEvent.touches
                ? moveEvent.touches[0].clientX
                : moveEvent.clientX;
            const deltaX = currentX - startX;

            if (deltaX > threshold) {
                isSliding = true;
                handleDrawerClose();
                document.removeEventListener("mousemove", handleMove);
                document.removeEventListener("touchmove", handleMove);
            } else if (deltaX < -threshold) {
                isSliding = true;
                handleDrawerOpen(index);
                document.removeEventListener("mousemove", handleMove);
                document.removeEventListener("touchmove", handleMove);
            }
        };

        const handleEnd = () => {
            document.removeEventListener("mousemove", handleMove);
            document.removeEventListener("touchmove", handleMove);
            document.removeEventListener("mouseup", handleEnd);
            document.removeEventListener("touchend", handleEnd);
            if (!isSliding) {
                handleDrawerOpen(index);
            }
        };

        document.addEventListener("mousemove", handleMove);
        document.addEventListener("touchmove", handleMove);
        document.addEventListener("mouseup", handleEnd);
        document.addEventListener("touchend", handleEnd);
    };

    const handleSelectService = (serviceId: number) => {
        setSelectedId(serviceId);
        setState({ ...state, ['right']: true });
    };

    return (
        <div className=" overflow-y-hidden">
            <Drawer
                anchor={'bottom'}
                open={state['bottom']}
                onClose={toggleDrawer('bottom', false)}
            >
                {addService('bottom')}
            </Drawer>
            <Drawer
                anchor={'right'}
                open={state['right']}
                onClose={toggleDrawer('right', false)}
            >
                {serviceDetail('right')}
            </Drawer>
            <div className="pr-4 pl-4 pt-6">
                <Header context={t("title:serviceInformation")} />
            </div>
            <div className="flex pr-4 pl-4 pt-3 pb-3 mb-4 justify-center">
                <button
                    onClick={toggleDrawer('bottom', true)}
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
            <div style={{ background: "#F7F7F7", height: "100vh" }}>
                <p className="pr-4 pl-4 pt-3 pb-3">
                    {t("services")}{" "}
                    {`(${services.filter((item) => item.isDeleted == false)
                        .length
                        })`}{" "}
                </p>
                {services
                    .filter((item) => item.isDeleted == false)
                    .map((service, index) => (
                        <div
                            key={index}
                            className="mb-2"
                            onTouchStart={handleSlide(index)}
                            onMouseDown={handleSlide(index)}
                        >
                            <ListServiceCard
                                serviceId={service.id}
                                serviceName={service.title}
                                price={service.price}
                                description={service.description}
                                currency={service.currency}
                                openTime={service.openTime}
                                closeTime={service.closeTime}
                                daysOpen={service.daysOpen}
                                open={openIndex === index} // Set open state based on openIndex
                                handleRefresh={() => setReFresh(!reFresh)}
                                handleSelectService={handleSelectService}
                            />
                        </div>
                    ))}
            </div>

        </div>
    );
}
