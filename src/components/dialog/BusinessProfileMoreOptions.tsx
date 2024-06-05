import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
// helper
// import { shareBookingLink } from "../../helper/alerts";
// icons
import LinkIcon from "@mui/icons-material/Link";
import EditCalendarOutlinedIcon from "@mui/icons-material/EditCalendarOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
// import RepeatIcon from "@mui/icons-material/Repeat";
// import EventBusyIcon from "@mui/icons-material/EventBusy";
import ConfirmCard from "./ConfirmCard";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../contexts/BusinessContext";
import ShareQR from "./ShareQR";
import IosShareIcon from "@mui/icons-material/IosShare";
import { getUserIdByAccessToken, getUserPhoneLine } from "../../api/user";

interface IOptionsTypes {
    icon: any;
    label: string;
    url?: string | undefined;
    function?: Function | undefined;
    style?: string | undefined;
}

const BusinessProfileMoreOptions = () => {
    const navigate = useNavigate();
    const { businessId } = useParams();
    const { t } = useTranslation();
    const [openShareQR, setOpenShareQR] = useState<boolean>(false);

    const { setDialogState, setShowDialog } = useContext(GlobalContext);

    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

    const [userPhoneLine, setUserPhoneLine] = useState<{
        phoneNumber: string;
        line_userId: string;
    }>();

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
                style: `flex flex-row-reverse justify-center items-center bg-deep-blue bg-opacity-10 text-deep-blue  text-opacity-80 font-semibold`,
            },
        ],
        setting: [
            {
                icon: <EditCalendarOutlinedIcon />,
                label: t("button:manualBooking"),
                url: undefined,
                function: () => setDialogState("manual-booking"),
                style: `${businessId ? "" : "hidden"}`
            },
            {
                icon: <StoreOutlinedIcon />,
                label: t("button:businessSetting"),
                url: `/business-setting?businessId=${businessId}&action=edit`,
                style: `${businessId ? "" : "hidden"}`
            },
            {
                icon: <TuneOutlinedIcon />,
                label: t("button:serviceSetting"),
                url: `/service-setting/${businessId}`,
                style: `${businessId ? "" : "hidden"}`
            },
            {
                icon: <AddBoxOutlinedIcon />,
                label: t("button:serviceSetting"),
                url: `/add-to-home-screen`,
                style: `${businessId ? "hidden" : ""}`
            },
            {
                icon: <LinkIcon />,
                label: t("button:linkaccounts"),
                url: `/social-media-accounts/${businessId}?connectTo=${
                    userPhoneLine &&
                    (userPhoneLine?.phoneNumber == "" ||
                        userPhoneLine?.phoneNumber == null)
                        ? "phone"
                        : userPhoneLine &&
                          (userPhoneLine?.line_userId == "" ||
                              userPhoneLine?.line_userId == null)
                        ? "line"
                        : "both"
                }`,
            },
        ],
        account: [
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
                handleClose={() => setOpenShareQR(false)}
            />
            {Object.values(moreOptions).map((options, index: number) => (
                <div
                    key={index}
                    className={`overflow-hidden rounded-lg bg-white border ${!businessId && index === 0 ? "hidden" : ""}`}
                >
                    {options.map((item: IOptionsTypes, index: number) => (
                        <button
                            key={index}
                            type="button"
                            className={`text-start p-3 w-full text-[14px] ${item.style}`}
                            onClick={() => {
                                if (item.url) {
                                    navigate(item.url);
                                    if (
                                        item.url.includes(
                                            "social-media-accounts"
                                        )
                                    ) {
                                        setShowDialog(false);
                                    }
                                } else if (item.function) {
                                    item.function();
                                } else {
                                    toast("Coming Soon", {
                                        icon: <PriorityHighIcon />,
                                    });
                                }
                            }}>
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
