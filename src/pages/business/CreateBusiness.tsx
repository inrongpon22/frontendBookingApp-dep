import { Divider } from "@mui/material";
// import AutocompleteMap from "./AutocompleteMap";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { useNavigate, useParams } from "react-router-dom";
import BusinessInfo from "./BusinessInfo";
import SearchMap from "./SearchMap";
import { ChangeEvent, useState } from "react";
import { IBusinessInfo, ILocation, IaddBusiness } from "./interfaces/business";

export default function CreateBusiness() {
    const { page } = useParams();
    const navigate = useNavigate();
    const [addBusiness, setAddBusiness] = useState<IaddBusiness>();
    const [locationData, setLocationData] = useState<ILocation>({
        lat: 0,
        lng: 0,
        address: ""
    });
    const [businessInfo, setBusinessInfo] = useState<IBusinessInfo>({
        title: '',
        description: '',
        phoneNumber: ''
    });

    const handleBusinessChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setBusinessInfo(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleChangeLocation = (inputData: ILocation) => {
        setLocationData(inputData);
    };
    const businessData = (inputData: IaddBusiness) => {
        setAddBusiness(inputData);
    };

    return (
        <div>
            <div className="pr-4 pl-4 pt-6">
                <div className="flex items-center justify-between">
                    <div onClick={() => navigate(-1)}>
                        <ArrowBackIosNewOutlinedIcon
                            sx={{ width: "20px", height: "20px", cursor: "pointer" }}
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
                {page == "1" ? <SearchMap handleChangeLocation={handleChangeLocation} /> :
                    <BusinessInfo locationData={locationData} businessInfo={businessInfo} handleBusinessChange={handleBusinessChange} businessData={businessData} />}
            </div>
        </div>
    );
}
