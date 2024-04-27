import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DialogWrapper from "../../components/dialog/DialogWrapper";

const BusinessAuth = () => {
  const { t } = useTranslation();

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [dialogState, setDialogState] = useState<string | undefined>(
    "phone-input"
  );

  useEffect(() => {
    document.title = t("title:bussRootTitle");
    localStorage.clear();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-dvh">
      <div className="w-4/6 flex flex-col gap-4 justify-center items-center">
        <p className="text-[25px] font-semibold">{t("title:bussRootTitle")}</p>
        <p className="text-center">{t("desc:bussRootDesc")}</p>
        <button
          type="button"
          className="w-2/3 py-3 px-10 bg-[#020873] text-white rounded-lg"
          onClick={() => setShowDialog(true)}
        >
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
