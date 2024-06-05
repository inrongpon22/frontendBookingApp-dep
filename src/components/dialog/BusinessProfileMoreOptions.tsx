import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
// helper
// import { shareBookingLink } from "../../helper/alerts";
// icons
import LinkIcon from "@mui/icons-material/Link";
import EditCalendarOutlinedIcon from "@mui/icons-material/EditCalendarOutlined";
import StoreIcon from "@mui/icons-material/Store";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
// import RepeatIcon from "@mui/icons-material/Repeat";
// import EventBusyIcon from "@mui/icons-material/EventBusy";
import ConfirmCard from "./ConfirmCard";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../contexts/BusinessContext";
import ShareQR from "./ShareQR";
import IosShareIcon from '@mui/icons-material/IosShare';
import { getUserIdByAccessToken, getUserPhoneLine } from "../../api/user";

interface IOptionsTypes {
    icon: any;
    label: string;
    url?: string | undefined;
    function?: Function | undefined;
}

const BusinessProfileMoreOptions = () => {
    const navigate = useNavigate();
    const { businessId } = useParams();
    const { t } = useTranslation();
    const [openShareQR, setOpenShareQR] = useState<boolean>(false);

    const { setDialogState, setShowDialog } = useContext(GlobalContext);

    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

    const [userPhoneLine, setUserPhoneLine] = useState<{ phoneNumber: string; line_userId: string; }>();

    useEffect(() => {
        const fetch = async () => {
            const token = localStorage.getItem("token");
            const accessToken = localStorage.getItem("accessToken");
            const userId = await getUserIdByAccessToken(accessToken ?? "", token ?? "");
            const userPhoneLine = await getUserPhoneLine(userId);
            setUserPhoneLine(userPhoneLine);

        };
        fetch();
    }, []);

    const handleLogout = async () => {
        // reset dialog state
        setShowDialog(false);
        setDialogState("phone-input");
        // reset dialog state
        localStorage.clear();
        navigate("/");
    };

    const moreOptions = {
        share: [
            {
                icon: <IosShareIcon />,
                label: t("button:shareBookingWeb"),
                url: undefined,
                // function: () => shareBookingLink(businessId),
                function: () => setOpenShareQR(true),
            },
        ],
        setting: [
            {
                icon: <EditCalendarOutlinedIcon />,
                label: t("button:manualBooking"),
                url: undefined,
                function: () => setDialogState("manual-booking"),
            },
            // {
            //     icon: <EventBusyIcon />,
            //     label: t("button:setDayoff"),
            //     url: `/dayoff-setting/${businessId}`,
            // },
            {
                icon: <StoreIcon />,
                label: t("button:businessSetting"),
                url: `/business-setting?businessId=${businessId}&action=edit`,
            },
            {
                icon: <SettingsIcon />,
                label: t("button:serviceSetting"),
                url: `/service-setting/${businessId}`,
            },
            {
                icon: <LinkIcon />,
                label: userPhoneLine && userPhoneLine?.phoneNumber == "" ? t("button:connectToPhone") : t("button:socialmediaaccounts"),
                url: `/social-media-accounts/${businessId}?connectTo=${userPhoneLine && userPhoneLine?.phoneNumber == "" ? "phone" : "line"}`,
            },
        ],
        account: [
            // {
            //     icon: <RepeatIcon />,
            //     label: t("button:switchBusiness"),
            //     url: undefined,
            // },
            {
                icon: <LogoutIcon />,
                label: t("button:logout"),
                function: () => setShowConfirmation(true),
            },
        ],
    };

    return (
        <div className="flex flex-col gap-5">
            <ConfirmCard
                open={showConfirmation}
                title={t("noti:business:logout:confirmation")}
                description={t("noti:business:logout:confirmationDesc")}
                bntConfirm={t("button:confirm")}
                bntBack={t("button:cancel")}
                handleClose={() => setShowConfirmation(false)}
                handleConfirm={handleLogout}
            />
            <ShareQR
                open={openShareQR}
                url={`${window.location.origin}/details/${businessId}`}
                businessId={businessId ?? ""}
                handleClose={() => setOpenShareQR(false)} />
            {Object.values(moreOptions).map((options, index: number) => (
                <div key={index} className="rounded-lg bg-white">
                    {options.map((item: IOptionsTypes, index: number) => (
                        <button
                            key={index}
                            type="button"
                            className="text-start p-3 w-full"
                            onClick={() => {
                                if (item.url) {
                                    navigate(item.url);
                                } else if (item.function) {
                                    item.function();
                                } else {
                                    toast("Coming Soon", {
                                        icon: <PriorityHighIcon />,
                                    });
                                }
                            }}
                        >
                            {item.icon}
                            <span className="mx-2">{item.label}</span>
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default BusinessProfileMoreOptions;
