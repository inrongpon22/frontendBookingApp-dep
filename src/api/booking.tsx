import axios from "axios";
import { app_api } from "../helper/url";
import useSWR from "swr";
import moment from "moment";

const token = localStorage.getItem("token");

export const cancelBooking = async (
    token: string,
    bookingId: number | string | undefined,
    serviceId: string | number,
    lang: string, 
    noticeType: string
) => {
    token = token.replace(/"/g, "");
    try {
        const booking = await axios.post(
            `${app_api}/cancelReservation/${bookingId}/${serviceId}/${lang}/customer/${noticeType}`, // line or sms or all
            {},
            {
                headers: {
                    Authorization: `${token}`,
                },
            }
        );
        return booking.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getReservationByBusinessId = (
    businessId: number,
    status: string
) => {
    const { data, error, isLoading, mutate } = useSWR(
        `${app_api}/getReservationByBusinessId/${businessId}/${status}`,
        (url: string) =>
            axios
                .get(url, {
                    headers: {
                        authorization: localStorage.getItem("token"),
                    },
                })
                .then((res) => res.data)
    );

    return {
        getReservationByBusinessIdData: data,
        getReservationByBusinessIdError: error,
        getReservationByBusinessIdLoading: isLoading,
        mutateReservationByBusinessId: mutate,
    };
};

export const getReservationByServiceId = (
    businessId: number,
    serviceId: number,
    status: string
) => {
    const { data, error, isLoading, mutate } = useSWR(
        `${app_api}/getReservationByServiceId/${serviceId}/${businessId}/${status}?page=1&limit=100`,
        (url: string) =>
            axios
                .get(url, {
                    headers: {
                        Authorization: token,
                    },
                })
                .then(async (res) => {
                    const filtered = res?.data
                        .filter((item: any) => item.serviceId === serviceId)
                        .sort(
                            (a: any, b: any) =>
                                moment(a.bookingDate).valueOf() -
                                moment(b.bookingDate).valueOf()
                        )
                        .reduce((prev: any, curr: any) => {
                            const date: any = moment(curr.bookingDate); //.format("DD-MM-YYYY");
                            if (!prev[date]) {
                                prev[date] = [];
                            }
                            prev[date].push(curr);
                            return prev;
                        }, []);

                    return Object?.keys(filtered)?.map((date) => ({
                        date,
                        children: filtered[date],
                    }));
                })
    );

    return {
        getReservServiceIdData: data,
        getReservServiceIdError: error,
        getReservServiceIdLoading: isLoading,
        mutateReservServiceId: mutate,
    };
};
