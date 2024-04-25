import { Divider } from "@mui/material";
// import AutocompleteMap from "./AutocompleteMap";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { useNavigate, useParams } from "react-router-dom";
import BusinessInfo from "./BusinessInfo";
import ServiceInfo from "./ServiceInfo";
import ServiceList from "./ServiceList";
import ServiceTime from "./ServiceTime";
import CreateService from "./CreateService";

export default function CreateBusiness() {
    const { page } = useParams();
    const navigate = useNavigate();

    return (
        <div>
            <div className="pr-4 pl-4 pt-6">
                <div className="flex items-center justify-between">
                    <div onClick={() => navigate(-1)}>
                        <ArrowBackIosNewOutlinedIcon
                            sx={{
                                width: "20px",
                                height: "20px",
                                cursor: "pointer",
                            }}
                        />
                    </div>

                    <div className="font-bold" style={{ fontSize: "14px" }}>
                        {page == "1"
                            ? "Create business"
                            : page == "2"
                            ? "Service List"
                            : page == "3"
                            ? "Service Info"
                            : page == "4"
                            ? "Service Time"
                            : "Create Service"}
                    </div>

                    <div></div>
                </div>
            </div>
            <Divider sx={{ marginTop: "16px", width: "100%" }} />
            <div className="flex flex-col pr-4 pl-4">
                {page === "1" ? (
                    <BusinessInfo />
                ) : page === "2" ? (
                    <ServiceList />
                ) : page === "3" ? (
                    <ServiceInfo />
                ) : page == "4" ? (
                    <ServiceTime />
                ) : (
                    <CreateService />
                )}
            </div>
        </div>
    );
}
