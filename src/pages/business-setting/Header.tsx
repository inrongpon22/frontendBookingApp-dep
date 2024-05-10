import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ConfirmCard from "../../components/dialog/ConfirmCard";
import { useState } from "react";
import { t } from "i18next";

interface IProps {
    context: string;
    handleIsEdit: () => void;
    isEdit: boolean;
    IsClickEdit: boolean;
}

export default function Header(props: IProps) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        if (props.IsClickEdit) {
            setOpen(true);
        } else {
            navigate(-1);
        }
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="flex items-center justify-between">
            <ConfirmCard
                open={open}
                title={t("titleDiscard")}
                description={t("desc:descriptionDiscard")}
                bntConfirm={t("button:discard")}
                bntBack={t("button:cancel")}
                handleClose={handleClose}
                handleConfirm={() => navigate(-1)}
            />
            <div onClick={handleOpen}>
                <ArrowBackIosNewOutlinedIcon
                    sx={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                    }}
                />
            </div>

            <div className="font-bold" style={{ fontSize: "14px" }}>
                {props.context}
            </div>

            <div>
                <IconButton onClick={props.handleIsEdit}>
                    {props.isEdit ? <DoDisturbIcon /> : <EditOutlinedIcon />}
                </IconButton>
            </div>
        </div>
    );
}