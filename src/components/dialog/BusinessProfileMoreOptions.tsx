import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
// helper
import { shareBookingLink } from "../../helper/alerts";
// icons
import LinkIcon from "@mui/icons-material/Link";
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import StoreIcon from "@mui/icons-material/Store";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import RepeatIcon from "@mui/icons-material/Repeat";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import ConfirmCard from "./ConfirmCard";
import { useState } from "react";
import Loading from "./Loading";

const BusinessProfileMoreOptions = () => {
  const navigate = useNavigate();
  const { businessId } = useParams();
  const { t } = useTranslation();

  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogout = async () => {
   setIsLoading(true);
   localStorage.removeItem("token");
   localStorage.removeItem("userId");
   navigate("/");
  };

  const moreOptions = {
    share: [
      {
        icon: <LinkIcon />,
        label: t("button:shareBookingLink"),
        url: undefined,
        function: () => shareBookingLink(businessId),
      },
    ],
    setting: [
      {
        icon: <EditCalendarOutlinedIcon />,
        label: t("button:manualBooking"),
        url: undefined,
      },
      {
        icon: <EventBusyIcon />,
        label: t("button:setDayoff"),
        url: `/dayoff-setting/${businessId}`,
      },
      {
        icon: <StoreIcon />,
        label: t("button:businessSetting"),
        url: `/business-setting/${businessId}`,
      },
      {
        icon: <SettingsIcon />,
        label: t("button:serviceSetting"),
        url: `/service-setting/${businessId}`,
      },
    ],
    account: [
      {
        icon: <RepeatIcon />,
        label: t("button:switchBusiness"),
        url: undefined,
      },
      {
        icon: <LogoutIcon />,
        label: t("button:logout"),
        function: () => setShowConfirmation(true),
      },
    ],
  };

  return (
    <div className="flex flex-col gap-5">
      <Loading openLoading={isLoading} />
      <ConfirmCard
        open={showConfirmation}
        title={t("noti:business:logout:confirmation")}
        description={t("noti:business:logout:confirmationDesc")}
        bntConfirm={t("button:confirm")}
        bntBack={t("button:cancel")}
        handleClose={() => setShowConfirmation(false)}
        handleConfirm={handleLogout}
      />
      {Object.values(moreOptions).map((options: any, index: number) => (
        <div key={index} className="rounded-lg bg-white">
          {options.map((item: any, index: number) => (
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
