import { Divider } from "@mui/material";
// import AutocompleteMap from "./AutocompleteMap";
import BusinessInfo from "./BusinessInfo";
import Header from "./components/Header";

export default function CreateBusiness() {
    return (
        <div>
            <div className="pr-4 pl-4 pt-6">
                <Header context={"Create Business"} />
            </div>
            <Divider sx={{ marginTop: "16px", width: "100%" }} />
            <div className="flex flex-col pr-4 pl-4">
                <BusinessInfo />
            </div>
        </div>
    );
}
