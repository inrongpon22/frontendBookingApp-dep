import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { ApproveContext } from "../../pages/booking-approval/BookingApproval";
import { useTranslation } from "react-i18next";
import moment from "moment";
// styled
import { Divider } from "@mui/material";
// api
import useSWR from "swr";
import axios from "axios";
import { app_api, useQuery } from "../../helper/url";
import { GlobalContext } from "../../contexts/BusinessContext";
import ConfirmCard from "./ConfirmCard";

const BookingApprovalSummary = () => {
    const { businessId } = useParams();
    const token = localStorage.getItem("token");
    const query = useQuery();

    const { t } = useTranslation();

    const { bookingDatas, approveRequested } = useContext(ApproveContext);

    const { setDialogState } = useContext(GlobalContext);

    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

    const { data: bookingDetailFromSMS } = useSWR(
        query.get("accessCode") &&
            `${app_api}/getReservationByBusinessIdFromMessage/${businessId}/all`,
        (url: string) =>
            axios
                .post(url, { accessCode: query.get("accessCode") })
                .then((res) => res.data[0]),
        { revalidateOnFocus: false }
    );

    console.log(bookingDetailFromSMS?.status === "cancel");

    const BookingDataLists: { label: string; text: string }[] = [
        {
            label: `${t("services")}:`,
            text: bookingDetailFromSMS
                ? bookingDetailFromSMS.title
                : bookingDatas?.title,
        },
        {
            label: `${t("date")}:`,
            text: bookingDetailFromSMS
                ? moment(bookingDetailFromSMS?.bookingDate).format(
                      "dddd, DD MMMM YYYY"
                  )
                : bookingDatas
                ? moment(bookingDatas?.bookingDate).format("dddd, DD MMMM YYYY")
                : "",
        },
        {
            label: `${t("time")}:`,
            text: bookingDetailFromSMS
                ? `${bookingDetailFromSMS?.startTime.slice(
                      0,
                      -3
                  )} - ${bookingDetailFromSMS?.endTime.slice(0, -3)}`
                : `${
                      bookingDatas ? bookingDatas?.startTime.slice(0, -3) : ""
                  } - ${
                      bookingDatas ? bookingDatas?.endTime.slice(0, -3) : ""
                  }`,
        },
        {
            label: `${t("price")}:`,
            text: bookingDetailFromSMS
                ? `${bookingDetailFromSMS.price} ฿`
                : `${bookingDatas ? bookingDatas?.price : ""} ฿`,
        },
    ];

    const GuestDataLists: { label: string; text: string }[] = [
        {
            label: `${t("bookingName")}:`,
            text: bookingDetailFromSMS
                ? bookingDetailFromSMS.userName
                : bookingDatas?.userName,
        },
        {
            label: `${t("phoneNumbers")}:`,
            text: bookingDetailFromSMS
                ? bookingDetailFromSMS.phoneNumber
                : bookingDatas?.phoneNumber,
        },
        {
            label: `${t("numberOfGuest")}:`,
            text: bookingDetailFromSMS
                ? bookingDetailFromSMS.guestNumber
                : bookingDatas?.guestNumber,
        },
        {
            label: `${t("note")}:`,
            text: bookingDetailFromSMS
                ? bookingDetailFromSMS.remark
                : bookingDatas?.remark,
        },
    ];

    return (
        <div className="flex flex-col h-full">
            <ConfirmCard
                open={showConfirmation}
                title={t("noti:booking:approve:confirmation")}
                description={t("noti:booking:approve:confirmationDesc")}
                bntConfirm={t("button:confirm")}
                bntBack={t("button:cancel")}
                handleClose={() => setShowConfirmation(false)}
                handleConfirm={() =>
                    approveRequested(bookingDatas?.id, bookingDatas?.serviceId)
                }
            />
            <div className="flex flex-col gap-3">
                {BookingDataLists?.map(
                    (item: { label: string; text: string }, index: number) => {
                        return (
                            <div key={index} className="flex justify-between">
                                <span className="text-gray-500">
                                    {item.label}
                                </span>
                                <span className="text-[14px] font-semibold">
                                    {item.text}
                                </span>
                            </div>
                        );
                    }
                )}
            </div>

            <div className="flex flex-col gap-3 mt-5">
                <Divider />
                {GuestDataLists?.map(
                    (item: { label: string; text: string }, index: number) => {
                        return (
                            <div key={index} className="flex justify-between">
                                <span className="text-gray-500">
                                    {item.label}
                                </span>
                                <span className="text-[14px] font-semibold text-end">
                                    {item.text}
                                </span>
                            </div>
                        );
                    }
                )}
            </div>

            <div
                className={`${
                    bookingDatas?.status === "pending" ||
                    (query.get("accessCode") &&
                        bookingDetailFromSMS?.status !== "cancel")
                        ? "flex flex-col gap-3"
                        : "hidden"
                } mt-auto`}
            >
                <button
                    type="button"
                    className="bg-deep-blue text-white p-3 rounded-lg"
                    onClick={() => setShowConfirmation(true)}
                >
                    {t("button:approve")}
                </button>
                <button
                    type="button"
                    className="border p-3 rounded-lg"
                    onClick={() => {
                        if (token) {
                            setDialogState("booking-approval-reject");
                        } else {
                            setDialogState("phone-input");
                        }
                    }}
                >
                    {t("button:reject")}
                </button>
            </div>
        </div>
    );
};

export default BookingApprovalSummary;
