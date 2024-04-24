import { useState } from "react";
import { dataOfWeekEng } from "../../helper/daysOfWeek";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Box } from "@mui/material";

export default function Schedule() {
    const [daysOpen, setDaysOpen] = useState<string[]>([]);
    const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
    const [duration, setDuration] = useState(1);
    const [openTime, setOpenTime] = useState("");
    const [closeTime, setCloseTime] = useState("");
    const TimeSlots: string[] = [];

    const isDaySelected = (dayValue: string) => {
        return daysOpen.includes(dayValue);
    };

    const toggleDay = (dayValue: string) => {
        if (isDaySelected(dayValue)) {
            setDaysOpen(daysOpen.filter((day) => day !== dayValue));
        } else {
            setDaysOpen([...daysOpen, dayValue]);
        }
    };

    const toggleSlotSelection = (index: number) => {
        if (selectedSlots.includes(index)) {
            setSelectedSlots(
                selectedSlots.filter((slotIndex) => slotIndex !== index)
            );
        } else {
            setSelectedSlots([...selectedSlots, index]);
        }
    };

    // Function to generate time slots
    const generateTimeSlots = (
        startTime: string,
        endTime: string,
        duration: number
    ) => {
        let currentTime = startTime;
        while (currentTime < endTime) {
            TimeSlots.push(currentTime);
            const [hours, minutes] = currentTime.split(":").map(Number);
            const totalMinutes = hours * 60 + minutes;
            const newTotalMinutes = totalMinutes + duration;
            const newHours = Math.floor(newTotalMinutes / 60);
            const newMinutes = newTotalMinutes % 60;
            currentTime = `${newHours.toString().padStart(2, "0")}:${newMinutes
                .toString()
                .padStart(2, "0")}`;
        }
    };

    const handleChangeDuration = (value: number) => {
        setDuration(value);
    };
    const increaseDuration = () => {
        setDuration((pre) => pre + 0.5);
    };
    const decreaseDuration = () => {
        setDuration((pre) => pre - 0.5);
    };
    generateTimeSlots(openTime, closeTime, duration * 60);
    return (
        <div className="mt-4 flex flex-col">
            <p className="font-semibold" style={{ fontSize: "14px" }}>
                Active days
            </p>
            <div className="flex justify-between mt-2">
                {dataOfWeekEng.map((day, index) => (
                    <div
                        onClick={() => toggleDay(day.value)}
                        key={index}
                        style={{
                            width: "45px",
                            height: "47px",
                            borderColor: isDaySelected(day.value)
                                ? "#020873"
                                : "",
                            backgroundColor: isDaySelected(day.value)
                                ? "rgb(2, 8, 115,0.2)"
                                : "white",
                        }}
                        className={`
                            ${
                                isDaySelected(day.value)
                                    ? "border-custom-color border-2"
                                    : "border-black-50 border"
                            }
                            flex items-center justify-center rounded-lg`}>
                        {day.name}
                    </div>
                ))}
            </div>
            <p className="font-semibold mt-2" style={{ fontSize: "14px" }}>
                Availability
            </p>
            <div className="flex justify-between mt-2">
                <div
                    style={{ width: "156px", height: "51px" }}
                    className="rounded-lg flex gap-1 border-black-50 border justify-between items-center p-4">
                    <div style={{ fontSize: "14px", marginRight: "15px" }}>
                        From
                    </div>
                    <div className="flex">
                        <input
                            className="font-black-500"
                            value={openTime}
                            onChange={(e) => setOpenTime(e.target.value)}
                            type="time"
                            style={{
                                border: "none",
                            }}
                        />
                        {/* <div
                            className="flex flex-col"
                            style={{ marginLeft: "-20px" }}>
                            <KeyboardArrowUpIcon sx={{ fontSize: "20px" }} />
                            <KeyboardArrowDownIcon sx={{ fontSize: "20px" }} />
                        </div> */}
                    </div>
                </div>
                <div className="flex justify-center items-center">-</div>
                <div
                    style={{ width: "156px", height: "51px" }}
                    className="rounded-lg  flex gap-1 border-black-50 border justify-between items-center p-4">
                    <div style={{ fontSize: "14px" }}>To</div>
                    <div className="flex">
                        <input
                            value={closeTime}
                            onChange={(e) => setCloseTime(e.target.value)}
                            type="time"
                            style={{ border: "none" }}
                        />
                        {/* <div
                            className="flex flex-col"
                            style={{ marginLeft: "-20px" }}>
                            <KeyboardArrowUpIcon sx={{ fontSize: "20px" }} />
                            <KeyboardArrowDownIcon sx={{ fontSize: "20px" }} />
                        </div> */}
                    </div>
                </div>
            </div>
            <div
                style={{ width: "100%", height: "51px" }}
                className="rounded-lg flex border-black-50 border justify-between items-center p-4 mt-3">
                <div style={{ fontSize: "14px" }}>Duration</div>
                <div className="flex items-center gap-2">
                    <input
                        onChange={(e) =>
                            handleChangeDuration(Number(e.target.value))
                        }
                        value={duration}
                        type="number"
                        style={{
                            border: "none",
                            width: "30px",
                            textAlign: "center",
                        }}
                    />
                    <p>hr</p>
                    <div className="flex flex-col">
                        <Box onClick={increaseDuration}>
                            <KeyboardArrowUpIcon sx={{ fontSize: "20px" }} />
                        </Box>
                        <Box onClick={decreaseDuration}>
                            <KeyboardArrowDownIcon sx={{ fontSize: "20px" }} />
                        </Box>
                    </div>
                </div>
            </div>

            <p className="font-semibold mt-2" style={{ fontSize: "14px" }}>
                Open slot
            </p>
            <div className="flex justify-between mt-2 gap-2 w-full flex-wrap">
                {TimeSlots.map((timeSlot, index) => (
                    <div
                        key={index}
                        className={`
                        rounded-lg flex justify-between items-center p-4 border-black-50 border
                        ${
                            selectedSlots.includes(index)
                                ? "border-custom-color border-2"
                                : "border-black-50 border"
                        }
                        `}
                        style={{
                            width: "48%",
                            height: "51px",
                            borderColor: selectedSlots.includes(index)
                                ? "#020873"
                                : "",
                            backgroundColor: selectedSlots.includes(index)
                                ? "rgb(2, 8, 115,0.2)"
                                : "white",
                        }}
                        onClick={() => toggleSlotSelection(index)}>
                        {timeSlot}
                    </div>
                ))}
            </div>
            <div className="w-full flex justify-center mt-8">
                <button
                    type="submit"
                    // onClick={() => navigate()}
                    className="text-white mt-4 rounded-lg font-semibold mb-6"
                    style={{
                        width: "343px",
                        height: "51px",
                        cursor: "pointer",
                        backgroundColor: "#020873",
                        fontSize: "14px",
                    }}>
                    Next
                </button>
            </div>
        </div>
    );
}
