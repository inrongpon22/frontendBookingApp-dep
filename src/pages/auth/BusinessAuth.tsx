import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DialogWrapper from "../../components/dialog/DialogWrapper";
// api
import { getBusinessByUserId } from "../../api/business";
import { useNavigate } from "react-router";
import { GlobalContext } from "../../contexts/BusinessContext";
import { getUserIdByAccessToken } from "../../api/user";

const BusinessAuth = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const token = localStorage.getItem("token") ?? "";
    const accessToken = localStorage.getItem("accessToken") ?? "";

    const { setShowDialog } = useContext(GlobalContext);

    useEffect(() => {
        document.title = t("title:bussRootTitle");
        if (token) {
            getUserIdByAccessToken(accessToken ?? "", token ?? "").then(
                (userId) => {
                    getBusinessByUserId(userId, token).then((res) =>
                        navigate(`/business-profile/${res[0].id}`)
                    );
                }
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="flex flex-col justify-between items-center h-full w-5/6">
                <div className="flex flex-col flex-grow justify-center">
                    <div className="flex justify-center mt-50px">
                        <img
                            src={"./smallLogo.svg"}
                            alt="logo"
                            className="w-[50vw]"
                        />
                    </div>
                </div>
                <div className=" flex flex-col items-center mb-[10vw]">
                    <div className="text-[3rem] font-bold text-center">
                        {t("title:conceptWord")}
                    </div>
                    <div className="text-center text-[2rem]">
                        {t("desc:desConceptWord")}
                    </div>
                </div>
            </div>
            <button
                type="button"
                style={{ marginBottom: "10%" }}
                className="py-4 px-12 bg-[#35398F] text-white text-[1rem] rounded-lg w-[90vw] sm:w-[80vw] md:w-[70vw] lg:w-[60vw] xl:w-[50vw] 2xl:w-[40vw]"
                onClick={() => setShowDialog(true)}
            >
                {t("button:getStartedButton")}
            </button>

            <DialogWrapper userSide="business" />
        </div>
    );
};

export default BusinessAuth;
