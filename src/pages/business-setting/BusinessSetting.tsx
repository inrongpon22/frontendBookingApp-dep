import { Divider } from "@mui/material";
import BusinessInfo from "./BusinessInfo";

import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBusinessId } from "../../api/business";
import { IgetBusiness } from "../business/interfaces/business";
import Header from "./Header";

export default function BusinessSetting() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { businessId } = useParams();
    const [business, setBusiness] = useState<IgetBusiness>();
    const [isEdit, setIsEdit] = useState(false);
    const [IsClickEdit, setIsClickEdit] = useState(false);

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

    const handleEdit = () => {
        setIsEdit(true);
        setIsClickEdit(true);
    };

    return (
        <div>
            <div className="px-4 pt-6">
                <Header
                    context={t("title:businessSetting")}
                    handleIsEdit={handleEdit}
                    isEdit={isEdit}
                    IsClickEdit={IsClickEdit}
                />
            </div>
            <Divider sx={{ marginTop: "16px", width: "100%" }} />
            <div className="flex flex-col p-4">
                {business && <BusinessInfo businessData={business} isEdit={isEdit} handleIsEdit={handleEdit} />}
            </div>
        </div>
    );
}
