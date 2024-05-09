import { useContext, useState } from "react";
import { ApproveContext } from "../../pages/booking-approval/BookingApproval";
import { useTranslation } from "react-i18next";

const BookingApprovalReject = () => {
  const { bookingDatas, rejectRequested } = useContext(ApproveContext);

  const [rejectNote, setRejectNote] = useState<string>("");

  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 h-full">
      <p>{t("desc:bookingRejectDesc")}</p>
      <textarea
        name=""
        id=""
        rows={4}
        placeholder={`${t("placeholder:bookingReject")}...`}
        className="w-full border rounded-lg p-3"
        onChange={(e) => setRejectNote(e.target.value)}
      ></textarea>
      <button
        type="button"
        className="bg-deep-blue text-white rounded-lg py-3 mt-auto"
        onClick={() =>
          rejectRequested(bookingDatas?.id, bookingDatas?.serviceId, rejectNote)
        }
      >
        {t("button:reject")}
      </button>
    </div>
  );
};

export default BookingApprovalReject;
