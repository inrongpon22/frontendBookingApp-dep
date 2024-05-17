import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DialogWrapper from "../../components/dialog/DialogWrapper";
// api
import { getBusinessByUserId } from "../../api/business";
import { useNavigate } from "react-router";
// import logo from "../../../public/images/logo.png";

const BusinessAuth = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const token = localStorage.getItem("token") ?? "";
    const userId = localStorage.getItem("userId") ?? "";

    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [dialogState, setDialogState] = useState<string | undefined>(
        "phone-input"
    );

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
        <div className="flex flex-col justify-center items-center h-dvh">
            <div className="h-screen w-5/6 flex flex-col justify-between items-center">
                <div className="flex flex-col">
                    <div className="flex justify-center my-12">
                        <img
                            src={"./smallLogo.svg"}
                            alt="logo"
                            style={{
                                width: "40vw",
                            }}
                        />
                    </div>
                    <div className="flex flex-col gap-4 items-center">
                        <div className="text-[32px] font-bold text-center ">
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
                    className="py-3 px-10 bg-[#020873] text-white rounded-lg"
                    onClick={() => setShowDialog(true)}>
                    {t("button:getStartedButton")}
                </button>
            </div>

            <DialogWrapper
                show={showDialog}
                setShow={setShowDialog}
                userSide="business"
                dialogState={dialogState}
                setDialogState={setDialogState}
            />
        </div>
    );
};

export default BusinessAuth;
