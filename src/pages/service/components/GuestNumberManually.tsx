import { alpha } from '@mui/material';
import { t } from 'i18next';
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { IBookingSlot } from '../../../interfaces/services/Iservice';

interface IProps {
    timeSlots: {
        startTime: string;
        endTime: string;
    }[];
    selectedSlots: number[];
    guestNumber: number;
    manualCapacity: IBookingSlot[];
    handleResetGustNumber: () => void;
    handleDecreaseCapacityManual: (startTime: string, endTime: string) => void;
    handleIncreaseCapacityManual: (startTime: string, endTime: string, guestNumber: number) => void;
}

export default function GuestNumberManually(props: IProps) {
    console.log(props.manualCapacity);
    console.log(props.selectedSlots);
    console.log(props.timeSlots);
    return (
        <div className="flex flex-col mt-5 border-black-50 border p-3">
            <div className="flex justify-between">
                <p className="text-sm">
                    {t("Availableguests")}
                </p>
                <u
                    onClick={props.handleResetGustNumber}
                    style={{
                        color: "#020873",
                        fontSize: "14px",
                        cursor: "pointer",
                    }}>
                    {t("translation:reset")}
                </u>
            </div>
            {props.selectedSlots
                .sort((a, b) => a - b)
                .map((element, index) => (
                    <div key={index}>
                        <div className="flex justify-between">
                            <div className="p-3">
                                {
                                    props.manualCapacity[index]
                                        .startTime
                                }{" "}
                                -{" "}
                                {props.manualCapacity[index].endTime}
                            </div>
                            <div className="flex justify-between gap-3 items-center p-3">
                                <button
                                    disabled={
                                        props.manualCapacity[index].capacity == 1
                                    }
                                    onClick={() =>
                                        props.handleDecreaseCapacityManual(
                                            props.timeSlots[
                                                element
                                            ].startTime,
                                            props.timeSlots[
                                                element
                                            ].endTime
                                        )
                                    }
                                    style={{
                                        cursor: "pointer",
                                    }}
                                    className={`border flex justify-center items-center w-8 h-8 rounded-md 
                                                    ${props.manualCapacity[index]
                                            ?.capacity == 1 ? "opacity-40" : ""}`}>
                                    <KeyboardArrowDownIcon />
                                </button>
                                {props.manualCapacity.find(
                                    (item) =>
                                        item.startTime ==
                                        props.timeSlots[
                                            element
                                        ].startTime &&
                                        item.endTime ==
                                        props.timeSlots[
                                            element
                                        ].endTime
                                )?.capacity ?? props.guestNumber}
                                <button
                                    onClick={() =>
                                        props.handleIncreaseCapacityManual(
                                            props.timeSlots[
                                                element
                                            ].startTime,
                                            props.timeSlots[
                                                element
                                            ].endTime,
                                            props.guestNumber
                                        )
                                    }
                                    className="border flex justify-center items-center w-8 h-8 rounded-md"
                                    style={{
                                        cursor: "pointer",
                                        marginRight: "-5px",
                                    }}>
                                    <KeyboardArrowUpIcon />
                                </button>
                            </div>
                        </div>
                        <hr
                            style={{
                                borderColor: `${alpha(
                                    "#000000",
                                    0.2
                                )}`,
                            }}
                            className="border-1 border-black-50"
                        />
                    </div>
                ))}
        </div>
    );
}
