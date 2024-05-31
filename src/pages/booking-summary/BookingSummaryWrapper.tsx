import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { app_api, useQuery } from "../../helper/url";
import useSWR from "swr";
import moment from "moment";
import { useTranslation } from "react-i18next";
// icons
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";
import { cancelBooking } from "../../api/booking";
import ConfirmCard from "../../components/dialog/ConfirmCard";
import { GlobalContext } from "../../contexts/BusinessContext";
import SendMessageOption from "../../components/dialog/SendMessageOption";


const BookingSummaryWrapper = () => {
    const navigate = useNavigate();
    const query = useQuery();
    const { bookingId } = useParams(); // bookingId click from my-bookings

    const { setShowDialog, setDialogState } = useContext(GlobalContext);

    const token: string = localStorage.getItem("token") ?? "";

    const {
        t,
        i18n: { language },
    } = useTranslation();

    const switchStatus = (status: string) => {
        switch (status) {
            case "pending":
                return {
                    title: t("title:waitingForApproval"),
                    desc: t("desc:waitingForApproval"),
                    icon: (
                        <HourglassTopIcon
                            style={{ fontSize: 50 }}
                            color="warning"
                        />
                    ),
                };

            case "approval":
                return {
                    title: t("title:bookingHasApproved"),
                    desc: t("desc:bookingHasApproved"),
                    icon: (
                        <CheckRoundedIcon
                            style={{ fontSize: 50, color: "#2ECC71" }}
                        />
                    ),
                };

            case "cancel":
                return {
                    title: t("title:bookingHasCancelled"),
                    desc: t("desc:bookingHasCancelled"),
                    icon: (
                        <CloseRoundedIcon
                            style={{ fontSize: 50 }}
                            color="error"
                        />
                    ),
                };

            case "expired":
                return {
                    title: t("title:waitingForApproval"),
                    desc: t("desc:waitingForApproval"),
                    icon: (
                        <QueryBuilderIcon
                            style={{ fontSize: 50 }}
                            color="secondary"
                        />
                    ),
                };

            case "declinded":
                return {
                    title: t("title:bookingHasDeclined"),
                    desc: t("desc:bookingHasDeclined"),
                    icon: (
                        <SentimentNeutralIcon
                            style={{ fontSize: 50 }}
                            color="info"
                        />
                    ),
                };

            default:
                break;
        }
    };

    const [lists, setLists] = useState<
        {
            label: string;
            text: string;
        }[]
    >([]);

    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

    const { data: bookingById } = useSWR(
        bookingId &&
            !query.get("accessCode") &&
            `${app_api}/reservation/${bookingId}`,
        (url: string) =>
            axios
                .get(url, {
                    headers: {
                        Authorization: token,
                    },
                })
                .then((res) => res.data)
                .catch((err) => console.log(err))
    );

    const { data: bookingFromAccessCode } = useSWR(
        bookingId &&
            query.get("accessCode") &&
            `${app_api}/getReservationByIdFromMessage/${bookingId}`,
        (url: string) =>
            axios
                .post(url, { accessCode: query.get("accessCode") })
                .then((res) => res.data[0])
                .catch((err) => console.log(err)),
        { revalidateOnFocus: false }
    );

    const bookingDatas = bookingFromAccessCode
        ? bookingFromAccessCode
        : bookingById;

    const handleCancelBooking = async () => {
        await cancelBooking(token, bookingId, bookingById.serviceId, language)
            .then(() => {
                setShowDialog(false);
                setDialogState("phone-input");
                toast.success(t("noti:booking:cancel:success"));
                navigate("/my-bookings");
            })
            .catch((error) => {
                console.log(error);
                toast.error("มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง");
                // t("noti:booking:cancel:fail")
            });
    };

    useEffect(() => {
        document.title = t("title:myBookings");
        setLists([
            {
                label: t("store"),
                text: bookingDatas?.businessName,
            },
            {
                label: t("services"),
                text: bookingDatas?.title,
            },
            {
                label: t("date"),
                text: `${moment(bookingDatas?.bookingDate).format(
                    "dddd, MMMM D, YYYY"
                )}`,
            },
            {
                label: t("time"),
                text: `${bookingDatas?.startTime.slice(
                    0,
                    -3
                )} - ${bookingDatas?.endTime.slice(0, -3)}`,
            },
            {
                label: t("guests"),
                text: bookingDatas?.guestNumber,
            },
            {
                label: t("who"),
                text: bookingDatas ? bookingDatas?.userName : "",
            },
            {
                label: t("phoneNumbers"),
                text: bookingDatas?.phoneNumber
                    ? bookingDatas?.phoneNumber
                    : "-",
            },
            {
                label: t("notes"),
                text: bookingDatas?.remark ? bookingDatas?.remark : "-",
            },
        ]);
    }, [bookingById, bookingFromAccessCode]);

    // const handleConfirm = () => {};

    return (
        <>
            {/* <ConfirmCard
                open={showConfirmation}
                title={t("noti:booking:cancel:confirmation")}
                description={t("noti:booking:cancel:confirmationDesc")}
                bntConfirm={t("button:confirm")}
                bntBack={t("button:cancel")}
                handleClose={() => setShowConfirmation(false)}
                handleConfirm={handleCancelBooking}
            /> */}

        <SendMessageOption 
            open={showConfirmation}
            title={t("noti:booking:cancel:confirmation")}
            description={t("noti:booking:cancel:confirmationDesc")}
            sendMessageOption={t("sendMessageOption")}
            btnSMS={t("button:btnSMS")}
            btnLINE={t("button:btnLINE")}
            bntConfirm={t("button:confirm")}
            bntBack={t("button:cancel")}
            handleClose={() => setShowConfirmation(false)}
            imageSrc="../Cancelicon.png"
            handleCancelBooking={handleCancelBooking} 
            />
            
            <div className="flex flex-col h-dvh p-5">
                <p className="flex flex-col justify-center items-center text-[25px] font-semibold mb-3">
                    <span className="my-6">
                        {bookingDatas ? (
                            switchStatus(bookingDatas?.status)?.icon
                        ) : (
                            <CircularProgress />
                        )}
                    </span>
                    <span>{switchStatus(bookingDatas?.status)?.title}</span>
                </p>
                <p className="text-[14px] text-center font-normal mb-10">
                    {switchStatus(bookingDatas?.status)?.desc}
                </p>

                <div className="flex flex-col gap-3 border rounded-lg p-5">
                    {lists?.map((item: any, index: number) => {
                        return (
                            <div
                                key={index}
                                className={`text-[14px] grid grid-cols-12 ${
                                    bookingDatas?.status === "cancel" ||
                                    bookingDatas?.status === "declinded"
                                        ? "text-gray-500"
                                        : ""
                                }`}
                            >
                                <div className="col-span-5 font-normal">
                                    {item.label}:
                                </div>
                                <span className="col-span-7 font-medium text-end">
                                    {item.text}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div
                    className={
                        bookingDatas?.status === "cancel" ||
                        bookingDatas?.status === "declinded"
                            ? "flex gap-3"
                            : ""
                    }
                >
                    <button
                        type="button"
                        className={`w-full p-2 mt-5 rounded-lg ${
                            bookingDatas?.status === "cancel" ||
                            bookingDatas?.status === "declinded"
                                ? "border-2 border-deep-blue text-deep-blue"
                                : "bg-deep-blue text-white"
                        }`}
                        onClick={() => {
                            navigate(
                                `/my-bookings${
                                    query.get("accessCode")
                                        ? `?accessCode=${query.get(
                                              "accessCode"
                                          )}`
                                        : ""
                                }`,
                                {
                                    state: {
                                        userId: bookingDatas?.userId,
                                    },
                                }
                            );
                            setShowDialog(false);
                            setDialogState("phone-input");
                        }}
                    >
                        {t("button:goToMyBookingButton")}
                    </button>
                    {/* re-book button */}
                    <button
                        type="button"
                        className={`bg-[#020873] w-full text-white p-2 mt-5 rounded-lg ${
                            bookingDatas?.status === "cancel" ||
                            bookingDatas?.status === "declinded"
                                ? "block"
                                : "hidden"
                        }`}
                        onClick={() =>
                            navigate(`/details/${bookingDatas?.businessId}`)
                        }
                    >
                        {t("button:rebook")}
                    </button>
                    {/* re-book button */}
                </div>
                {/* cancel reservation by customer */}
                <div
                    className={
                        bookingDatas?.status === "approval" ||
                        bookingDatas?.status === "cancel" ||
                        bookingDatas?.status === "declinded"
                            ? "hidden"
                            : "flex justify-center"
                    }
                >
                    <span className="py-5 w-2/3 text-center">
                        {t("fragment:needTo")}{" "}
                        <button
                            type="button"
                            className="underline"
                            onClick={() => setShowConfirmation(true)}
                        >
                            {t("fragment:cancel")}
                        </button>{" "}
                        {t("fragment:aBooking")}?
                    </span>
                </div>
                {/* cancel reservation by customer */}
            </div>
        </>
    );
};

export default BookingSummaryWrapper;
