import { Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import BusinessInfo from "./BusinessInfo";
import Header from "./components/Header";
import { useNavigate } from "react-router-dom";

export default function BusinessSetting() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const action = queryParams.get("action");
    return (
        <div>
            <div className="px-4 pt-6">
                <Header
                    context={action ? t("title:businessSetting") : t("title:createBusiness")}
                    isClose={false}
                    handleClose={() => navigate(-1)}
                />
            </div>
            <Divider sx={{ marginTop: "16px", width: "100%" }} />
            <div className="flex flex-col p-4">
                <BusinessInfo />
            </div>
        </div>
    );
}
