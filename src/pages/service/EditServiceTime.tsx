import { useEffect, useState } from "react";
import { dataOfWeekThai } from "../../helper/daysOfWeek";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { alpha } from "@mui/material";
import { Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import { IBookingSlot, IServiceEditTime } from "../business/interfaces/service";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { updateServiceTime } from "../../api/service";

interface IParams {
    serviceTime: IServiceEditTime[];
    duration: number;
    openTime: string;
    closeTime: string;
    editIndex: number;
    serviceId: number;
    isAddTime: boolean;
    handleSetEditTime: () => void;
}

export default function EditServiceTime(props: IParams) {
    const { t } = useTranslation();

    const [daysOpen, setDaysOpen] = useState<string[]>(
        props.isAddTime ? [] : props.serviceTime[props.editIndex].daysOpen
    );
    const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
    const [duration, setDuration] = useState(
        props.isAddTime ? 1 : props.duration
    );
    const [openTime, setOpenTime] = useState(
        props.isAddTime ? "" : props.openTime.substring(0, 5)
    );
    const [closeTime, setCloseTime] = useState(
        props.isAddTime ? "" : props.closeTime.substring(0, 5)
    );
    const [guestNumber, setGuestNumber] = useState(1);
    const [isManually, setIsManually] = useState(
        props.editIndex > -1 ? true : false
    );
    const [manualCapacity, setManualCapacity] = useState<IBookingSlot[]>(
        props.isAddTime ? [] : props.serviceTime[props.editIndex].slotsTime
    );
    const [availableFromDate, setAvailableFromDate] = useState(
        props.isAddTime
            ? new Date().toISOString().split("T")[0]
            : props.serviceTime[props.editIndex].availableFromDate
    );
    const [availableToDate, setAvailableToDate] = useState(
        props.isAddTime
            ? ""
            : props.serviceTime[props.editIndex].availableToDate
    );
    const [disibleDays, setDisibleDays] = useState<string[]>([]);
    const timeSlots: {
        startTime: string;
        endTime: string;
    }[] = [];

    const generateTimeSlots = (
        startTime: string,
        endTime: string,
        duration: number
    ) => {
        duration = duration * 60;
        let currentTime = startTime;
        while (currentTime <= endTime) {
            const [hours, minutes] = currentTime.split(":").map(Number);
            const totalMinutes = hours * 60 + minutes;
            const newTotalMinutes = totalMinutes + duration;
            const newHours = Math.floor(newTotalMinutes / 60);
            const newMinutes = newTotalMinutes % 60;
            const endTimeHours = Math.floor(newTotalMinutes / 60);
            const endTimeMinutes = newTotalMinutes % 60;
            const endTimeString = `${endTimeHours
                .toString()
                .padStart(2, "0")}:${endTimeMinutes
                .toString()
                .padStart(2, "0")}`;
            if (endTimeString > endTime) {
                break;
            }
            timeSlots.push({ startTime: currentTime, endTime: endTimeString });
            currentTime = `${newHours.toString().padStart(2, "0")}:${newMinutes
                .toString()
                .padStart(2, "0")}`;
        }
    };

    useEffect(() => {
        if (props.serviceTime[0].daysOpen !== undefined) {
            props.serviceTime.forEach((element) => {
                if (
                    element.availableFromDate == availableFromDate &&
                    element.availableToDate == availableToDate
                ) {
                    setDisibleDays(element.daysOpen);
                } else {
                    setDisibleDays([]);
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [availableFromDate, availableToDate]);

    const toggleSlotSelection = (index: number) => {
        if (selectedSlots.includes(index)) {
            setSelectedSlots(
                selectedSlots.filter((slotIndex) => slotIndex !== index)
            );
        } else {
            setSelectedSlots([...selectedSlots, index]);
        }
    };

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

    const handleIncreaseCapacityManual = (
        startTime: string,
        endTime: string,
        capacity: number
    ) => {
        // Find the index of the slot in manualCapacity array
        const index = manualCapacity.findIndex(
            (slot) => slot.startTime === startTime && slot.endTime === endTime
        );
        // If the slot already exists, update its capacity
        if (index !== -1) {
            setManualCapacity((prevCapacity) => {
                const updatedCapacity = [...prevCapacity];
                updatedCapacity[index] = {
                    startTime,
                    endTime,
                    capacity: updatedCapacity[index].capacity + 1,
                };
                return updatedCapacity;
            });
        } else {
            // If the slot doesn't exist, add it to the manualCapacity array with capacity 1
            setManualCapacity((prevCapacity) => [
                ...prevCapacity,
                { startTime, endTime, capacity: capacity + 1 },
            ]);
        }
    };

    const handleDecreaseCapacityManual = (
        startTime: string,
        endTime: string
    ) => {
        const index = manualCapacity.findIndex(
            (slot) => slot.startTime === startTime && slot.endTime === endTime
        );

        // If the slot exists and its capacity is greater than 0, decrease its capacity
        if (index !== -1) {
            setManualCapacity((prevCapacity) => {
                const updatedCapacity = [...prevCapacity];
                updatedCapacity[index] = {
                    startTime,
                    endTime,
                    capacity:
                        updatedCapacity[index].capacity > 0
                            ? updatedCapacity[index].capacity - 1
                            : 0,
                };
                return updatedCapacity;
            });
        } else {
            // If the slot doesn't exist, add it to the manualCapacity array with capacity 1
            setManualCapacity((prevCapacity) => [
                ...prevCapacity,
                { startTime, endTime, capacity: guestNumber - 1 },
            ]);
        }
    };

    const increaseGuest = () => {
        setGuestNumber((prev) => prev + 1);
        manualCapacity.forEach((element) => {
            element.capacity = guestNumber + 1;
        });
    };
    const decreaseGuest = () => {
        setGuestNumber((prev) => prev - 1);
        manualCapacity.forEach((element) => {
            element.capacity = guestNumber - 1;
        });
    };

    const increaseDuration = () => {
        setDuration((prev) => prev + 0.5);
    };
    const decreaseDuration = () => {
        setDuration((prev) => prev - 0.5);
    };

    const handleResetGustNumber = () => {
        manualCapacity.forEach((element) => {
            element.capacity = 1;
        });
        setIsManually(false);
    };

    const handleCloseTime = (time: string) => {
        setCloseTime(time);
    };

    generateTimeSlots(openTime, closeTime, duration);

    useEffect(() => {
        if (props.serviceTime[props.editIndex].slotsTime !== undefined) {
            const selectedSlots: number[] = [];
            props.serviceTime[props.editIndex].slotsTime.forEach((slot) => {
                const index = timeSlots.findIndex(
                    (timeSlot) =>
                        timeSlot.startTime === slot.startTime &&
                        timeSlot.endTime === slot.endTime
                );
                if (index !== -1) {
                    selectedSlots.push(index);
                }
            });
            setSelectedSlots(selectedSlots);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async () => {
        const insertData = {
            daysOpen: daysOpen,
            availableFromDate: availableFromDate,
            availableToDate: availableToDate,
            slotsTime: manualCapacity,
        };
        props.serviceTime[props.editIndex] = insertData;
        await updateServiceTime(
            props.serviceTime,
            localStorage.getItem("token") ?? "",
            props.serviceId
        );
        props.handleSetEditTime();
    };

    return (
        <div className="mb-10">
            <div className="pr-4 pl-4 pt-6">
                <div className="flex items-center justify-between">
                    <div onClick={props.handleSetEditTime}>
                        <ArrowBackIosNewOutlinedIcon
                            sx={{
                                width: "20px",
                                height: "20px",
                                cursor: "pointer",
                            }}
                        />
                    </div>

                    <div className="font-bold" style={{ fontSize: "14px" }}>
                        {t("title:serviceTime")}
                    </div>

                    <div></div>
                </div>
            </div>
            <Divider sx={{ marginTop: "16px", width: "100%" }} />
            <div className="flex flex-col pr-4 pl-4">
                <div
                    style={{ marginBottom: "70px" }}
                    className="mt-4 flex flex-col">
                    <p className="font-semibold" style={{ fontSize: "14px" }}>
                        {t("availableDate")}
                    </p>
                    <div className="flex justify-between mt-3">
                        <div
                            style={{
                                width: "45%",
                                height: "51px",
                                borderColor: `${alpha("#000000", 0.2)}`,
                            }}
                            className="rounded-lg flex items-center gap-4 border p-2 justify-between">
                            <div
                                style={{
                                    fontSize: "14px",
                                    marginRight: "-10px",
                                }}>
                                {t("from")}
                            </div>
                            <input
                                className="focus:outline-none text-black-500 text-xs"
                                type="date"
                                style={{ border: "none" }}
                                name="availableFromDate"
                                min={new Date().toISOString().split("T")[0]}
                                value={availableFromDate}
                                onChange={(e) =>
                                    setAvailableFromDate(e.target.value)
                                }
                            />
                        </div>
                        <div className="flex justify-center items-center">
                            -
                        </div>
                        <div
                            style={{
                                width: "45%",
                                height: "51px",
                                borderColor: `${alpha("#000000", 0.2)}`,
                            }}
                            className="rounded-lg flex items-center gap-4 border border-black-50 p-2 justify-between">
                            <div
                                style={{
                                    fontSize: "14px",
                                    marginRight: "10px",
                                }}>
                                {t("to")}
                            </div>
                            <input
                                className="focus:outline-none text-black-500 text-xs"
                                type="date"
                                style={{ border: "none" }}
                                name="availableToDate"
                                min={availableFromDate}
                                value={availableToDate}
                                onChange={(e) =>
                                    setAvailableToDate(e.target.value)
                                }
                            />
                        </div>
                    </div>
                    <p
                        className="font-semibold mt-3"
                        style={{ fontSize: "14px" }}>
                        {t("activeDays")}
                    </p>
                    <div className="flex justify-between mt-3">
                        {dataOfWeekThai.map((day, index) => (
                            <button
                                disabled={disibleDays.some(
                                    (item) => item == day.value
                                )}
                                onClick={() => toggleDay(day.value)}
                                key={index}
                                style={{
                                    width: "45px",
                                    height: "47px",
                                    border: isDaySelected(day.value)
                                        ? "2px solid #020873"
                                        : `1px solid ${alpha("#000000", 0.2)}`,
                                    borderRadius: "8px",
                                    backgroundColor: isDaySelected(day.value)
                                        ? "rgb(2, 8, 115,0.2)"
                                        : "white",
                                }}>
                                {day.name}
                            </button>
                        ))}
                    </div>
                    {daysOpen.length < 0 ? (
                        <div className="text-red-500 text-sm mt-1">
                            At least one day must be selected
                        </div>
                    ) : null}

                    <p
                        className="font-semibold mt-3"
                        style={{ fontSize: "14px" }}>
                        {t("availableTime")}
                    </p>
                    <div className="flex justify-between mt-3">
                        <div
                            style={{
                                width: "156px",
                                height: "51px",
                                borderColor: `${alpha("#000000", 0.2)}`,
                            }}
                            className="rounded-lg flex gap-1 border-black-50 border justify-between items-center p-4">
                            <div
                                style={{
                                    fontSize: "14px",
                                    marginRight: "15px",
                                }}>
                                {t("from")}
                            </div>
                            <div className="flex">
                                <input
                                    className="font-black-500 focus:outline-none"
                                    value={openTime}
                                    onChange={(e) =>
                                        setOpenTime(e.target.value)
                                    }
                                    type="time"
                                    style={{
                                        border: "none",
                                    }}
                                    name="openTime"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                            -
                        </div>
                        <div
                            style={{
                                width: "156px",
                                height: "51px",
                                borderColor: `${alpha("#000000", 0.2)}`,
                            }}
                            className="rounded-lg  flex gap-1 border-black-50 border justify-between items-center p-4">
                            <div style={{ fontSize: "14px" }}>{t("to")}</div>
                            <div className="flex">
                                <input
                                    min={openTime}
                                    value={closeTime}
                                    onChange={(e) =>
                                        handleCloseTime(e.target.value)
                                    }
                                    type="time"
                                    style={{ border: "none" }}
                                    className="focus:outline-none"
                                    name="closeTime"
                                    disabled={openTime == ""}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        style={{
                            width: "100%",
                            height: "51px",
                            borderColor: `${alpha("#000000", 0.2)}`,
                        }}
                        className="rounded-lg flex border-black-50 border justify-between items-center p-4 mt-3">
                        <div style={{ fontSize: "14px" }}>{t("duration")}</div>
                        <div className="flex items-center gap-2">
                            <input
                                className=" focus:outline-none "
                                type="number"
                                style={{
                                    border: "none",
                                    width: "40px",
                                    textAlign: "center",
                                }}
                                name="duration"
                                value={duration}
                                onChange={(e) =>
                                    setDuration(Number(e.target.value))
                                }
                            />
                            <p>{t("hr")}</p>
                            <div className="flex flex-col">
                                <button onClick={increaseDuration}>
                                    <KeyboardArrowUpIcon
                                        sx={{
                                            fontSize: "20px",
                                            marginBottom: "-10px",
                                        }}
                                    />
                                </button>
                                <button
                                    disabled={duration == 0.5}
                                    onClick={decreaseDuration}>
                                    <KeyboardArrowDownIcon
                                        sx={{
                                            fontSize: "20px",
                                            marginTop: "-10px",
                                        }}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    <p
                        className="font-semibold mt-3"
                        style={{ fontSize: "14px" }}>
                        {t("openSlot")}
                    </p>
                    <div className="flex justify-between gap-2 w-full flex-wrap mt-3">
                        {timeSlots.map((slot, index) => (
                            <div
                                key={index}
                                className={`cursor-pointer rounded-lg flex justify-center items-center p-4 border-black-50 border
                                ${
                                    selectedSlots.includes(index)
                                        ? "border-custom-color border-2"
                                        : "border-black-50 border"
                                }`}
                                style={{
                                    width: "48%",
                                    height: "51px",
                                    borderColor: selectedSlots.includes(index)
                                        ? "#020873"
                                        : `${alpha("#000000", 0.2)}`,
                                    backgroundColor: selectedSlots.includes(
                                        index
                                    )
                                        ? "rgb(2, 8, 115,0.2)"
                                        : "white",
                                }}
                                onClick={() => toggleSlotSelection(index)}>
                                {slot.startTime} - {slot.endTime}
                            </div>
                        ))}
                    </div>

                    {isManually == true ? (
                        <div className="flex flex-col mt-5 border-black-50 border p-3">
                            <div className="flex justify-between">
                                <p className="text-sm">
                                    {t("Availableguests")}
                                </p>
                                <u
                                    onClick={handleResetGustNumber}
                                    style={{
                                        color: "#020873",
                                        fontSize: "14px",
                                        cursor: "pointer",
                                    }}>
                                    {t("translation:reset")}
                                </u>
                            </div>
                            {selectedSlots
                                .sort((a, b) => a - b)
                                .map((element) => (
                                    <div key={element}>
                                        <div className="flex justify-between">
                                            <div className="p-3">
                                                {timeSlots[element].startTime} -{" "}
                                                {timeSlots[element].endTime}
                                            </div>
                                            <div className="flex justify-between gap-3 items-center p-3">
                                                <button
                                                    onClick={() =>
                                                        handleDecreaseCapacityManual(
                                                            timeSlots[element]
                                                                .startTime,
                                                            timeSlots[element]
                                                                .endTime
                                                        )
                                                    }
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                    className="border flex justify-center items-center w-8 h-8 rounded-md">
                                                    <KeyboardArrowDownIcon />
                                                </button>
                                                {manualCapacity.find(
                                                    (item) =>
                                                        item.startTime ==
                                                            timeSlots[element]
                                                                .startTime &&
                                                        item.endTime ==
                                                            timeSlots[element]
                                                                .endTime
                                                )?.capacity ?? guestNumber}
                                                <button
                                                    onClick={() =>
                                                        handleIncreaseCapacityManual(
                                                            timeSlots[element]
                                                                .startTime,
                                                            timeSlots[element]
                                                                .endTime,
                                                            guestNumber
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
                    ) : (
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
                                    onClick={() => setIsManually(true)}
                                    disabled={
                                        timeSlots.length == 0 ||
                                        timeSlots[0].startTime == "" ||
                                        selectedSlots.length == 0
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
                                    disabled={guestNumber == 1}
                                    onClick={decreaseGuest}
                                    className="border flex justify-center items-center w-8 h-8 rounded-md">
                                    <KeyboardArrowDownIcon />
                                </button>
                                {guestNumber}
                                <button
                                    onClick={increaseGuest}
                                    className="border flex justify-center items-center w-8 h-8 rounded-md">
                                    <KeyboardArrowUpIcon />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="w-full flex justify-center fixed bottom-0 inset-x-0">
                        <button
                            disabled={
                                daysOpen.length == 0 ||
                                !openTime ||
                                !closeTime ||
                                !duration ||
                                !guestNumber ||
                                !availableFromDate
                            }
                            onClick={handleSubmit}
                            type="submit"
                            className="text-white mt-4 rounded-lg font-semibold mb-6"
                            style={{
                                width: "343px",
                                height: "51px",
                                cursor: "pointer",
                                backgroundColor: "#020873",
                                fontSize: "14px",
                            }}>
                            {t("button:next")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}