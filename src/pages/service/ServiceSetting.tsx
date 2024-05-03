import { useTranslation } from "react-i18next";
import Header from "./components/Header";
import { alpha } from "@mui/material";
import ListServiceCard from "../business/components/ListServiceCard";

export default function ServiceSetting() {
    const { t } = useTranslation();
    return (
        <div>
            <div className="pr-4 pl-4 pt-6">
                <Header context={t("title:serviceInformation")} />
            </div>
            <div className="flex flex-col pr-4 pl-4 mb-4">
                <button
                    style={{
                        width: "343px",
                        height: "43px",
                        background: `${alpha("#020873", 0.1)}`,
                    }}
                    className="bg-primary rounded-lg p-2 mt-4">
                    Create new service
                </button>
            </div>
            <div style={{ background: "#F7F7F7", height: "100vh" }}>
                <p className="pr-4 pl-4 pt-3 pb-3">Services </p>
                <ListServiceCard
                    serviceName={"Service 1"}
                    price={22}
                    description={"Description"}
                    currency={"THB"}
                    openTime={"new Date()"}
                    closeTime={"new Date()"}
                    daysOpen={[
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                    ]}
                />
            </div>
        </div>
    );
}
