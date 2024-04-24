import { useState } from "react";
import { dataOfWeekEng } from "../../helper/daysOfWeek";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function CreateServiceTwo() {
    const [daysOpen, setDaysOpen] = useState<string[]>([]);
    const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
    const [duration, setDuration] = useState(1);
    const [openTime, setOpenTime] = useState("");
    const [closeTime, setCloseTime] = useState("");
    const [guestNumber, setGuestNumber] = useState(1);
    const [isManually, setIsManually] = useState(false);

    const [manualCapacity, setManualCapacity] = useState<
        {
            startTime: string;
            endTime: string;
            capacity: number;
        }[]
    >([]);

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
        while (currentTime <= endTime) {
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
                Available date
            </p>
            <div className="flex justify-between mt-3">
                <div
                    style={{ width: "45%", height: "51px" }}
                    className="rounded-lg flex items-center gap-4 border border-black-50 p-2">
                    <div style={{ fontSize: "14px" }}>From</div>
                    <input
                        className="focus:outline-none text-black-500 text-xs"
                        type="date"
                        style={{ border: "none" }}
                    />
                </div>
                <div className="flex justify-center items-center">-</div>
                <div
                    style={{ width: "45%", height: "51px" }}
                    className="rounded-lg flex items-center gap-4 border border-black-50 p-2">
                    <div style={{ fontSize: "14px", marginRight: "15px" }}>
                        To
                    </div>
                    <input
                        className="focus:outline-none text-black-500 text-xs"
                        type="date"
                        style={{ border: "none" }}
                    />
                </div>
            </div>

            <p className="font-semibold mt-3" style={{ fontSize: "14px" }}>
                Active days
            </p>
            <div className="flex justify-between mt-3">
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
            <p className="font-semibold mt-3" style={{ fontSize: "14px" }}>
                Available time
            </p>
            <div className="flex justify-between mt-3">
                <div
                    style={{ width: "156px", height: "51px" }}
                    className="rounded-lg flex gap-1 border-black-50 border justify-between items-center p-4">
                    <div style={{ fontSize: "14px", marginRight: "15px" }}>
                        From
                    </div>
                    <div className="flex">
                        <input
                            className="font-black-500 focus:outline-none"
                            value={openTime}
                            onChange={(e) => setOpenTime(e.target.value)}
                            type="time"
                            style={{
                                border: "none",
                            }}
                        />
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
                            className="focus:outline-none"
                        />
                    </div>
                </div>
            </div>
            <div
                style={{ width: "100%", height: "51px" }}
                className="rounded-lg flex border-black-50 border justify-between items-center p-4 mt-3">
                <div style={{ fontSize: "14px" }}>Duration</div>
                <div className="flex items-center gap-2">
                    <input
                        className=" focus:outline-none "
                        onChange={(e) =>
                            handleChangeDuration(Number(e.target.value))
                        }
                        value={duration}
                        type="number"
                        style={{
                            border: "none",
                            width: "40px",
                            textAlign: "center",
                        }}
                    />
                    <p>hr</p>
                    <div className="flex flex-col">
                        <button onClick={increaseDuration}>
                            <KeyboardArrowUpIcon
                                sx={{ fontSize: "20px", marginBottom: "-15px" }}
                            />
                        </button>
                        <button
                            disabled={duration == 0.5}
                            onClick={decreaseDuration}>
                            <KeyboardArrowDownIcon
                                sx={{ fontSize: "20px", marginTop: "-15px" }}
                            />
                        </button>
                    </div>
                </div>
            </div>

            <p className="font-semibold mt-3" style={{ fontSize: "14px" }}>
                Open slot
            </p>
            <div className="flex justify-between gap-2 w-full flex-wrap">
                {TimeSlots.slice(0, -1).map((_timeSlot, index) => (
                    <div
                        key={index}
                        className={`
                rounded-lg flex justify-center items-center p-4 border-black-50 border
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
                        {TimeSlots[index]} - {TimeSlots[index + 1]}
                    </div>
                ))}
            </div>

            {isManually == true ? (
                <div className="flex flex-col mt-3">
                    <div className="flex justify-between">
                        <p className="text-sm">Available guest(s)</p>
                        <u style={{ color: "#020873", fontSize: "14px" }}>
                            Reset
                        </u>
                    </div>
                    {selectedSlots.map((element) => (
                        <div key={element}>
                            <div className="flex justify-between">
                                <div className="p-3">
                                    {TimeSlots[element]} -{" "}
                                    {TimeSlots[element + 1]}
                                </div>
                                <div className="flex justify-between gap-3 items-center p-3">
                                    <button
                                        disabled={guestNumber === 1}
                                        onClick={() =>
                                            setGuestNumber((prev) => prev - 1)
                                        }
                                        className="border flex justify-center items-center w-8 h-8 rounded-md">
                                        <KeyboardArrowDownIcon />
                                    </button>
                                    {guestNumber}
                                    <button
                                        onClick={() =>
                                            setGuestNumber((prev) => prev + 1)
                                        }
                                        className="border flex justify-center items-center w-8 h-8 rounded-md">
                                        <KeyboardArrowUpIcon />
                                    </button>
                                </div>
                            </div>
                            <hr className="border-1 border-black-50" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex justify-between border rounded-lg mt-3">
                    <div className="p-3">
                        <p style={{ fontSize: "14px", color: "#1C1C1C" }}>
                            Available guest(s) per slot
                        </p>
                        <u
                            onClick={() => setIsManually(true)}
                            style={{ color: "#020873", fontSize: "12px" }}>
                            Manually adjust
                        </u>
                    </div>
                    <div className="flex justify-between gap-3 items-center p-3">
                        <button
                            disabled={guestNumber == 1}
                            onClick={() => setGuestNumber((pre) => pre - 1)}
                            className="border flex justify-center items-center w-8 h-8 rounded-md">
                            <KeyboardArrowDownIcon />
                        </button>
                        {guestNumber}
                        <button
                            onClick={() => setGuestNumber((pre) => pre + 1)}
                            className="border flex justify-center items-center w-8 h-8 rounded-md">
                            <KeyboardArrowUpIcon />
                        </button>
                    </div>
                </div>
            )}

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
