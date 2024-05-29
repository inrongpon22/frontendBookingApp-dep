import { alpha, Divider } from "@mui/material";
import { t } from "i18next";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { ToggleButton as MuiToggleButton } from "@mui/material";

interface IProps {
    maximumAllow: number;
    isLimitBooking: boolean;
    handleIsLimitBooking: () => void;
    handleIncreateMaximumAllow: () => void;
    handleDecreaseMaximumAllow: () => void;
}

export default function LimitBooking(props: IProps) {
    return (
        <div
            className="flex flex-col border rounded-lg mt-2"
            style={{
                borderColor: `${alpha("#000000", 0.2)}`,
            }}>
            <div className="flex justify-between items-center">
                <div className="p-3">
                    <p
                        style={{
                            fontSize: "14px",
                            color: "#1C1C1C",
                        }}>
                        {t("title:limitGuest")}
                    </p>
                    <p className="text-[12px] text-[#6A6A6A] w-[50vw]">
                        {t("desc:desLimitGuest")}
                    </p>
                </div>
                <MuiToggleButton
                    value={props.isLimitBooking}
                    aria-label="Toggle switch"
                    onClick={props.handleIsLimitBooking}
                    sx={{
                        width: 49,
                        height: 28,
                        borderRadius: 16,
                        backgroundColor: props.isLimitBooking
                            ? "#020873"
                            : "#ffffff",
                        border: props.isLimitBooking
                            ? "1px solid #020873"
                            : "1px solid  #9E9E9E",
                        ":focus": { outline: "none" },
                        ":hover": {
                            backgroundColor: props.isLimitBooking
                                ? "#020873"
                                : "#ffffff",
                        },
                        mr: 1,
                    }}>
                    <span
                        style={{
                            width: 23,
                            height: 23,
                            marginLeft: props.isLimitBooking ? "" : "1px",
                            marginRight: props.isLimitBooking ? "100px" : " ",
                            backgroundColor: props.isLimitBooking
                                ? "#ffffff"
                                : "#9E9E9E",
                            color: props.isLimitBooking ? "#020873" : "#ffffff",
                            borderRadius: "50%",
                        }}
                        className={`absolute left-0 rounded-full 
                                shadow-md flex items-center justify-center transition-transform duration-300 ${
                                    props.isLimitBooking
                                        ? "transform translate-x-full"
                                        : ""
                                }`}>
                        {props.isLimitBooking ? (
                            <CheckIcon sx={{ fontSize: "14px" }} />
                        ) : (
                            <CloseIcon sx={{ fontSize: "14px" }} />
                        )}
                    </span>
                </MuiToggleButton>
            </div>
            <Divider />
            {props.isLimitBooking && (
                <div className="flex justify-between gap-3 items-center p-3">
                    <div className="text-[14px] font-normal">
                        {t("maximumallowed")}
                    </div>
                    <button
                        disabled={props.maximumAllow == 1}
                        onClick={props.handleDecreaseMaximumAllow}
                        className={`border flex justify-center items-center w-8 h-8 rounded-md 
                        ${props.maximumAllow == 1 ? "opacity-40" : ""}`}>
                        <KeyboardArrowDownIcon />
                    </button>
                    {props.maximumAllow}
                    <button
                        onClick={props.handleIncreateMaximumAllow}
                        className="border flex justify-center items-center w-8 h-8 rounded-md">
                        <KeyboardArrowUpIcon />
                    </button>
                </div>
            )}
        </div>
    );
}
