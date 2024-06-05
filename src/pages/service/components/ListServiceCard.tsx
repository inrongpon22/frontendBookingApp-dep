import { deleteService } from "../../../api/service";
import { truncateContext } from "../../../helper/limitedText";
import { styled } from "@mui/material/styles";
import ConfirmCard from "../../../components/dialog/ConfirmCard";
import { t } from "i18next";
import { dataOfWeekThai, dataOfWeekEng } from "../../../helper/daysOfWeek";
import toast from "react-hot-toast";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

interface IProps {
    serviceId: number;
    serviceName: string;
    price: string;
    description: string;
    currency: string;
    openTime: string;
    closeTime: string;
    daysOpen: string[];
    // open: boolean;
    openConfirm: boolean;
    handleOpen: (serviceId: number) => void;
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
    const lan = localStorage.getItem("i18nextLng");

    const handleDeleteService = async () => {
        try {
            if (token) {
                await deleteService(props.serviceId, token);
                toast(t("deleteSuccess"), {
                    icon: <CheckCircleOutlineIcon sx={{ color: "green" }} />,
                });
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
                        {props.openTime.substring(0, 5)} -{" "}
                        {props.closeTime.substring(0, 5)}{" "}
                    </p>
                    <p style={{ fontSize: "12px" }}>
                        {props.daysOpen.map((day: string, index) => {
                            const dayName =
                                lan === "th"
                                    ? dataOfWeekThai.find(
                                          (x) => x.value === day
                                      )?.name
                                    : dataOfWeekEng.find((x) => x.value === day)
                                          ?.name;
                            // Determine if 'and' or 'และ' should be added
                            const isSecondLast =
                                index === props.daysOpen.length - 2;
                            const isLast = index === props.daysOpen.length - 1;

                            // Add appropriate punctuation
                            let separator = "";
                            if (isSecondLast) {
                                separator = lan === "th" ? " และ " : " and ";
                            } else if (!isLast) {
                                separator = ", ";
                            }

                            return (
                                <span key={index}>
                                    {dayName}
                                    {separator}
                                </span>
                            );
                        })}
                    </p>
                </div>
            </Main>
        </div>
    );
}
