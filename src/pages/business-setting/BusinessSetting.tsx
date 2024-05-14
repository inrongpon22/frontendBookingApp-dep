import { Divider } from "@mui/material";
import BusinessInfo from "./BusinessInfo";

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { IgetBusiness } from "../business/interfaces/business";
import Header from "./Header";
import useSWR from "swr";
import { app_api, fetcher } from "../../helper/url";
import Loading from "../../components/dialog/Loading";

export default function BusinessSetting() {
    const { t } = useTranslation();
    const { businessId } = useParams();
    const [isEdit, setIsEdit] = useState(false);

    // useEffect(() => {
    //     const token = localStorage.getItem("token");
    //     if (!token) {
    //         navigate("/");
    //     } else {
    //         const fetchBusiness = async () => {
    //             const businessData = await getBusinessId(
    //                 Number(businessId),
    //                 token
    //             );
    //             setBusiness(businessData);
    //         };
    //         fetchBusiness();
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);
    const {
        data: business,
        isLoading: businessLoading,
        // error: serviceError,
        // mutate: businessMutate,
    } = useSWR<IgetBusiness>(
        businessId && `${app_api}/business/${businessId}`,
        fetcher
    );

    const handleEdit = () => {
        setIsEdit(!isEdit);
    };

    return (
        <div>
            <Loading openLoading={businessLoading} />
            <div className="px-4 pt-6">
                <Header
                    context={t("title:businessSetting")}
                    handleIsEdit={handleEdit}
                    isEdit={isEdit}
                />
            </div>
            <Divider sx={{ marginTop: "16px", width: "100%" }} />
            <div className="flex flex-col p-4">
                {business && (
                    <BusinessInfo
                        businessData={business}
                        isEdit={isEdit}
                        handleIsEdit={handleEdit}
                    />
                )}
            </div>
        </div>
    );
}
