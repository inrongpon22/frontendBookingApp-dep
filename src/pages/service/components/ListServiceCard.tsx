import { deleteService } from "../../../api/service";
import { truncateContext } from "../../../helper/limitedText";
import { styled } from "@mui/material/styles";
import ConfirmCard from "../../../components/dialog/ConfirmCard";
import { t } from "i18next";

interface IProps {
    serviceId: number;
    serviceName: string;
    price: number;
    description: string;
    currency: string;
    openTime: string;
    closeTime: string;
    daysOpen: string[];
    // open: boolean;
    openConfirm: boolean;
    handleOpen: () => void;
    handleClose: () => void;
    handleRefresh: () => void;
    handleSelectService?: (serviceId: number) => void;
}

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: 120,
    }),
    position: "relative",
}));



export default function ListServiceCard(props: IProps) {
    const token = localStorage.getItem("token") ?? "";

    const handleDeleteService = async () => {
        try {
            if (token) {
                await deleteService(props.serviceId, token);
                props.handleRefresh();
                props.handleClose();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div
            className="w-full flex flex-col pr-4 pl-4 bg-white pt-2 pb-2 relative"
            style={{ height: "104px" }}>
            <ConfirmCard
                open={props.openConfirm}
                title={t("noti:service:delete:confirmation")}
                description={t("noti:service:delete:confirmationDesc")}
                bntConfirm={t("button:confirm")}
                bntBack={t("button:cancel")}
                handleClose={props.handleClose}
                handleConfirm={handleDeleteService}
            />

            {/* <div
                style={{
                    width: "65px",
                    height: "104px",
                    background: "#FA6056",
                }}
                className={`absolute top-0 right-0 
                    transition-opacity duration-500 ease-in-out ${props.open ? "opacity-100" : "opacity-0"
                    } shadow-md flex justify-center items-center`}>
                <div
                    className="text-gray-600 hover:text-gray-800 cursor-pointer"
                    onClick={props.handleOpen}>
                    <DeleteOutlinedIcon
                        sx={{ color: "white", fontSize: "18.5px" }}
                    />
                </div>
            </div>
            <div
                style={{
                    width: "65px",
                    height: "104px",
                    background: "#898A8D",
                    right: "65px",
                }}
                className={`absolute top-0 
                    transition-opacity duration-500 ease-in-out ${props.open ? "opacity-100" : "opacity-0"
                    } shadow-md flex justify-center items-center`}>
                <div
                    className="text-gray-600 hover:text-gray-800 cursor-pointer"
                    onClick={() => props.handleSelectService && props.handleSelectService(props.serviceId)}>
                    <ModeEditOutlinedIcon
                        sx={{ color: "white", fontSize: "18.5px" }}
                    />
                </div>
            </div> */}
            <Main>
                <div>
                    <div className="flex justify-between">
                        <div
                            style={{ fontSize: "14px" }}
                            className="font-semibold">
                            {props.serviceName}
                        </div>
                        <div
                            style={{
                                fontSize: "14px",
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
                </div>
            </Main>
        </div>
    );
}
