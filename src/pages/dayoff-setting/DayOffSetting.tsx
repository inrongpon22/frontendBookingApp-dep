import { useTranslation } from "react-i18next";
// styled
import { Divider } from "@mui/material";
// icons
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
// components
import Header from "../service/components/Header";
import { useNavigate, useParams } from "react-router";

const DayOffSetting = () => {
  const navigate = useNavigate();
  const { businessId } = useParams();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-dvh">
      {/* headers */}
      <div className="pr-4 pl-4 pt-6">
        <Header context={t("title:dayOff")} />
      </div>
      <Divider sx={{ marginTop: "16px", width: "100%" }} />
      <div className="flex pr-4 pl-4 pt-3 pb-3 mb-4 justify-center">
        <button
          className="w-full flex items-center justify-center py-3 text-deep-blue bg-deep-blue bg-opacity-10 rounded-lg"
          onClick={() => navigate(`/dayoff-setting/${businessId}/add-new`)}
        >
          <AddCircleOutlineIcon sx={{ fontSize: "18px", color: "#020873" }} />
          <span>{t("button:addNewDayOff")}</span>
        </button>
      </div>
      {/* headers */}

      {/* content */}
      <div className="h-full bg-[#F7F7F7]">
        <p className="pr-4 pl-4 pt-3 pb-3">{t("title:dayOff")}</p>
        <div className="flex flex-col gap-2 p-5 bg-white text-[14px]">
          <p className="font-semibold">1 hour play | 2 hour play</p>
          <p className="flex items-center">
            <CalendarTodayIcon fontSize="small" />
            <span>Apr 30, 2024</span>
          </p>
          <p className="flex items-center">
            <AccessTimeIcon fontSize="small" />
            <span>8:00 AM - 18:00 AM</span>
          </p>
        </div>
      </div>
      {/* content */}
    </div>
  );
};

export default DayOffSetting;
