import { alpha } from '@mui/material';
import { t } from 'i18next';
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface IProps {
    handleIsManually: () => void;
    timeSlots: {
        startTime: string;
        endTime: string;
    }[];
    selectedSlots: number[];
    guestNumber: number;
    increaseGuest: () => void;
    decreaseGuest: () => void;
}

export default function GuestNumber(props: IProps) {
    return (
        <div
            style={{
                borderColor: `${alpha("#000000", 0.2)}`,
            }}
            className="flex justify-between border rounded-lg mt-3">
            <div className="p-3">
                <p
                    style={{
                        fontSize: "14px",
                        color: "#1C1C1C",
                    }}>
                    {t("fragment:avaiGuest")}
                </p>
                <button
                    onClick={props.handleIsManually}
                    disabled={
                        props.timeSlots.length == 0 ||
                        props.timeSlots[0].startTime == "" ||
                        props.selectedSlots.length == 0
                    }>
                    <u
                        style={{
                            color: "#020873",
                            fontSize: "12px",
                        }}>
                        {t("fragment:manualAdjust")}
                    </u>
                </button>
            </div>
            <div className="flex justify-between gap-3 items-center p-3">
                <button
                    disabled={props.guestNumber == 1}
                    onClick={props.decreaseGuest}
                    className={`border flex justify-center items-center w-8 h-8 rounded-md ${props.guestNumber == 1 ? "opacity-40" : ""}`}>
                    <KeyboardArrowDownIcon />
                </button>
                {props.guestNumber}
                <button
                    onClick={props.increaseGuest}
                    className="border flex justify-center items-center w-8 h-8 rounded-md">
                    <KeyboardArrowUpIcon />
                </button>
            </div>
        </div>
    );
}
