import { alpha, Box } from "@mui/material";
import { truncateContext } from "../../../helper/limitedText";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useTranslation } from "react-i18next";
import { deleteService } from "../../../api/service";
import ConfirmCard from "../../../components/dialog/ConfirmCard";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

interface IParams {
    serviceName: string;
    serviceDescription: string;
    price: string;
    currency: string;
    serviceId?: number;
    handleSetEditInfo: () => void;
    handleCloseAfterDelete?: () => void;
}

export default function ServiceCard(props: IParams) {
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [openConfirm, setOpenConfirm] = useState(false);
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get("type");

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleOpenConfirm = () => setOpenConfirm(true);
    const handleCloseConfirm = () => setOpenConfirm(false);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        props.handleSetEditInfo();
        handleClose();
    };

    const handleDeleteService = async () => {
        if (props.serviceId) {
            await deleteService(
                props.serviceId,
                localStorage.getItem("token") ?? ""
            );
        }
        handleCloseConfirm();
        handleClose();
        setAnchorEl(null);
        props.handleCloseAfterDelete && props.handleCloseAfterDelete();
    };

    return (
        <div
            style={{ borderColor: `${alpha("#000000", 0.2)}` }}
            className="flex flex-col p-3 text-sm border rounded-lg focus:outline-none">
            <ConfirmCard
                open={openConfirm}
                title={t("askForDelete")}
                description={t("desc:desDeleteServiceF")}
                bntConfirm={t("delete")}
                bntBack={t("button:back")}
                handleClose={handleCloseConfirm}
                handleConfirm={handleDeleteService}
            />
            <div className="flex justify-between">
                <div className=" font-bold mb-2" style={{ fontSize: "14px" }}>
                    {props.serviceName}
                </div>

                {type ? (
                    <Box
                        sx={{
                            display: "flex",
                            height: "32px",
                            padding: "8px",
                            borderRadius: "8px",
                            background: `${alpha("#020873", 0.1)}`,
                            alignContent: "center",
                            alignItems: "center",
                        }}>
                        <EditOutlinedIcon
                            onClick={handleEdit}
                            sx={{
                                cursor: "pointer",
                                color: "#020873",
                                width: "20px",
                                height: "20px",
                            }}
                        />
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: "flex",
                            height: "32px",
                            padding: "8px",
                            borderRadius: "8px",
                            background: `${alpha("#020873", 0.1)}`,
                            alignContent: "center",
                            alignItems: "center",
                        }}
                        onClick={handleClick}>
                        <MoreHorizIcon />
                    </Box>
                )}
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    transformOrigin={{
                        horizontal: "right",
                        vertical: "top",
                    }}
                    anchorOrigin={{
                        horizontal: "right",
                        vertical: "bottom",
                    }}>
                    <MenuItem onClick={handleEdit}>
                        <ListItemIcon>
                            <EditOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>{t("edit")}</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleOpenConfirm}>
                        <ListItemIcon>
                            <DeleteOutlineIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>{t("delete")}</ListItemText>
                    </MenuItem>
                </Menu>
            </div>
            <div style={{ fontSize: "14px", marginTop: "-10px", width: "70%" }}>
                {truncateContext(props.serviceDescription, 90)}{" "}
            </div>
            <div style={{ fontSize: "14px" }}>
                {props.price} {props.currency}
            </div>
        </div>
    );
}
