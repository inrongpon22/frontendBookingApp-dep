import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../contexts/BusinessContext";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
// interface
import { Ireservation } from "../../interfaces/reservation";
// api
import { getBusinessId } from "../../api/business";
import { getReservationByBusinessId } from "../../api/booking";
// icons
// import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import DialogWrapper from "../../components/dialog/DialogWrapper";
// styled
import { Badge } from "@mui/material";
import moment from "moment";
import { monthsOfYearFullName } from "../../helper/monthsOfYear";
// components
import FirstTimeCongrat from "./FirstTimeCongrat";
import FirstTimeAddMoreService from "./FirstTimeAddMoreService";
import { dayOfWeekFullName } from "../../helper/daysOfWeek";

const BusinessProfile = () => {
    const { businessId } = useParams();
    const navigate = useNavigate();
    // const token = localStorage.getItem("token");
    const {
        t,
        i18n: { language },
    } = useTranslation();

    const { setDialogState, setIsGlobalLoading, setShowDialog } =
        useContext(GlobalContext);

    const [congAlert, setCongAlert] = useState<boolean>(true);
    const [addMoreService, setAddMoreService] = useState<boolean>(true);

    const { businessData } = getBusinessId(Number(businessId)); // get business data

    const {
        getReservationByBusinessIdData,
        getReservationByBusinessIdLoading,
    } = getReservationByBusinessId(Number(businessId), "all"); // get reservation by bussiness id

    // filter only pending
    const pendingBookings = getReservationByBusinessIdData?.filter(
        (item: Ireservation) => item.status === "pending"
    );

    // filter only today and sort by time
    const todayBookings = getReservationByBusinessIdData
        ?.filter(
            (item: Ireservation) =>
                (moment(item.bookingDate).isSame(moment(), "day") &&
                    item.status === "approval") ||
                (moment(item.bookingDate).isSame(moment(), "day") &&
                    item.status === "cancel")
        )
        .map((item: any) => {
            const [hours, minutes, seconds] = item.startTime.split(":");
            const combinedBookingDate = moment(item.bookingDate)
                .utc()
                .set({ hour: hours, minute: minutes, second: seconds });

            return { ...item, bookingDate: combinedBookingDate };
        })
        .sort((a: any, b: any) =>
            moment(a.bookingDate).diff(moment(b.bookingDate))
        );

    useEffect(() => {
        setIsGlobalLoading(getReservationByBusinessIdLoading);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getReservationByBusinessIdLoading]);

    // useEffect(() => {
    //     if (!token) {
    //         navigate("/");
    //     }
    // }, []);

    return (
        <div className="flex flex-col h-dvh bg-[#F7F7F7] overflow-x-hidden">
            {/* headers */}
            <div className="flex justify-between items-center bg-white p-5">
                <p className="text-[22px] font-semibold text-deep-blue text-opacity-80">
                    {businessData?.title}
                </p>
                <div className="flex items-center gap-3">
                    {/* <Badge
                        color="warning"
                        variant="dot"
                        className="cursor-pointer"
                        onClick={() => toast("coming soon")}>
                        <NotificationsActiveOutlinedIcon fontSize="small" />
                    </Badge> */}
                    <Badge
                        color="secondary"
                        variant="standard"
                        className="cursor-pointer"
                        onClick={() => {
                            setDialogState("business-more-options");
                            setShowDialog(true);
                        }}>
                        <SettingsOutlinedIcon fontSize="small" />
                    </Badge>
                </div>
            </div>
            {/* headers */}

            {getReservationByBusinessIdData?.length === 0 && congAlert && (
                <FirstTimeCongrat handleClose={() => setCongAlert(false)} />
            )}

            {getReservationByBusinessIdData?.length === 0 && addMoreService && (
                <FirstTimeAddMoreService
                    handleClose={() => setAddMoreService(false)}
                />
            )}

            <div className="w-full bg-white">
                <div className="text-[14px] text-[#A1A1A1] font-bold px-5 pt-5">
                    {t("pending")}
                </div>

                {/* pending section */}
                <div className="bg-white w-full">
                    {pendingBookings?.length > 0 ? (
                        pendingBookings?.map(
                            (item: Ireservation, index: number) => {
                                return (
                                    <div
                                        // Link to={`/booking-approval/${businessId}`}
                                        key={index}
                                        className="flex justify-between cursor-pointer hover:bg-gray-100 px-5 py-3"
                                        onClick={() =>
                                            navigate(
                                                `/booking-approval/${businessId}`,
                                                {
                                                    state: item,
                                                }
                                            )
                                        }>
                                        <div className="flex flex-col">
                                            <p className="flex items-center gap-1">
                                                <span className="text-[14px] font-semibold">
                                                    {item.title}
                                                </span>
                                                <span className="flex items-center text-deep-blue bg-deep-blue bg-opacity-10 rounded-lg px-1">
                                                    {item.guestNumber > 1 ? (
                                                        <PeopleAltOutlinedIcon fontSize="small" />
                                                    ) : (
                                                        <PersonOutlinedIcon fontSize="small" />
                                                    )}
                                                    {item.guestNumber}
                                                </span>
                                            </p>
                                            <p className="flex gap-1 text-[14px]">
                                                <span>
                                                    {item.startTime.slice(
                                                        0,
                                                        -3
                                                    )}{" "}
                                                    -{" "}
                                                    {item.endTime.slice(0, -3)}
                                                </span>
                                                <span className="w-[3px] h-[3px] bg-black rounded-full self-center" />
                                                <span>
                                                    {`${moment(
                                                        item.bookingDate
                                                    ).format("D")} ${monthsOfYearFullName(
                                                        language
                                                    )?.find(
                                                        (ii) =>
                                                            ii.value ===
                                                            moment(
                                                                item.bookingDate
                                                            ).format("MMMM")
                                                    )?.name ?? ""
                                                        }`}
                                                </span>
                                                <span className="w-[3px] h-[3px] bg-black rounded-full self-center" />
                                                <span>{item.userName}</span>
                                            </p>
                                        </div>
                                        <p className="flex flex-col gap-1 text-end justify-center">
                                            <NavigateNextIcon className="text-deep-blue" />
                                        </p>
                                    </div>
                                );
                            }
                        )
                    ) : (
                        <span className="flex justify-center text-[#A1A1A1] text-[12px] font-normal py-3">
                            คุณยังไม่มีรายการจองที่รออนุมัติ
                        </span>
                    )}
                </div>
                {/* pending section */}
            </div>

            {/* today section */}
            <div className="text-[14px] bg-white p-5 mt-2">
                <div className="flex justify-between items-center">
                    <p className="font-bold text-zinc-400">
                        {`วันนี้ 
                        วัน${dayOfWeekFullName(language)?.find(
                            (ii) => ii.value === moment().format("dddd")
                        )?.name ?? ""
                            }, ${moment().format("D")} ${monthsOfYearFullName(language)?.find(
                                (ii) => ii.value === moment().format("MMMM")
                            )?.name ?? ""
                            } ${language === "th"
                                ? Number(moment().format("YYYY")) + 543
                                : moment().format("YYYY")
                            }`}
                    </p>
                    <p
                        className="font-bold text-[10px] text-deep-blue text-opacity-60 underline"
                        onClick={() =>
                            navigate(`/booking-approval/${businessId}`)
                        }>
                        View all
                    </p>
                </div>

                <div className="flex flex-col gap-5 py-5">
                    {/* time indicator */}
                    {/* <Divider sx={{ width: "120%", translate:"-10%" }} >
                        <span className="text-red-400 font-bold">Now, {moment().format("HH:mm")}</span>
                    </Divider> */}
                    {/* time indicator */}
                    {todayBookings?.length > 0 ? (
                        todayBookings?.map(
                            (item: Ireservation, index: number) => {
                                return (
                                    <div
                                        key={index}
                                        className="flex justify-between">
                                        <div className="flex gap-2">
                                            <p
                                                className={`${item.status === "approval"
                                                        ? "bg-deep-blue bg-opacity-10 text-deep-blue"
                                                        : "bg-zinc-200 text-zinc-400"
                                                    } px-1 rounded`}>
                                                {item.startTime.slice(0, -3)}
                                            </p>
                                            <p
                                                className={`${item.status === "approval"
                                                        ? ""
                                                        : "text-zinc-400"
                                                    } font-semibold`}>
                                                {item.title}
                                            </p>
                                        </div>
                                        <p
                                            className={`flex ${item.status === "approval"
                                                    ? ""
                                                    : "text-zinc-400"
                                                }`}>
                                            <span>
                                                {item.status === "approval"
                                                    ? item.userName
                                                    : "Cancel"}
                                            </span>
                                            {/* <span
                                        className="flex flex-col gap-1 text-end justify-center"
                                        onClick={() =>
                                            navigate(
                                                `/booking-approval/${businessId}/${item.serviceId}`,
                                                {
                                                    state: item,
                                                }
                                            )
                                        }
                                    >
                                        <NavigateNextIcon className="text-deep-blue" />
                                    </span> */}
                                        </p>
                                    </div>
                                );
                            }
                        )
                    ) : (
                        <span className="flex justify-center text-[#A1A1A1] text-[12px] font-normal py-3">
                            คุณยังไม่มีรายการที่เข้ามารับบริการในวันนี้
                        </span>
                    )}
                </div>
            </div>
            {/* today section */}

            <DialogWrapper userSide="business" />
        </div>
    );
};

export default BusinessProfile;
