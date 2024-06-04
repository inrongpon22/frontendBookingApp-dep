import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import useSWR from "swr";
import { app_api, fetcher } from "../../helper/url";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface FirstTimeAddMoreServiceProps {
    handleClose: Function;
}

const FirstTimeAddMoreService = ({
    handleClose,
}: FirstTimeAddMoreServiceProps) => {
    const { businessId } = useParams();
    const navigate = useNavigate();

    const { t } = useTranslation();

    const { data } = useSWR(
        businessId && `${app_api}/serviceByBusinessId/${businessId}`,
        fetcher
    );

    return (
        <div className="bg-white mb-2 p-5">
            <p className="flex justify-between items-center">
                <span className="text-[17px] font-bold">
                    {t("title:addMoreService")}
                </span>
                <CloseRoundedIcon
                    fontSize="small"
                    color="disabled"
                    onClick={(e) => handleClose(e)}
                />
            </p>
            <p className="py-2">{t("desc:addMoreService")}</p>
            {data?.length > 0 && (
                <div className="border-2 rounded-lg p-5">
                    <p className="flex justify-between">
                        <span className="font-bold text-[14px]">
                            {data ? data[0]?.title : ""}
                        </span>
                        <span className="text-end">
                            <span className="font-bold text-[14px]">
                                {data ? data[0]?.price : ""}฿
                            </span>
                            <span className="font-normal">
                                {" "}
                                / {t("person")}
                            </span>
                        </span>
                    </p>
                    <div className="">
                        <p className="font-normal text-[14px]">
                            {data ? data[0]?.description : ""}{" "}
                        </p>
                    </div>
                </div>
            )}
            <button
                type="button"
                className="w-full bg-deep-blue bg-opacity-10 p-3 mt-3 text-[14px] font-semibold text-deep-blue rounded-lg"
                onClick={() => navigate(`/service-setting/${businessId}`)}
            >
                {t("button:createNewService")}
            </button>
        </div>
    );
};

export default FirstTimeAddMoreService;
