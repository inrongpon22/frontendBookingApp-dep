import { useContext, useEffect } from "react";
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

const BusinessProfile = () => {
    const { businessId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { setDialogState, setIsGlobalLoading, setShowDialog } =
        useContext(GlobalContext);

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
        .sort((a, b) => moment(a.bookingDate).diff(moment(b.bookingDate)));

    useEffect(() => {
        setIsGlobalLoading(getReservationByBusinessIdLoading);
    }, [getReservationByBusinessIdLoading]);

    return (
        <div className="flex flex-col h-dvh bg-[#F7F7F7]">
            {/* headers */}
            <div className="flex justify-between items-center bg-white p-5">
                <p className="text-[22px] font-semibold">
                    {businessData?.title}
                </p>
                <div className="flex items-center gap-3">
                    {/* <Badge
                        color="warning"
                        variant="dot"
                        className="cursor-pointer"
                        onClick={() => toast("coming soon")}
                    >
                        <NotificationsActiveOutlinedIcon fontSize="small" />
                    </Badge> */}
                    <Badge
                        color="secondary"
                        variant="standard"
                        className="cursor-pointer"
                        onClick={() => {
                            setDialogState("business-more-options");
                            setShowDialog(true);
                        }}
                    >
                        <SettingsOutlinedIcon fontSize="small" />
                    </Badge>
                </div>
            </div>
            {/* headers */}

            <div className="w-full bg-white">
                <div className="text-[14px] text-[#A1A1A1] font-bold px-5">
                    {t("pending")}
                </div>

                {/* pending section */}
                <div className="bg-white w-full">
                    {pendingBookings?.map(
                        (item: Ireservation, index: number) => {
                            return (
                                <div
                                    // Link to={`/booking-approval/${businessId}/${item.serviceId}`}
                                    key={index}
                                    className="flex justify-between cursor-pointer hover:bg-gray-100 px-5 py-3"
                                    onClick={() =>
                                        navigate(
                                            `/booking-approval/${businessId}/${item.serviceId}`,
                                            {
                                                state: item,
                                            }
                                        )
                                    }
                                >
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
                                                {item.startTime.slice(0, -3)} -{" "}
                                                {item.endTime.slice(0, -3)}
                                            </span>
                                            <span className="w-[3px] h-[3px] bg-black rounded-full self-center" />
                                            <span>
                                                {moment(
                                                    item.bookingDate
                                                ).format("DD MMM")}
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
                    )}
                </div>
                {/* pending section */}
            </div>

            {/* today section */}
            <div className="text-[14px] bg-white p-5 mt-2">
                <div className="flex justify-between">
                    <p className="font-bold text-zinc-400">Today</p>
                    {/* <p className="font-bold text-[12px] underline" onClick={() => toast("coming soon")}>View all</p> */}
                </div>

                <div className="flex flex-col gap-5 py-5">
                    {todayBookings?.map((item: Ireservation, index: number) => {
                        return (
                            <div key={index} className="flex justify-between">
                                <div className="flex gap-2">
                                    <p
                                        className={`${
                                            item.status === "approval"
                                                ? "bg-deep-blue bg-opacity-10 text-deep-blue"
                                                : "bg-zinc-200 text-zinc-400"
                                        } px-1 rounded`}
                                    >
                                        {item.startTime.slice(0, -3)}
                                    </p>
                                    <p
                                        className={`${
                                            item.status === "approval"
                                                ? ""
                                                : "text-zinc-400"
                                        } font-semibold`}
                                    >
                                        {item.title}
                                    </p>
                                </div>
                                <p
                                    className={
                                        item.status === "approval"
                                            ? ""
                                            : "text-zinc-400"
                                    }
                                >
                                    {item.status === "approval"
                                        ? item.userName
                                        : "Cancel"}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* today section */}

            <DialogWrapper userSide="business" />
        </div>
    );
};

export default BusinessProfile;
