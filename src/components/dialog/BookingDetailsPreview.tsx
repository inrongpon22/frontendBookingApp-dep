import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DialogContext } from "./DialogWrapper";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { app_api } from "../../helper/url";
import toast from "react-hot-toast";
import { GlobalContext } from "../../contexts/BusinessContext";
import moment from "moment";
import { Switch, SwitchProps, styled } from "@mui/material";
import { getReservationByBusinessId } from "../../api/booking";
import { getUserIdByAccessToken } from "../../api/user";

const IOSSwitch = styled((props: SwitchProps) => (
    <Switch
        focusVisibleClassName=".Mui-focusVisible"
        disableRipple
        {...props}
    />
))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
        padding: 0,
        margin: 2,
        transitionDuration: "300ms",
        "&.Mui-checked": {
            transform: "translateX(16px)",
            color: "#fff",
            "& + .MuiSwitch-track": {
                backgroundColor: "#35398F",
                opacity: 1,
                border: 0,
            },
            "&.Mui-disabled + .MuiSwitch-track": {
                opacity: 0.5,
            },
        },
        "&.Mui-focusVisible .MuiSwitch-thumb": {
            color: "#33cf4d",
            border: "6px solid #fff",
        },
        "&.Mui-disabled .MuiSwitch-thumb": {
            color:
                theme.palette.mode === "light"
                    ? theme.palette.grey[100]
                    : theme.palette.grey[600],
        },
        "&.Mui-disabled + .MuiSwitch-track": {
            opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
        },
    },
    "& .MuiSwitch-thumb": {
        boxSizing: "border-box",
        width: 22,
        height: 22,
    },
    "& .MuiSwitch-track": {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
        opacity: 1,
        transition: theme.transitions.create(["background-color"], {
            duration: 500,
        }),
    },
}));

