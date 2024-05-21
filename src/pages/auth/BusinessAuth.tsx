import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DialogWrapper from "../../components/dialog/DialogWrapper";
// api
import { getBusinessByUserId } from "../../api/business";
import { useNavigate } from "react-router";
import { GlobalContext } from "../../contexts/BusinessContext";

const BusinessAuth = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const { setShowDialog } = useContext(GlobalContext);

    useEffect(() => {
        document.title = t("title:bussRootTitle");
        if (token && userId) {
            getBusinessByUserId(userId, token).then((res) =>
                navigate(`/business-profile/${res[0].id}`)
            );
        }
    }, []);

    return (
        <div className="flex flex-col justify-center items-center h-dvh">
            <div className="w-4/6 flex flex-col gap-4 justify-center items-center">
                <p className="text-[25px] font-semibold">
                    {t("title:bussRootTitle")}
                </p>
                <p className="text-center">{t("desc:bussRootDesc")}</p>
                <button
                    type="button"
                    className="w-2/3 py-3 px-10 bg-[#020873] text-white rounded-lg"
                    onClick={() => setShowDialog(true)}
                >
                    {t("button:getStartedButton")}
                </button>
            </div>

            <DialogWrapper userSide="business" />
        </div>
    );
};

export default BusinessAuth;
