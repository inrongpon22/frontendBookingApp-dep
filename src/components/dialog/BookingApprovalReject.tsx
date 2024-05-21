import { useContext, useState } from "react";
import { ApproveContext } from "../../pages/booking-approval/BookingApproval";
import { useTranslation } from "react-i18next";
import ConfirmCard from "./ConfirmCard";

const BookingApprovalReject = () => {
    const { bookingDatas, rejectRequested } = useContext(ApproveContext);

    const [rejectNote, setRejectNote] = useState<string>("");

    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);


    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-4 h-full">
            <ConfirmCard
                open={showConfirmation}
                title={t("noti:booking:approve:confirmation")}
                description={t("noti:booking:approve:confirmationDesc")}
                bntConfirm={t("button:confirm")}
                bntBack={t("button:cancel")}
                handleClose={() => setShowConfirmation(false)}
                handleConfirm={() =>
                  rejectRequested(
                    bookingDatas?.id,
                    bookingDatas?.serviceId,
                    rejectNote
                )
                }
            />
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
                    rejectRequested(
                        bookingDatas?.id,
                        bookingDatas?.serviceId,
                        rejectNote
                    )
                }
            >
                {t("button:reject")}
            </button>
        </div>
    );
};

export default BookingApprovalReject;
