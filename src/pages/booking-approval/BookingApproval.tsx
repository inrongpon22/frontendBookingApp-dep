import { createContext, useContext, useEffect, useState } from "react";
export const ApproveContext = createContext<any>(null); //create context to store all the data
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from "moment";
import toast from "react-hot-toast";
// fetcher
import useSWR from "swr";
import axios from "axios";
import { app_api, useQuery } from "../../helper/url";
// styled
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    // Box,
    // Divider,
} from "@mui/material";
// icons
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// components
import RequestCards from "../../components/business-approval/RequestCards";
import DialogWrapper from "../../components/dialog/DialogWrapper";
import { dayOfWeekFullName } from "../../helper/daysOfWeek";
import { monthsOfYearFullName } from "../../helper/monthsOfYear";
import { GlobalContext } from "../../contexts/BusinessContext";
import CustomStatusTabs from "./CustomStatusTabs";
import { getUserIdByAccessToken } from "../../api/user";
// import CustomDateTabs from "./CustomDateTabs";
// import { Ireservation } from "../../interfaces/reservation";

const BookingApproval = (): React.ReactElement => {
    const { businessId } = useParams();
    const accessToken = localStorage.getItem("accessToken");
    const navigate = useNavigate();
    const location = useLocation();
    const query = useQuery();

    const token: string | null = localStorage.getItem("token");
    const lang: string | null = localStorage.getItem("i18nextLng");

    const {
        t,
        i18n: { language },
    } = useTranslation();

    const { setIsGlobalLoading, setShowDialog, setDialogState } =
        useContext(GlobalContext);

    const [bookingDatas, setBookingDatas] = useState();

    // handle tab state
    const [tabStatus, setTabStatus] = useState<number>(0);
    // const [tabDate, setTabDate] = useState<number>(0);

    // const converted = (): string => {
    //     switch (tabStatus) {
    //         case 0:
    //             return "all";

    //         case 1:
    //             return "pending";

    //         case 2:
    //             return "approval";

    //         case 3:
    //             return "cancel";

    //         default:
    //             return "all";
    //     }
    // };

    const converted = (): string => {
        switch (tabStatus) {
            case 0:
                return "pending";

            case 1:
                return "approval";

            case 2:
                return "cancel";

            default:
                return "pending";
        }
    };

    // get booking from access code
    const { data: getReservByAccessCode } = useSWR(
        token &&
            query.get("accessCode") &&
            `${app_api}/getReservationByBusinessIdFromMessage/${businessId}/all`,
        (url: string) =>
            axios
                .post(url, { accessCode: query.get("accessCode") })
                .then((res) => res.data[0]),
        { revalidateOnFocus: false }
    );

    // const {
    //     data: getReservByBusiId,
    //     isLoading,
    //     error: ReservByBusiIdError,
    //     mutate,
    // } = useSWR(
    //     businessId &&
    //         token &&
    //         `${app_api}/getReservationByBusinessId/${businessId}/${converted()}?page=1&limit=1000`,
    //     (url: string) =>
    //         axios
    //             .get(url, {
    //                 headers: {
    //                     Authorization: token,
    //                 },
    //             })
    //             .then(async (res) => {
    //                 return res.data.filter((ii: any) => {
    //                     if (moment(ii.bookingDate).isSame(moment(), "day")) {
    //                         return ii;
    //                     }
    //                 });
    //             })
    //             .catch(() =>
    //                 toast.error("มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง")
    //             )
    // );
    const {
        data: getReservByBusiId,
        isLoading,
        error: ReservByBusiIdError,
        mutate,
    } = useSWR(
        businessId &&
            token &&
            `${app_api}/getReservationByBusinessId/${businessId}/${converted()}?page=1&limit=100`,
        (url: string) =>
            axios
                .get(url, {
                    headers: {
                        Authorization: token,
                    },
                })
                .then(async (res) => {
                    const filtered = res?.data
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

    const approveRequested = async (
        reservationId: string,
        serviceId: string
    ) => {
        if (token) {
            const userId = await getUserIdByAccessToken(
                accessToken ?? "",
                token ?? ""
            );
            axios
                .post(
                    `${app_api}/approveReservation/${
                        query.get("accessCode")
                            ? getReservByAccessCode.id
                            : reservationId
                    }/${
                        query.get("accessCode")
                            ? getReservByAccessCode.serviceId
                            : serviceId
                    }/${lang}/${userId}`,
                    undefined,
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                )
                .then(() => {
                    if (query.get("accessCode")) {
                        setDialogState("booking-approval-result-success");
                    } else {
                        setShowDialog(false);
                        toast.success(t("noti:booking:approve:success"));
                        setShowDialog(false);
                        mutate();
                    }
                })
                .catch((err) => {
                    console.log(err);
                    toast.error("มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง");
                    // t("noti:booking:approve:fail")
                });
        } else {
            setDialogState("phone-input");
        }
    };

    const rejectRequested = async (
        reservationId: string,
        serviceId: string,
        rejectNote: string
    ) => {
        if (token) {
            axios
                .post(
                    `${app_api}/cancelReservation/${
                        query.get("accessCode")
                            ? getReservByAccessCode.id
                            : reservationId
                    }/${
                        query.get("accessCode")
                            ? getReservByAccessCode.serviceId
                            : serviceId
                    }/${lang}/business/all`,
                    {
                        rejectNote: rejectNote,
                    },
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                )
                .then(() => {
                    if (query.get("accessCode")) {
                        setDialogState("booking-approval-result-rejected");
                    } else {
                        setShowDialog(false);
                        toast.success(t("noti:booking:reject:success"));
                        mutate();
                    }
                })
                .catch((err) => {
                    console.log(err);
                    toast.error("มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง");
                    // t("noti:booking:reject:fail")
                });
        } else {
            setDialogState("phone-input");
        }
    };

    useEffect(() => {
        document.title = t("title:bookingApproval");
        if (query.get("accessCode")) {
            setDialogState("booking-approval-summary");
            setShowDialog(true);
        } else if (location.state) {
            setDialogState("booking-approval-summary");
            setShowDialog(true);
            setBookingDatas(location.state);
        }
    }, []);

    useEffect(() => {
        setIsGlobalLoading(isLoading);
    }, [isLoading]);

    if (ReservByBusiIdError) return <div>API ERROR</div>;

    return (
        <ApproveContext.Provider
            value={{
                mutate,
                approveRequested,
                rejectRequested,
                bookingDatas,
                setBookingDatas,
            }}>
            <div className="h-dvh flex flex-col overflow-x-hidden">
                <div className="flex drop-shadow-lg p-4 font-semibold text-[14px] border-b">
                    <button
                        type="button"
                        onClick={() =>
                            navigate(`/business-profile/${businessId}`)
                        }>
                        <ArrowBackIosIcon fontSize="small" />
                    </button>
                    {/* <span className="mx-auto">Booking lists</span> */}
                    {/* invisible button for balance */}
                    <button type="button" className="invisible">
                        <ArrowBackIosIcon fontSize="small" />
                    </button>
                    {/* invisible button for balance */}
                </div>

                {/* <CustomDateTabs tabDate={tabDate} setTabDate={setTabDate} /> */}
                <CustomStatusTabs
                    tabStatus={tabStatus}
                    setTabStatus={setTabStatus}
                    tabData={getReservByBusiId}
                />

                {/* time indicator */}
                {/* <Divider className="w-75">
                    <span className="text-gray-400">
                        {moment().format("MMM D, YYYY")}
                    </span>
                </Divider> */}
                {/* time indicator */}

                {/* <Box sx={{ bgcolor: "#fff" }}>
                    <div className="px-5">
                        {getReservByBusiId && getReservByBusiId?.length > 0 ? (
                            getReservByBusiId?.map(
                                (item: Ireservation, index: number) => {

                                    function getStatusClass(status: string) {
                                        switch (status) {
                                          case 'approval':
                                            return 'bg-deep-blue bg-opacity-10 text-deep-blue';

                                          case 'pending':
                                            return 'bg-[#F0AD4E] bg-opacity-20 text-[#F0AD4E]';

                                          case 'cancel':
                                            return 'bg-zinc-200 text-zinc-400';
                                        }
                                      }

                                    return (
                                        <div
                                            key={index}
                                            className="flex justify-between"
                                        >
                                            <div className="flex gap-2">
                                                <p
                                                    className={`${getStatusClass(item.status)} px-1 rounded`}
                                                >
                                                    {item.startTime.slice(
                                                        0,
                                                        -3
                                                    )}
                                                </p>
                                                <p
                                                    // className={`${
                                                    //     item.status ===
                                                    //     "approval"
                                                    //         ? ""
                                                    //         : "text-zinc-400"
                                                    // } font-semibold`}
                                                >
                                                    {item.title}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                }
                            )
                        ) : (
                            <p className="p-4 text-[14px]">
                                {t("error:noBookingReq")}
                            </p>
                        )}
                    </div>
                </Box> */}
                <div className="bg-gray-100">
                    <div className="py-1" />
                    <div className="">
                        {getReservByBusiId && getReservByBusiId.length > 0 ? (
                            getReservByBusiId?.map(
                                (item: any, index: number) => {
                                    const date = moment(item.date).format("DD");
                                    const day = moment(item.date).format(
                                        "dddd"
                                    );
                                    const month = moment(item.date).format(
                                        "MMMM"
                                    );
                                    return (
                                        <div key={index} className="my-2">
                                            <Accordion
                                                defaultExpanded={
                                                    index === 0 ? true : false
                                                }>
                                                <AccordionSummary
                                                    expandIcon={
                                                        <ExpandMoreIcon />
                                                    }
                                                    aria-controls={`panel${
                                                        index + 1
                                                    }-content`}
                                                    id={`panel${
                                                        index + 1
                                                    }-header`}>
                                                    <span className="w-3/4">
                                                        {`${date} ${
                                                            monthsOfYearFullName(
                                                                language
                                                            )?.find(
                                                                (ii) =>
                                                                    ii.value ===
                                                                    month
                                                            )?.name ?? ""
                                                        }, ${
                                                            dayOfWeekFullName(
                                                                language
                                                            )?.find(
                                                                (ii) =>
                                                                    ii.value ===
                                                                    day
                                                            )?.name ?? ""
                                                        }`}
                                                    </span>
                                                    <span
                                                        className={`w-1/4 text-white text-center rounded-lg ${(() => {
                                                            switch (tabStatus) {
                                                                case 0:
                                                                    return "bg-[#F0AD4E]";

                                                                case 1:
                                                                    return "bg-green-500";
                                                            }
                                                        })()}`}>
                                                        {item.children?.length}{" "}
                                                        {tabStatus == 0
                                                            ? t("pending")
                                                            : tabStatus == 1
                                                            ? t("approved")
                                                            : null}
                                                    </span>
                                                </AccordionSummary>
                                                <AccordionDetails
                                                    className={
                                                        item.children.length > 1
                                                            ? "grid md:grid-cols-2 gap-2"
                                                            : ""
                                                    }>
                                                    {item.children.map(
                                                        (
                                                            ii: any,
                                                            jj: number
                                                        ) => {
                                                            return (
                                                                <RequestCards
                                                                    key={jj}
                                                                    data={ii}
                                                                />
                                                            );
                                                        }
                                                    )}
                                                </AccordionDetails>
                                            </Accordion>
                                        </div>
                                    );
                                }
                            )
                        ) : (
                            <p className="p-4 text-[14px]">
                                {t("error:noBookingReq")}
                            </p>
                        )}
                    </div>
                </div>

                <DialogWrapper userSide="business" />
            </div>
        </ApproveContext.Provider>
    );
};

export default BookingApproval;
