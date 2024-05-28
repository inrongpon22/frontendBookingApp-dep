import { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
export const ShopContext = createContext<any>(null); //create context to store all the data
import moment from "moment";
import "moment/locale/th";
// styled
import { ThemeProvider, createTheme } from "@mui/material";
// fetcher
import useSWR from "swr";
import axios from "axios";
import { app_api } from "../../helper/url";
import {
    quantityTypes,
    serviceTypes,
    shopDetailTypes,
} from "../../components/shop-details/detailTypes"; //types
// components
import { Slideshow } from "../../components/shop-details/Slideshow";
import Calendar from "../../components/shop-details/Calendar";
import ServiceOptions from "../../components/shop-details/ServiceOptions";
import Quantity from "../../components/shop-details/Quantity";
import TimeSlots from "../../components/shop-details/TimeSlots";
import DialogWrapper from "../../components/dialog/DialogWrapper";
import ShopInformation from "../../components/shop-details/ShopInformation";
import { GlobalContext } from "../../contexts/BusinessContext";

const theme = createTheme({
    palette: {
        info: {
            main: "#E6F1FD",
        },
    },
});

const ShopDetailsPageWrapper = () => {
    const { businessId } = useParams(); // businessId from params
    const { t } = useTranslation();

    const token = localStorage.getItem("token");
    const accessToken = localStorage.getItem("accessToken");

    const { setShowDialog, setDialogState, setIsGlobalLoading } =
        useContext(GlobalContext);

    const [shopDetail, setShopDetail] = useState<shopDetailTypes>(); // get shop details by businessId connected api

    const [quantities, setQuantities] = useState<quantityTypes>({
        title: "Guest",
        desc: "Number of guest",
        quantities: 1,
        max: 10,
        min: 1,
    }); // handle quantities

    const [calendar, setCalendar] = useState({
        // handle calendar date
        start: moment(),
        end: moment().add(10, "day"),
    });

    const [dateArr, setDateArr] = useState<object[]>([]); // get calendar date for custom render

    const [selectedDate, setSelectedDate] = useState<any>({
        // handle select date on calendar
        date: moment(),
    });

    // handle services state
    const [services, setServices] = useState<serviceTypes[]>([]);
    const [serviceById, setServiceById] = useState<any>();

    const [selectedIndices, setSelectedIndices] = useState<Set<number>>(
        new Set()
    );

    const slotArrays = serviceById?.bookingSlots.find(
        (item: any) =>
            item.daysOpen?.includes(selectedDate.date.format("dddd")) &&
            selectedDate.date.isAfter(item.availableFromDate)
    );

    // get business by businessId from params
    const { error: bussDataError } = useSWR(
        `${app_api}/business/${businessId}`,
        (url: string) => axios.get(url).then((res) => setShopDetail(res.data)),
        { revalidateOnFocus: false }
    );

    // get services by business businessId
    const { error: servicesDataError } = useSWR(
        `${app_api}/serviceByBusinessId/${businessId}?page=1&limit=100`,
        (url: string) =>
            axios.get(url).then((res) =>
                setServices(
                    res.data.map((item: any, index: number) => {
                        if (index === 0) {
                            return {
                                ...item,
                                isSelected: true,
                                bookingSlots: item.bookingSlots.map(
                                    (ii: any) => {
                                        return { ...ii, isSelected: false };
                                    }
                                ),
                            };
                        } else {
                            return {
                                ...item,
                                isSelected: false,
                                bookingSlots: item.bookingSlots.map(
                                    (ii: any) => {
                                        return { ...ii, isSelected: false };
                                    }
                                ),
                            };
                        }
                    })
                )
            )
    );

    // get time slots by service businessId
    const { isLoading: servByIdLoading, error: serviceByIdError } = useSWR(
        () =>
            services.find((item: any) => item.isSelected) &&
            `${app_api}/service/${
                services.find((item: any) => item.isSelected)?.id
            }/${selectedDate.date.format("YYYY-MM-DD")}`,
        (url: string) =>
            axios.get(url).then((res) => {
                setServiceById({
                    ...res.data,
                    bookingSlots: res.data.bookingSlots.map((item: any) => {
                        return {
                            ...item,
                            slotsTime: item.slotsTime
                                .filter((item: any) =>
                                    moment().isBefore(
                                        selectedDate?.date.format(
                                            `D MMMM YYYY ${item.startTime}`
                                        )
                                    )
                                )
                                .map((ii: any) => {
                                    return {
                                        ...ii,
                                        isSelected: false,
                                    };
                                }),
                        };
                    }),
                });
                setSelectedIndices(new Set());
            })
    );

    useEffect(() => {
        setIsGlobalLoading(servByIdLoading);
    }, [servByIdLoading]);

    // browser tab title
    useEffect(() => {
        document.title = shopDetail?.title || "Shop Detail";
        localStorage.removeItem("bookingDetail");
    }, [shopDetail]);

    // catch errors api
    if (bussDataError | servicesDataError | serviceByIdError)
        return <div>Api Error</div>;

    return (
        <ThemeProvider theme={theme}>
            <div className="">
                <Slideshow
                    data={shopDetail?.imagesURL || []}
                    fixedHeight={300}
                />

                <div className={`flex flex-col gap-5 p-5`}>
                    <ShopInformation shopDetail={shopDetail} />

                    <ServiceOptions
                        services={services}
                        setServices={setServices}
                    />

                    <Quantity
                        quantities={quantities}
                        setQuantities={setQuantities}
                        serviceById={serviceById}
                        selectedDate={selectedDate}
                        setServiceById={setServiceById}
                    />

                    <Calendar
                        calendar={calendar}
                        setCalendar={setCalendar}
                        dateArr={dateArr}
                        setDateArr={setDateArr}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        serviceById={serviceById}
                    />

                    <TimeSlots
                        selectedDate={selectedDate}
                        setServiceById={setServiceById}
                        serviceById={serviceById}
                        quantities={quantities}
                        selectedIndices={selectedIndices}
                        setSelectedIndices={setSelectedIndices}
                    />
                </div>

                <div className="flex flex-col justify-center items-center my-5 px-5">
                    <button
                        type="button"
                        disabled={
                            !slotArrays?.slotsTime.find(
                                (item: any) => item.isSelected
                            )
                        }
                        className={`${
                            !slotArrays?.slotsTime.find(
                                (item: any) => item.isSelected
                            )
                                ? "bg-gray-300"
                                : "bg-[#020873]"
                        }  text-white text-[14px] font-semibold w-full rounded-md py-3`}
                        onClick={async () => {
                            // const userId = await getUserIdByAccessToken(
                            //     accessToken ?? "",
                            //     token ?? ""
                            // );
                            localStorage.setItem(
                                "bookingDetail",
                                JSON.stringify({
                                    serviceId: Number(
                                        services.find(
                                            (item: any) => item.isSelected
                                        )?.id
                                    ),
                                    serviceById: serviceById,
                                    selectedDate: selectedDate,
                                    bookingDate:
                                        selectedDate.date.format("YYYY-MM-DD"),
                                    guestNumber: quantities.quantities,
                                })
                            );
                            if (
                                slotArrays?.slotsTime.filter(
                                    (item: any) => item.isSelected
                                )
                            ) {
                                if (token && accessToken) {
                                    setShowDialog(true);
                                    setDialogState("booking-detail-preview");
                                } else {
                                    setShowDialog(true);
                                }
                            }
                        }}
                    >
                        {t("button:confirmBookingButton")}
                    </button>
                    <span className="text-[12px] py-2">
                        {t("reviewDetails")}
                    </span>
                </div>

                {/* Starts:: dialog */}
                <DialogWrapper userSide="user" />
                {/* Ends:: dialog */}
            </div>
        </ThemeProvider>
    );
};

export default ShopDetailsPageWrapper;
