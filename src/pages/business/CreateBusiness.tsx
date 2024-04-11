import { useParams } from "react-router-dom";
import PageOne from "./PageOne";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import PageTwo from "./PageTwo";
import PageThree from "./PageThree";

export default function CreateBusiness() {
    const { page } = useParams();
    return (
        <>
            <div className="w-full pr-4 pl-4 pt-4">
                <div className="flex flex-col">
                    <div className="flex justify-between w-full mb-6">
                        <ArrowBackIosNewOutlinedIcon
                            sx={{ width: "20px", height: "20px" }}
                        />
                        <div className="text">{page} of 3</div>
                    </div>
                    {page === "1" ? (
                        <PageOne />
                    ) : page === "2" ? (
                        <PageTwo />
                    ) : (
                        <PageThree />
                    )}
                </div>
            </div>
        </>
    );
}
