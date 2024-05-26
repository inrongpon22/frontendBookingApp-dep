import { alpha } from "@mui/material";
import { t } from "i18next";

interface ITimeSlot {
    timeSlots: {
        startTime: string;
        endTime: string;
    }[];
    selectedSlots: number[];
    toggleSlotSelection: (index: number, startTime: string, endTime: string) => void;
}

export default function SlotTimes(props: ITimeSlot) {
    return (
        <div>
            <p
                className="font-semibold mt-3"
                style={{ fontSize: "14px" }}>
                {t("openSlot")}
            </p>
            <div className="flex justify-between gap-2 w-full flex-wrap mt-3">
                {props.timeSlots.map((slot, index) => (
                    <div
                        key={index}
                        className={`cursor-pointer rounded-lg flex justify-center items-center p-4 border-black-50 border
                                ${props.selectedSlots.includes(index)
                                ? "border-custom-color border-2"
                                : "border-black-50 border"
                            }`}
                        style={{
                            width: "48%",
                            height: "51px",
                            borderColor: props.selectedSlots.includes(
                                index
                            )
                                ? "#020873"
                                : `${alpha("#000000", 0.2)}`,
                            backgroundColor: props.selectedSlots.includes(
                                index
                            )
                                ? "rgb(2, 8, 115,0.2)"
                                : "white",
                        }}
                        onClick={() => props.toggleSlotSelection(index, slot.startTime, slot.endTime)}>
                        {slot.startTime} - {slot.endTime}
                    </div>
                ))}
            </div>
        </div>
    );
}
