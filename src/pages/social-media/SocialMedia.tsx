import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/social-media/Header";
import { t } from "i18next";
import { Divider, alpha } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import Loading from "../../components/dialog/Loading";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import {
    connectToLine,
    disConnectToLine,
    getUserIdByAccessToken,
    getUserPhoneLine,
} from "../../api/user";
import { GlobalContext } from "../../contexts/BusinessContext";
import DialogWrapper from "../../components/dialog/DialogWrapper";
import { disconnectPhoneNumber } from "../../api/otp";

export default function SocialMedia() {
    const navigate = useNavigate();
    const { businessId } = useParams();
    const [isLoadding, setIsLoading] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const queryParams = new URLSearchParams(location.search);
    const [userPhoneLine, setUserPhoneLine] = useState<{
        phoneNumber: string;
        line_userId: string;
    }>();
    const connectTo = queryParams.get("connectTo");

    useEffect(() => {
        const fetch = async () => {
            const token = localStorage.getItem("token");
            const accessToken = localStorage.getItem("accessToken");
            const userId = await getUserIdByAccessToken(
                accessToken ?? "",
                token ?? ""
            );
            const userPhoneLine = await getUserPhoneLine(userId);
            setUserPhoneLine(userPhoneLine);
        };
        if (businessId) fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh]);

    const handleConnectToLine = async () => {
        const token = localStorage.getItem("token");
        const accessToken = localStorage.getItem("accessToken");
        const userId = await getUserIdByAccessToken(
            accessToken ?? "",
            token ?? ""
        );
        setIsLoading(true);
        if (businessId) {
            await connectToLine(userId, businessId ?? "").then((res) =>
                window.location.replace(res.data.loginUrl)
            );
        }
        setIsLoading(false);
    };

    const handleDisConnectToLine = async () => {
        const token = localStorage.getItem("token");
        const accessToken = localStorage.getItem("accessToken");
        const userId = await getUserIdByAccessToken(
            accessToken ?? "",
            token ?? ""
        );
        setIsLoading(true);
        setRefresh(!refresh);
        await disConnectToLine(userId);
        setIsLoading(false);
    };

    const { setDialogState, setShowDialog } = useContext(GlobalContext);

    const handleConnectToPhone = async () => {
        setDialogState("phone-input");
        setShowDialog(true);
    };

    const handleDisConnectToPhone = async () => {
        setIsLoading(true);
        await disconnectPhoneNumber().then(() => {
            setRefresh(!refresh);
            setIsLoading(false);
        });
    };

    return (
        <div className="flex flex-col">
            <Loading openLoading={isLoadding} />
            <div className="px-4 pt-6">
                <Header
                    context={t("title:socialmediaaccounts")}
                    handleClose={() =>
                        navigate(`/business-profile/${businessId}`)
                    }
                />
            </div>
            <Divider sx={{ marginTop: "16px", width: "100%" }} />
            <div>
                {connectTo === "phone" ? (
                    <div className="flex justify-between px-4 py-4">
                        <div className="flex items-center">
                            <PhoneAndroidIcon
                                sx={{ width: "32px", height: "32px" }}
                            />
                            <div className="flex-col ml-3">
                                <div
                                    className="font-bold"
                                    style={{
                                        fontFamily: "Jakarta Sans, sans-serif",
                                    }}>
                                    {t("phone")}
                                </div>
                                <div className="text-[12px] text-[#A1A1A1]">
                                    {(userPhoneLine &&
                                        userPhoneLine?.phoneNumber == "") ||
                                    userPhoneLine?.phoneNumber == null
                                        ? t("desc:unconnected")
                                        : t("desc:connected")}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <button
                                onClick={
                                    userPhoneLine?.phoneNumber == "" ||
                                    userPhoneLine?.phoneNumber == null
                                        ? () => handleConnectToPhone()
                                        : () => handleDisConnectToPhone()
                                }
                                style={{
                                    fontFamily: "Jakarta Sans, sans-serif",
                                    backgroundColor: alpha("#35398F", 0.1),
                                }}
                                className="text-[#35398F] font-bold text-sm p-[8px] rounded-md ">
                                {(userPhoneLine &&
                                    userPhoneLine?.phoneNumber == "") ||
                                userPhoneLine?.phoneNumber == null
                                    ? t("button:connect")
                                    : t("button:disconnect")}
                            </button>
                        </div>
                    </div>
                ) : connectTo === "line" ? (
                    <div className="flex justify-between px-4 py-4">
                        <div className="flex items-center">
                            <img src="/LINE_logo.png" className="w-8 h-8 " />
                            <div className="flex-col ml-3">
                                <div
                                    className="font-bold"
                                    style={{
                                        fontFamily: "Jakarta Sans, sans-serif",
                                    }}>
                                    {t("line")}
                                </div>
                                <div className="text-[12px] text-[#A1A1A1]">
                                    {(userPhoneLine &&
                                        userPhoneLine?.line_userId == "") ||
                                    userPhoneLine?.line_userId == null
                                        ? t("desc:unconnected")
                                        : t("desc:connected")}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={
                                    userPhoneLine?.line_userId == "" ||
                                    userPhoneLine?.line_userId == null
                                        ? () => handleConnectToLine()
                                        : () => handleDisConnectToLine()
                                }
                                style={{
                                    fontFamily: "Jakarta Sans, sans-serif",
                                    backgroundColor: alpha("#35398F", 0.1),
                                }}
                                className="text-[#35398F] font-bold text-sm p-[8px] rounded-md ">
                                {(userPhoneLine &&
                                    userPhoneLine?.line_userId == "") ||
                                userPhoneLine?.line_userId == null
                                    ? t("button:connect")
                                    : t("button:disconnect")}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between px-4 py-4">
                            <div className="flex items-center">
                                <img
                                    src="/LINE_logo.png"
                                    className="w-8 h-8 "
                                />
                                <div className="flex-col ml-3">
                                    <div
                                        className="font-bold"
                                        style={{
                                            fontFamily:
                                                "Jakarta Sans, sans-serif",
                                        }}>
                                        {t("line")}
                                    </div>
                                    <div className="text-[12px] text-[#A1A1A1]">
                                        {(userPhoneLine &&
                                            userPhoneLine?.line_userId == "") ||
                                        userPhoneLine?.line_userId == null
                                            ? t("desc:unconnected")
                                            : t("desc:connected")}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <button
                                    disabled={
                                        (userPhoneLine &&
                                            userPhoneLine?.phoneNumber == "") ||
                                        userPhoneLine?.phoneNumber == null
                                    }
                                    onClick={
                                        userPhoneLine?.line_userId == "" ||
                                        userPhoneLine?.line_userId == null
                                            ? () => handleConnectToLine()
                                            : () => handleDisConnectToLine()
                                    }
                                    style={{
                                        fontFamily: "Jakarta Sans, sans-serif",
                                        backgroundColor:
                                            (userPhoneLine &&
                                                userPhoneLine?.phoneNumber ==
                                                    "") ||
                                            userPhoneLine?.phoneNumber == null
                                                ? alpha("#888888", 0.1)
                                                : alpha("#35398F", 0.1),
                                        color:
                                            (userPhoneLine &&
                                                userPhoneLine?.phoneNumber ==
                                                    "") ||
                                            userPhoneLine?.phoneNumber == null
                                                ? alpha("#888888", 0.5)
                                                : "#35398F",
                                    }}
                                    className="font-bold text-sm p-[8px] rounded-md ">
                                    {(userPhoneLine &&
                                        userPhoneLine?.line_userId == "") ||
                                    userPhoneLine?.line_userId == null
                                        ? t("button:connect")
                                        : t("button:disconnect")}
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between px-4 py-4">
                            <div className="flex items-center">
                                <PhoneAndroidIcon
                                    sx={{ width: "32px", height: "32px" }}
                                />
                                <div className="flex-col ml-3">
                                    <div
                                        className="font-bold"
                                        style={{
                                            fontFamily:
                                                "Jakarta Sans, sans-serif",
                                        }}>
                                        {t("phone")}
                                    </div>
                                    <div className="text-[12px] text-[#A1A1A1]">
                                        {(userPhoneLine &&
                                            userPhoneLine?.phoneNumber == "") ||
                                        userPhoneLine?.phoneNumber == null
                                            ? t("desc:unconnected")
                                            : t("desc:connected")}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <button
                                    disabled={
                                        (userPhoneLine &&
                                            userPhoneLine?.line_userId == "") ||
                                        userPhoneLine?.line_userId == null
                                    }
                                    onClick={
                                        userPhoneLine?.phoneNumber == "" ||
                                        userPhoneLine?.phoneNumber == null
                                            ? () => handleConnectToPhone()
                                            : () => handleDisConnectToPhone()
                                    }
                                    style={{
                                        fontFamily: "Jakarta Sans, sans-serif",
                                        backgroundColor:
                                            (userPhoneLine &&
                                                userPhoneLine?.line_userId ==
                                                    "") ||
                                            userPhoneLine?.line_userId == null
                                                ? alpha("#000000", 0.1)
                                                : alpha("#35398F", 0.1),
                                        color:
                                            (userPhoneLine &&
                                                userPhoneLine?.line_userId ==
                                                    "") ||
                                            userPhoneLine?.line_userId == null
                                                ? alpha("#888888", 0.5)
                                                : "#35398F",
                                    }}
                                    className="font-bold text-sm p-[8px] rounded-md ">
                                    {(userPhoneLine &&
                                        userPhoneLine?.phoneNumber == "") ||
                                    userPhoneLine?.phoneNumber == null
                                        ? t("button:connect")
                                        : t("button:disconnect")}
                                </button>
                            </div>
                        </div>
                    </>
                )}
                <Divider sx={{ width: "100%" }} />
                {/* <p className="text-xs p-2 flex justify-center">
                    {t("desc:coneectLine")}
                </p> */}
            </div>
            <DialogWrapper userSide="business" />
        </div>
    );
}
