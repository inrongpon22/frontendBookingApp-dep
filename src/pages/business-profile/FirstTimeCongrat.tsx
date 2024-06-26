import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useParams } from "react-router-dom";
import { shareBookingLink } from "../../helper/alerts";
import ShareQR from "../../components/dialog/ShareQR";
import { t } from "i18next";
import { useState } from "react";

interface FirstTimeCongratProps {
    handleClose: Function;
}

const FirstTimeCongrat = ({ handleClose }: FirstTimeCongratProps) => {
    const { businessId } = useParams();
    const [openShareQR, setOpenShareQR] = useState<boolean>(false);
    return (
        <>
            <ShareQR
                open={openShareQR}
                url={`${window.location.origin}/details/${businessId}`}
                businessId={businessId ?? ""}
                handleClose={() => setOpenShareQR(false)}
            />
            <div className="bg-[#2E7CF6] bg-opacity-10 p-5 mb-2">
                <p className="flex justify-between items-center">
                    <span className="text-[17px] font-bold">
                        {t("title:firstCongrat")} 🎉
                    </span>
                    <CloseRoundedIcon
                        fontSize="small"
                        color="disabled"
                        onClick={() => handleClose()}
                    />
                </p>
                <p className="py-2">{t("desc:firstCongrat")}</p>
                <button
                    type="button"
                    className="w-full bg-deep-blue bg-opacity-80 p-3 mt-3 text-[14px] font-semibold text-white rounded-lg"
                    onClick={() => shareBookingLink(businessId)}
                >
                    {t("button:shareBookingWeb")}
                </button>
            </div>
        </>
    );
};

export default FirstTimeCongrat;
