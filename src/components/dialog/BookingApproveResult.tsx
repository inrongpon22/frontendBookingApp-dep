import { useTranslation } from "react-i18next";
// icons
import EventBusyIcon from "@mui/icons-material/EventBusy";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { useNavigate, useParams } from "react-router-dom";
// import { useQuery } from "../../helper/url";

const BookingApproveResult = ({ dialogState }: any) => {
  const navigate = useNavigate();
  const { businessId } = useParams();
  const { t } = useTranslation();
//   const query = useQuery();

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col items-center gap-3 my-auto text-center">
        {dialogState.includes("success") ? (
          <EventAvailableIcon
            style={{ fontSize: "80px" }}
            className="text-deep-blue text-opacity-80"
          />
        ) : (
          <EventBusyIcon
            style={{ fontSize: "80px" }}
            className="text-deep-blue text-opacity-80"
          />
        )}

        <span className="text-[17px] font-semibold">
          {dialogState.includes("success")
            ? t("title:busineessApprovedSuccessful")
            : t("title:busineessRejectedSuccessful")}
        </span>
        <span className="text-[14px] text-opacity-80">
          {dialogState.includes("success")
            ? t("desc:busineessApprovedSuccessful")
            : t("desc:busineessRejectedSuccessful")}
        </span>
      </div>

      <div className="flex flex-col mt-auto">
        <button
          type="button"
          className="w-full border p-3 rounded-lg"
          onClick={() => navigate(`/business-profile/${businessId}`)}
        >
          {t("button:backToMain")}
        </button>
      </div>
    </div>
  );
};

export default BookingApproveResult;
