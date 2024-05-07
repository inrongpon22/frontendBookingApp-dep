import { Divider } from "@mui/material";
// import AutocompleteMap from "./AutocompleteMap";
import BusinessInfo from "./BusinessInfo";
import Header from "./components/Header";
import { useTranslation } from "react-i18next";

export default function CreateBusiness() {
  const { t } = useTranslation();
  return (
    <div>
      <div className="px-4 pt-6">
        <Header context={t("title:createBusiness")} />
      </div>
      <Divider sx={{ marginTop: "16px", width: "100%" }} />
      <div className="flex flex-col p-4">
        <BusinessInfo />
      </div>
    </div>
  );
}
