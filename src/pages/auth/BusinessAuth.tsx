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

    const token = localStorage.getItem("token") ?? "";
    const userId = localStorage.getItem("userId") ?? "";

    const { setShowDialog } = useContext(GlobalContext);

    useEffect(() => {
        document.title = t("title:bussRootTitle");
        if (token) {
            getBusinessByUserId(userId, token).then((res) =>
                navigate(`/business-profile/${res[0].id}`)
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="flex flex-col justify-between items-center h-full w-5/6">
                <div className="flex flex-col flex-grow justify-center">
                    <div className="flex justify-center my-12">
                        <img
                            src={"./smallLogo.svg"}
                            alt="logo"
                            className="w-[50vw]"
                        />
                    </div>
                </div>
                <div className="flex flex-col items-center mb-[10vw]">
                    <div className="text-[32px] font-bold text-center">
                        {t("title:conceptWord")}
                    </div>
                    <div className="text-center">
                        {t("desc:desConceptWord")}
                    </div>
                </div>
            </div>
            <button
                type="button"
                style={{ marginBottom: "56px" }}
                className="py-3 px-10 bg-deep-blue bg-opacity-80 text-white rounded-lg w-[90vw] sm:w-[80vw] md:w-[70vw] lg:w-[60vw] xl:w-[50vw] 2xl:w-[40vw]"
                onClick={() => setShowDialog(true)}
            >
                {t("button:getStartedButton")}
            </button>

            <DialogWrapper userSide="business" />
        </div>
    );
};

export default BusinessAuth;
