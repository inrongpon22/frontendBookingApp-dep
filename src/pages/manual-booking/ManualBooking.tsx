import { useContext, useState } from "react";
// components
import { useParams } from "react-router";
import Calendar from "../../components/shop-details/Calendar";
import Quantity from "../../components/shop-details/Quantity";
import ServiceOptions from "../../components/shop-details/ServiceOptions";
import TimeSlots from "../../components/shop-details/TimeSlots";
import useSWR from "swr";
import { app_api } from "../../helper/url";
import axios from "axios";
import {
    quantityTypes,
    serviceTypes,
} from "../../components/shop-details/detailTypes";
import moment from "moment";
import Loading from "../../components/dialog/Loading";
import { useTranslation } from "react-i18next";
import { GlobalContext } from "../../contexts/BusinessContext";

const ManualBooking = () => {
    const { businessId } = useParams();
    const { t } = useTranslation();

    const token = localStorage.getItem("token");

    const {setDialogState} = useContext(GlobalContext);

    const [selectedDate, setSelectedDate] = useState<any>({
        // handle select date on calendar
        date: moment(),
    });

    const [calendar, setCalendar] = useState({
        // handle calendar date
        start: moment(),
        end: moment().add(10, "day"),
    });

    const [dateArr, setDateArr] = useState<object[]>([]); // get calendar date for custom render

    const [quantities, setQuantities] = useState<quantityTypes>({
        title: "Guest",
        desc: "Number of guest",
        quantities: 1,
        max: 10,
        min: 1,
    }); // handle quantities

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
            ),
        { revalidateOnFocus: false }
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
            }),
        {
            revalidateOnFocus: false,
            loadingTimeout: 0,
        }
    );     

    if (servicesDataError || serviceByIdError) return <>API error...</>;

    return (
        <>
            <Loading openLoading={servByIdLoading} />

            <div className={`flex flex-col gap-5`}>
                <ServiceOptions services={services} setServices={setServices} />

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

            <div className="flex flex-col justify-center items-center my-5">
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
                    }  text-white text-[14px] font-semibold w-11/12 rounded-md py-3`}
                    onClick={() => {
                        localStorage.setItem(
                            "bookingDetail",
                            JSON.stringify({
                                serviceId: Number(
                                    services.find(
                                        (item: any) => item.isSelected
                                    )?.id
                                ),
                                serviceById: serviceById,
                                selectedDate:selectedDate,
                                bookingDate:
                                    selectedDate.date.format("YYYY-MM-DD"),
                                guestNumber: quantities.quantities,
                            })
                        )
                        if (
                            slotArrays?.slotsTime.filter(
                                (item: any) => item.isSelected
                            )
                        ) {
                            if (token) {
                                setDialogState("booking-detail-preview");
                            } else {
                                setDialogState("phone-input");
                            }
                        }
                    }}
                >
                    {t("button:confirmBookingButton")}
                </button>
                <span className="text-[12px] py-2">{t("reviewDetails")}</span>
            </div>
        </>
    );
};

export default ManualBooking;
