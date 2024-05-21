import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DialogContext } from "./DialogWrapper";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { app_api } from "../../helper/url";
import toast from "react-hot-toast";
import { GlobalContext } from "../../contexts/BusinessContext";
import moment from "moment";

const BookingDetailsPreview = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const { formik } = useContext<any>(DialogContext);

    const { setIsGlobalLoading, setShowDialog, setDialogState } =
        useContext(GlobalContext);

    const bookingDetail = localStorage.getItem("bookingDetail") ?? "";

    const {
        t,
        i18n: { language },
    } = useTranslation();

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const slotArrays = JSON.parse(bookingDetail)?.serviceById.bookingSlots.find(
        (item: any) =>
            item.daysOpen?.includes(
                moment(JSON.parse(bookingDetail).selectedDate.date).format(
                    "dddd"
                )
            ) &&
            moment(JSON.parse(bookingDetail).selectedDate.date).isAfter(
                item.availableFromDate
            )
    );

    const filterSelected = slotArrays?.slotsTime.filter(
        (item: any) => item.isSelected
    );

    useEffect(() => {
        if (token && formik.values.userId === 0) {
            axios
                .get(`${app_api}/user/${userId}`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                })
                .then((res) => {
                    formik.setValues({
                        userId: res.data.id,
                        username: res.data.name,
                        phoneNumbers: res.data.phoneNumber,
                        otp: "",
                        additionalNotes: "",
                    });
                });
        }
    }, []);

    const createReservation = async () => {
        setIsGlobalLoading(true);
        const selectedArr = slotArrays?.slotsTime.filter(
            (item: any) => item.isSelected
        );
        const body = {
            userId: formik.values.userId,
            serviceId: Number(JSON.parse(bookingDetail)?.serviceId),
            phoneNumber: formik.values.phoneNumbers,
            remark: formik.values.additionalNotes,
            slotTimes: selectedArr.map((item: any) => {
                return { startTime: item.startTime, endTime: item.endTime };
            }),
            status: "pending",
            by: pathname.includes("business") ? "business" : "customer",
            userName: formik.values.username,
            bookingDate: moment(
                JSON.parse(bookingDetail).selectedDate.date
            ).format("YYYY-MM-DD"),
            guestNumber: JSON.parse(bookingDetail)?.guestNumber,
        };

        await axios
            .post(
                `${app_api}/${
                    pathname.includes("business")
                        ? "makeMutiReservationByBus"
                        : `makeMutiReservation/${language}`
                }`,
                body,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            )
            .then((res) => {
                setIsGlobalLoading(false);
                if (pathname.includes("business")) {
                    setDialogState("business-more-options");
                    setShowDialog(false);
                    toast.success("การสร้างการจองด้วยตัวเองสำเร็จ");
                    localStorage.removeItem("bookingDetail")
                } else {
                    navigate(`/booking/${res.data.reservationId}`);
                }
            })
            .catch((err) => {
                setIsGlobalLoading(false);
                toast.error(err.response.data.message);
            });
    };

    const getFirst = filterSelected[0];
    const getLast = filterSelected[filterSelected?.length - 1];

    return (
        <div className="flex flex-col gap-3">
            <div className="">
                <p className="text-[14px] font-semibold">
                    {t("bookingDetails")}
                </p>
                <div className="flex flex-col gap-3 border rounded-md p-3">
                    <p className="flex justify-between">
                        <span>{t("services")}:</span>
                        <span className="text-[14px] font-bold">
                            {JSON.parse(bookingDetail)?.serviceById.title}
                        </span>
                    </p>
                    <p className="flex justify-between">
                        <span>{t("date")}:</span>
                        <span className="text-[14px] font-bold">
                            {moment(
                                JSON.parse(bookingDetail).selectedDate.date
                            ).format("MMMM DD, YYYY")}
                        </span>
                    </p>
                    <p className="flex justify-between">
                        <span>{t("time")}:</span>
                        <span className="text-[14px] font-bold">
                            {`${getFirst?.startTime} - ${getLast?.endTime}`}
                        </span>
                    </p>
                    <p className="flex justify-between">
                        <span>{t("guests")}:</span>
                        <span className="text-[14px] font-bold">
                            {JSON.parse(bookingDetail).guestNumber}
                        </span>
                    </p>
                    <p className="flex justify-between">
                        <span>{t("price")}:</span>
                        <span className="text-[14px] font-bold">
                            {JSON.parse(bookingDetail)?.serviceById?.price}{" "}
                            {JSON.parse(bookingDetail)?.serviceById?.currency}
                        </span>
                    </p>
                </div>
            </div>
            <div className="">
                <p className="text-[14px] font-semibold">{t("bookingName")}</p>
                <input
                    type="text"
                    {...formik.getFieldProps("username")}
                    className={`w-full py-3 px-3 mt-1 border rounded-lg text-[14px] font-normal ${
                        formik.errors?.username
                            ? "border-2 border-rose-500"
                            : "border"
                    }`}
                    placeholder="สมชาย"
                />
                {formik.touched.username && formik.errors.username && (
                    <span className="text-[14px] text-rose-500">
                        {formik.errors?.username}
                    </span>
                )}
            </div>
            <div className="">
                <p className="text-[14px] font-semibold">
                    {t("bookingNumbers")}
                </p>
                <input
                    type="text"
                    {...formik.getFieldProps("phoneNumbers")}
                    className={`w-full py-3 px-3 mt-1 border rounded-lg text-[14px] font-normal ${
                        formik.errors?.phoneNumbers
                            ? "border-2 border-rose-500"
                            : "border"
                    }`}
                    placeholder="012 345 6789"
                />
                {formik.touched.phoneNumbers && formik.errors.phoneNumbers && (
                    <span className="text-[14px] text-rose-500">
                        {formik.errors?.phoneNumbers}
                    </span>
                )}
            </div>
            <div className="">
                <p className="text-[14px] font-semibold">{t("notes")}</p>
                <textarea
                    rows={3}
                    {...formik.getFieldProps("additionalNotes")}
                    className="w-full py-3 px-3 mt-1 border rounded-lg text-[14px] font-normal"
                    placeholder="ตัวอย่าง ตัดผมโดยสปาและทรีทเมนท์"
                />
            </div>
            <div className="flex flex-col py-2">
                <label htmlFor="" className="text-[12px] text-[#5C5C5C]">
                    {t("termsAndprivacy")}
                </label>
            </div>
            <button
                type="button"
                className="bg-[#020873] w-full text-white p-2 rounded-lg"
                onClick={createReservation}
            >
                {t("button:confirmBookingButton")}
            </button>
        </div>
    );
};

export default BookingDetailsPreview;