const BookingDetailsPreview = () => {
    const { businessId } = useParams();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const bookingDetail = localStorage.getItem("bookingDetail") ?? "";

    const token = localStorage.getItem("token");
    const accessToken = localStorage.getItem("accessToken");

    // const [userId, setUserId] = useState<number>(0)

    const { formik } = useContext<any>(DialogContext);

    const { setIsGlobalLoading, setShowDialog, setDialogState } =
        useContext(GlobalContext);

    const { mutateReservationByBusinessId } = getReservationByBusinessId(
        Number(businessId),
        "all"
    ); // get reservation by bussiness id

    const {
        t,
        i18n: { language },
    } = useTranslation();

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
        // setUserId(res)
        if (token && formik.values.userId === 0) {
            getUserIdByAccessToken(accessToken ?? "", token ?? "").then(
                (userId) =>
                    axios
                        .get(`${app_api}/user/${userId}`, {
                            headers: {
                                Authorization: `${token}`,
                            },
                        })
                        .then((res: any) => {
                            console.log(res.data);
                            formik.setValues({
                                userId: Number(res.data.id),
                                username: res.data.name ?? "",
                                phoneNumbers: res.data.phoneNumber,
                                otp: "",
                                additionalNotes: "",
                                isSendSMS: true,
                                isBusinessOnly: false,
                            });
                        })
            );
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
            userName: formik.values.isBusinessOnly
                ? "โดยร้านค้า"
                : formik.values.username,
            bookingDate: moment(
                JSON.parse(bookingDetail).selectedDate.date
            ).format("YYYY-MM-DD"),
            guestNumber: JSON.parse(bookingDetail)?.guestNumber,
        };

        await axios
            .post(
                `${app_api}/${
                    pathname.includes("business")
                        ? `makeMutiReservationByBus/${language}/${
                              formik.values.isBusinessOnly
                                  ? false
                                  : formik.values.isSendSMS
                          }`
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
                    mutateReservationByBusinessId();
                    setDialogState("business-more-options");
                    setShowDialog(false);
                    toast.success("การสร้างการจองด้วยตัวเองสำเร็จ");
                    localStorage.removeItem("bookingDetail");
                    formik.resetForm();
                } else {
                    navigate(`/booking/${res.data.reservationId}`);
                }
            })
            .catch((err) => {
                console.log(err.response.data.message);
                setIsGlobalLoading(false);
                toast.error("มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง");
            });
    };

    const getFirst = filterSelected[0];
    const getLast = filterSelected[filterSelected?.length - 1];

    return (
        <div className="flex flex-col gap-4">
            <div className="">
                <p className="text-[14px] font-semibold">
                    {t("bookingDetails")}
                </p>
                <div className="flex flex-col gap-4 border rounded-md p-3 mt-1">
                    <p className="flex justify-between">
                        <span>{t("services")}:</span>
                        <span className="text-[1rem] font-bold">
                            {JSON.parse(bookingDetail)?.serviceById.title}
                        </span>
                    </p>
                    <p className="flex justify-between">
                        <span>{t("date")}:</span>
                        <span className="text-[1rem] font-bold">
                            {moment(
                                JSON.parse(bookingDetail).selectedDate.date
                            ).format("MMMM DD, YYYY")}
                        </span>
                    </p>
                    <p className="flex justify-between">
                        <span>{t("time")}:</span>
                        <span className="text-[1rem] font-bold">
                            {`${getFirst?.startTime} - ${getLast?.endTime}`}
                        </span>
                    </p>
                    <p className="flex justify-between">
                        <span>{t("guests")}:</span>
                        <span className="text-[.9rem] font-bold">
                            {JSON.parse(bookingDetail).guestNumber}
                        </span>
                    </p>
                    <p className="flex justify-between">
                        <span>{t("price")}:</span>
                        <span className="text-[1rem] font-bold">
                            {JSON.parse(bookingDetail)?.serviceById?.price}{" "}
                            {JSON.parse(bookingDetail)?.serviceById?.currency}
                        </span>
                    </p>
                </div>
            </div>

            <div
                className={`${
                    pathname.includes("business") ? "" : "hidden"
                } flex justify-between items-center border rounded-lg p-3`}
            >
                <p className="flex flex-col pe-10">
                    <span className="text-[14px] font-bold">
                        จองไว้สำหรับร้านค้าเท่านั้น
                    </span>
                    <span className="text-[12px] font-normal">
                        ลูกค้าจะไม่สามารถใช้บริการในวันและเวลาที่ร้านสำรองไว้ได้
                    </span>
                </p>
                <IOSSwitch
                    checked={formik.values.isBusinessOnly}
                    onChange={(e) =>
                        formik.setFieldValue("isBusinessOnly", e.target.checked)
                    }
                />
            </div>
            <div className={formik.values.isBusinessOnly ? "hidden" : "mt-0 flex flex-col gap-3"}>
                <div>
                <p className="flex justify-between items-center text-[14px] font-semibold">
                    <span>{t("bookingName")}</span>
                </p>
                <input
                    type="text"
                    {...formik.getFieldProps("username")}
                    className={`w-full py-3 px-3 mt-1 border rounded-lg text-[14px] font-normal ${
                        formik.touched.username && formik.errors.username
                            ? "border-2 border-rose-500"
                            : "border"
                    }`}
                    placeholder="ชื่อที่ต้องการใช้จอง"
                />
                {formik.touched.username && formik.errors.username && (
                    <span className="text-[14px] text-rose-500">
                        {formik.errors?.username}
                    </span>
                )}
                </div>
                <div className="mt-0">
                    <p className="flex justify-between items-center text-[14px] font-semibold">
                        <span>{t("bookingNumbers")}</span>
                    </p>
                    <input
                        type="text"
                        {...formik.getFieldProps("phoneNumbers")}
                        className={`w-full py-3 px-3 mt-1 border rounded-lg text-[14px] font-normal ${
                            formik.touched.phoneNumbers &&
                            formik.errors.phoneNumbers
                                ? "border-2 border-rose-500"
                                : "border"
                        }`}
                        placeholder="เบอร์โทรศัพท์ที่ต้องการใช้จอง"
                    />
                    {formik.touched.phoneNumbers &&
                        formik.errors.phoneNumbers && (
                            <span className="text-[14px] text-rose-500">
                                {formik.errors?.phoneNumbers}
                            </span>
                        )}
                    <div
                        className={`${
                            pathname.includes("business") ? "" : "hidden"
                        } flex justify-between items-center border rounded-lg p-3 mt-2`}
                    >
                        <p className="flex flex-col pe-10">
                            <span className="text-[14px] font-bold">
                                ส่งข้อความ SMS
                            </span>
                            <span className="text-[12px] font-normal">
                                เราจะส่งข้อความ SMS รายละเอียดการจองเช่น วันที่
                                เวลา ประเภทของบริการ และอื่นๆ
                            </span>
                        </p>
                        <IOSSwitch
                            checked={formik.values.isSendSMS}
                            onChange={(e) =>
                                formik.setFieldValue(
                                    "isSendSMS",
                                    e.target.checked
                                )
                            }
                        />
                    </div>
                </div>
                <div className="mt-0">
                    <p className="text-[14px] font-semibold">{t("notes")}</p>
                    <textarea
                        rows={3}
                        {...formik.getFieldProps("additionalNotes")}
                        className="w-full py-3 px-3 mt-1 border rounded-lg text-[14px] font-normal"
                        placeholder="รายละเอียดที่ต้องการเพิ่มเติม"
                    />
                </div>
                <div className="flex flex-col py-0">
                    <label htmlFor="" className="text-[12px] text-[#5C5C5C]">
                        {t("termsAndprivacy")}
                    </label>
                </div>
            </div>
            <button
                type="button"
                className={`${
                    (formik.errors?.phoneNumbers && formik.values.isSendSMS) ||
                    formik.errors?.username
                        ? "bg-gray-400"
                        : "bg-deep-blue"
                } w-full text-white p-3 rounded-lg`}
                disabled={
                    formik.errors?.username || formik.errors?.phoneNumbers
                }
                onClick={createReservation}
            >
                {t("button:confirmBookingButton")}
            </button>
        </div>
    );
};

export default BookingDetailsPreview;
