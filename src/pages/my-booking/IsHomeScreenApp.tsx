// icons
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useTranslation } from "react-i18next";

interface IsConnectLineProps {
    handleLearnMore: () => void;
    handleClose: () => void;
}

const IsHomeScreenApp = ({
    handleLearnMore,
    handleClose,
}: IsConnectLineProps) => {
    const { t } = useTranslation();
    return (
        <div className="bg-white text-[14px] p-5">
            <div className="flex justify-between items-center gap-2">
                <div className="w-[40px] h-[40px] flex justify-center items-center self-start bg-[#020873] bg-opacity-10 border rounded-full p-1">
                    <AddBoxIcon style={{ color: "#0F146A" }} />
                </div>
                <div className="w-3/4">
                    <p className="font-bold">{t("title:isSaveToHomeScreen")}</p>
                    <p>{t("desc:isSaveToHomeScreen")}</p>
                    <p
                        className="font-semibold text-deep-blue cursor-pointer mt-2"
                        onClick={handleLearnMore}
                    >
                        {t("button:learnMore")}
                    </p>
                </div>
                <p className="self-start cursor-pointer">
                    <CloseRoundedIcon
                        style={{ fontSize: "18px" }}
                        color="disabled"
                        onClick={handleClose}
                    />
                </p>
            </div>
        </div>
    );
};

export default IsHomeScreenApp;
