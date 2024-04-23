import { Divider } from "@mui/material";
// import AutocompleteMap from "./AutocompleteMap";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { useNavigate, useParams } from "react-router-dom";
import BusinessInfo from "./BusinessInfo";
import SearchMap from "./SearchMap";
// import { useState } from "react";

export default function CreateBusiness() {
    const { page } = useParams();
    const navigate = useNavigate();

    return (
        <div>
            <div className="pr-4 pl-4 pt-6">
                <div className="flex items-center justify-between">
                    <div onClick={() => navigate(-1)}>
                        <ArrowBackIosNewOutlinedIcon
                            sx={{ width: "20px", height: "20px" }}
                        />
                    </div>

                    <div className="font-bold" style={{ fontSize: "14px" }}>
                        Create business
                    </div>

                    <div></div>
                </div>
            </div>
            <Divider sx={{ marginTop: "16px", width: "100%" }} />
            <div className="flex flex-col pr-4 pl-4">
                {page == "1" ? <SearchMap /> : <BusinessInfo />}
            </div>
        </div>
    );
}
