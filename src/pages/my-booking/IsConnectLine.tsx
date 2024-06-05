// icons
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useTranslation } from "react-i18next";

interface IsConnectLineProps {
    handleConnectLine: () => void;
    handleClose: () => void;
}

const IsConnectLine = ({
    handleConnectLine,
    handleClose,
}: IsConnectLineProps) => {
    const { t } = useTranslation();

    return (
        <div className="bg-deep-blue bg-opacity-10 text-[14px] p-5">
            <div className="flex justify-between items-center gap-2 mb-3">
                <div className="w-[40px] h-[40px] flex justify-center items-center self-start bg-[#020873] bg-opacity-10 border rounded-full p-1 rotate-45">
                    <LinkOutlinedIcon style={{ color: "#0F146A" }} />
                </div>
                <div className="w-3/4">
                    <p className="font-bold">{t("title:isConnectLine")}</p>
                    <p>{t("desc:isConnectLine")}</p>
                </div>
                <p className="self-start cursor-pointer">
                    <CloseRoundedIcon
                        style={{ fontSize: "18px" }}
                        color="disabled"
                        onClick={handleClose}
                    />
                </p>
            </div>
            <button
                className="w-full bg-deep-blue bg-opacity-80 text-white font-semibold rounded-lg py-2"
                onClick={handleConnectLine}
            >
                {t("button:isConnectLine")}
            </button>
        </div>
    );
};

export default IsConnectLine;
