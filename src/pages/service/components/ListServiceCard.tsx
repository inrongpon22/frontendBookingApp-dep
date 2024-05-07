import { deleteService } from "../../../api/service";
import { dataOfWeekThai, dataOfWeekEng } from "../../../helper/daysOfWeek";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { truncateContext } from "../../../helper/limitedText";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import { useNavigate, useParams } from "react-router-dom";

interface IProps {
    serviceId: number;
    serviceName: string;
    price: number;
    description: string;
    currency: string;
    openTime: string;
    closeTime: string;
    daysOpen: string[];
    isDeleteBoxVisible: boolean;
    handleRefresh: () => void;
}

export default function ListServiceCard(props: IProps) {
    const lan = localStorage.getItem("lan");
    const token = localStorage.getItem("token") ?? "";
    const navigate = useNavigate();
    const { businessId } = useParams();

    const handleDeleteService = async () => {
        try {
            await deleteService(props.serviceId, token);
            props.handleRefresh();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col pr-4 pl-4 bg-white pt-2 pb-2 relative">
            <div
                style={{ width: "65px", height: "100%", background: "#FA6056" }}
                className={`absolute top-0 right-0 
            transition-opacity duration-500 ease-in-out ${
                props.isDeleteBoxVisible ? "opacity-100" : "opacity-0"
            } shadow-md flex justify-center items-center`}>
                <div
                    className="text-gray-600 hover:text-gray-800 cursor-pointer"
                    onClick={handleDeleteService}>
                    <DeleteOutlinedIcon
                        sx={{ color: "white", fontSize: "18.5px" }}
                    />
                </div>
            </div>
            <div
                style={{
                    width: "65px",
                    height: "100%",
                    background: "#898A8D",
                    right: "65px",
                }}
                className={`absolute top-0 
            transition-opacity duration-500 ease-in-out ${
                props.isDeleteBoxVisible ? "opacity-100" : "opacity-0"
            } shadow-md flex justify-center items-center`}>
                <div
                    className="text-gray-600 hover:text-gray-800 cursor-pointer"
                    onClick={() =>
                        navigate(
                            `/serviceDetail/${businessId}/${props.serviceId}`
                        )
                    }>
                    <ModeEditOutlinedIcon
                        sx={{ color: "white", fontSize: "18.5px" }}
                    />
                </div>
            </div>

            <div className="flex justify-between">
                <div style={{ fontSize: "14px" }} className="font-semibold">
                    {props.serviceName}
                </div>
                <div
                    style={{
                        fontSize: "14px",
                        marginRight: props.isDeleteBoxVisible ? "90px" : "",
                    }}
                    className="font-semibold transition-opacity duration-700 ease-in-out">
                    {props.currency} {props.price}
                </div>
            </div>
            <p style={{ fontSize: "12px", width: "80%" }}>
                {truncateContext(props.description, 90)}
            </p>
            <p style={{ fontSize: "12px" }}>
                {props.openTime} - {props.closeTime}
            </p>
            <p style={{ fontSize: "12px" }}>
                {props.daysOpen.map((item, index) => (
                    <span key={item}>
                        {lan === "th"
                            ? dataOfWeekThai.find((x) => x.value === item)
                                  ?.thaiName
                            : dataOfWeekEng.find((x) => x.value === item)?.name}
                        {index === props.daysOpen.length - 2
                            ? lan === "th"
                                ? " และ "
                                : " and "
                            : index === props.daysOpen.length - 1
                            ? " "
                            : ", "}
                    </span>
                ))}
            </p>
        </div>
    );
}
