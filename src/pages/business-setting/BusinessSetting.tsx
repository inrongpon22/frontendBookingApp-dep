import { Divider } from "@mui/material";
// import AutocompleteMap from "./AutocompleteMap";
import BusinessInfo from "./BusinessInfo";

import { useTranslation } from "react-i18next";
import Header from "../business/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBusinessId } from "../../api/business";
import { IgetBusiness } from "../business/interfaces/business";

export default function BusinessSetting() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { businessId } = useParams();
    const [business, setBusiness] = useState<IgetBusiness>();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
        } else {
            const fetchBusiness = async () => {
                const businessData = await getBusinessId(
                    Number(businessId),
                    token
                );
                setBusiness(businessData);
            };
            fetchBusiness();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <div className="px-4 pt-6">
                <Header context={t("title:businessSetting")} />
            </div>
            <Divider sx={{ marginTop: "16px", width: "100%" }} />
            <div className="flex flex-col p-4">
                {business && <BusinessInfo businessData={business} />}
            </div>
        </div>
    );
}
