/** @format */
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GlobalContext } from "../../contexts/BusinessContext";
import toast from "react-hot-toast";
// api
import axios from "axios";
import moment from "moment";
import useSWR from "swr";
import { app_api } from "../../helper/url";
// icons
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
// components
import DialogWrapper from "../../components/dialog/DialogWrapper";
import { Badge } from "@mui/material";
import IsConnectLine from "./IsConnectLine";
import IsHomeScreenApp from "./IsHomeScreenApp";

const MyBookingWrapper = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const { t } = useTranslation();

    const { setIsGlobalLoading, setShowDialog, setDialogState } =
        useContext(GlobalContext);

    // const [upComingBooking, setUpComingBooking] = useState([]);
    // const [pastBooking, setPastBooking] = useState([]);

    // handle alert state
    const [isShowLine, setIsShowLine] = useState<boolean>(true);
    const [isShowSaveToHomeScreen, setIsShowSaveToHomeScreen] =
        useState<boolean>(true);

    const { data: myReservDatas, isLoading } = useSWR(
        token &&
            `${app_api}/getReservationByUserId/${
                userId ? userId : location.state.userId
            }?page=1&limit=1000`,
        (url: string) =>
            axios
                .get(url, {
                    headers: {
                        Authorization: token,
                    },
                })
                .then((res) => res.data)
                .catch((err) => {
                    console.log(err);
                    toast.error("มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง");
                })
    );

    useEffect(() => {
        document.title = t("title:myBookings");
        if (!token) {
            setShowDialog(true);
        }
    }, []);

    useEffect(() => {
        setIsGlobalLoading(isLoading);
    }, [isLoading]);

    return (
        <>
            <div className="flex flex-col h-dvh gap-4 bg-[#F7F7F7]">
                <div>
                    <span className="flex justify-between items-center text-[17px] font-semibold bg-white p-5">
                        {t("title:myBookings")}
                        {/* <SearchRoundedIcon /> */}
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
                    </span>

                    {isShowLine && (
                        <IsConnectLine
                            handleConnectLine={() => navigate("/connect-line")}
                            handleClose={() => setIsShowLine(false)}
                        />
                    )}

                    {isShowSaveToHomeScreen && (
                        <IsHomeScreenApp
                            handleLearnMore={() => console.log("first")}
                            handleClose={() => setIsShowSaveToHomeScreen(false)}
                        />
                    )}
                </div>

                <div className="flex flex-col gap-4 px-3">
                    {myReservDatas && myReservDatas.length > 0 ? (
                        myReservDatas.map((item: any, index: number) => {
                            return (
                                <div
                                    key={index}
                                    className="border rounded-lg p-5 bg-white cursor-pointer"
                                    onClick={() =>
                                        navigate(`/booking/${item.id}`)
                                    }
                                >
                                    <div className="flex justify-between">
                                        <span className="text-[14px] font-bold">
                                            {item.title}
                                        </span>
                                        <div className="flex flex-col">
                                            <span
                                                className={`text-end text-[14px] font-bold ${
                                                    item.status === "pending"
                                                        ? "text-[#F0AD4E]"
                                                        : item.status ===
                                                          "approval"
                                                        ? "text-[#2E7CF6]"
                                                        : "text-[#A1A1A1]"
                                                }`}
                                            >
                                                {item.status === "pending"
                                                    ? t("pending")
                                                    : item.status === "approval"
                                                    ? t("approved")
                                                    : t("cancelled")}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="flex gap-1 text-[12px] font-normal">
                                            <AccessTimeRoundedIcon fontSize="small" />
                                            <span>
                                                {item.startTime.slice(0, -3)} -{" "}
                                                {item.endTime.slice(0, -3)},{" "}
                                                {moment(
                                                    item.bookingDate
                                                ).format("D MMM")}
                                            </span>
                                        </p>
                                        <div className="flex items-center text-[12px] font-normal gap-1">
                                            <span className="flex items-center">
                                                <PersonOutlineRoundedIcon fontSize="small" />
                                                {item.guestNumber}
                                            </span>
                                            <span className="w-[4px] h-[4px] bg-[#A1A1A1] rounded"></span>
                                            <span>฿{item.price}</span>
                                        </div>
                                    </div>
                                    <p className="flex gap-1 text-[12px] font-normal mt-2">
                                        <LocationOnOutlinedIcon fontSize="small" />
                                        <span>{item.address}</span>
                                    </p>
                                    <p className="flex gap-5 text-[12px] font-normal mt-5">
                                        {false && ( // no feature call yet
                                            <span className="flex items-center cursor-pointer hover:text-deep-blue">
                                                Call
                                                <NavigateNextRoundedIcon fontSize="small" />
                                            </span>
                                        )}
                                        <span className="flex items-center hover:text-deep-blue">
                                            {t("desc:viewMoreDetails")}
                                            <NavigateNextRoundedIcon fontSize="small" />
                                        </span>
                                    </p>
                                </div>
                            );
                        })
                    ) : (
                        <>Loading...</>
                    )}
                </div>
            </div>
            <DialogWrapper userSide="user" />
        </>
    );
};

export default MyBookingWrapper;
