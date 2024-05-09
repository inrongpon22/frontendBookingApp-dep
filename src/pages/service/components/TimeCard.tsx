import { alpha, Box } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useTranslation } from "react-i18next";
import { IBookingSlot } from "../../business/interfaces/service";
import { useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { dataOfWeekEng, dataOfWeekThai } from "../../../helper/daysOfWeek";
import ConfirmCard from "../../../components/dialog/ConfirmCard";

interface IParams {
    daysOpen: string[];
    availableFromDate: string;
    availableToDate: string;
    slotsTime: IBookingSlot[];
    selectedIndex: number;
    handleSetEditTime: () => void;
    handleSelectIndex: (index: number) => void;
    handleDeleteServiceTime: () => void;
}

export default function TimeCard(props: IParams) {
    const { t } = useTranslation();
    const lan = localStorage.getItem("lan");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [openConfirm, setOpenConfirm] = useState(false);
    const handleOpenConfirm = () => setOpenConfirm(true);
    const handleCloseConfirm = () => setOpenConfirm(false);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        props.handleSetEditTime();
        handleClose();
    };

    const handleDeleteSlot = () => {
        props.handleDeleteServiceTime();
        handleClose();
        setAnchorEl(null);
    };

    return (
        <>
            <div
                onClick={() => props.handleSelectIndex(props.selectedIndex)}
                style={{ borderColor: `${alpha("#000000", 0.2)}` }}
                className="flex flex-col p-3 text-sm border rounded-lg focus:outline-none">
                <ConfirmCard
                    open={openConfirm}
                    title={t("askForDelete")}
                    description={`${t("desDeleteServiceF")} ${
                        props.availableFromDate
                    } - ${
                        props.availableToDate == "" ||
                        props.availableToDate == null
                            ? t("present")
                            : props.availableToDate
                    } ${t("desDeleteServiceL")}`}
                    bntConfirm={t("delete")}
                    bntBack={t("button:back")}
                    handleClose={handleCloseConfirm}
                    handleConfirm={handleDeleteSlot}
                />
                <div className="flex justify-between">
                    <div style={{ fontSize: "14px" }}>
                        {props.availableFromDate} -{" "}
                        {props.availableToDate == "" ||
                        props.availableToDate == null
                            ? t("present")
                            : props.availableToDate}
                    </div>
                    <div className="flex gap-1">
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
                            <MoreHorizIcon
                                sx={{
                                    cursor: "pointer",
                                    color: "#020873",
                                    width: "20px",
                                    height: "20px",
                                }}
                            />
                        </Box>
                    </div>
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
                        }}
                        sx={{ borderRadius: "10px" }}>
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

                <div style={{ fontSize: "14px", marginTop: "-10px" }}>
                    {props.daysOpen.map((item, index) => (
                        <span key={item}>
                            {lan === "th"
                                ? dataOfWeekThai.find((x) => x.value === item)
                                      ?.thaiName
                                : dataOfWeekEng.find((x) => x.value === item)
                                      ?.name}
                            {Array.isArray(item) && index === item.length - 2
                                ? lan === "th"
                                    ? " และ "
                                    : " and "
                                : Array.isArray(item) &&
                                  index === item.length - 1
                                ? " "
                                : ", "}
                        </span>
                    ))}
                </div>

                {props?.slotsTime.map((element, index) => (
                    <div key={index}>
                        <div className="flex justify-between">
                            <li className="p-2 list-disc">
                                {element.startTime} - {element.endTime}
                            </li>
                            <div
                                style={{ color: alpha("#000000", 0.5) }}
                                className="flex justify-between gap-3 items-center p-3">
                                {`(${element.capacity} guest)`}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}