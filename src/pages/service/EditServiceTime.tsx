import { useEffect, useState } from "react";
import { dataOfWeekEng, dataOfWeekThai } from "../../helper/daysOfWeek";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { alpha } from "@mui/material";
import { Divider } from "@mui/material";
import { useTranslation } from "react-i18next";

import {
    IServiceEditTime,
    IBookingSlot,
} from "../../interfaces/services/Iservice";
import SlotTimes from "./components/SlotTimes";
import GuestNumberManually from "./components/GuestNumberManually";
import GuestNumber from "./components/GuestNumber";
import Header from "./components/Header";
import LimitBooking from "./components/LimitBooking";

interface IParams {
    serviceTime: IServiceEditTime[];
    openTime: string;
    closeTime: string;
    editIndex: number;
    isAddTime: boolean;
    isClose: boolean;
    handleSetEditTime: () => void;
    handleSetServiceTime?: (serviceTime: IServiceEditTime[]) => void;
    handleCloseCreateService?: () => void;
}

export default function EditServiceTime(props: IParams) {
    const { t } = useTranslation();
    const [isLimitBooking, setIsLimitBooking] = useState(
        props.isAddTime
            ? false
            : props.serviceTime[props.editIndex].isLimitBooking
    );
    const [maximumAllow, setMaximumAllow] = useState(
        props.isAddTime ? 1 : props.serviceTime[props.editIndex].maximumAllow
    );

    const [daysOpen, setDaysOpen] = useState<string[]>(
        props.isAddTime ? [] : props.serviceTime[props.editIndex].daysOpen
    );
    const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
    const [duration, setDuration] = useState(
        props.isAddTime ? 1 : props.serviceTime[props.editIndex].duration
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
            : props.serviceTime[props.editIndex].availableToDate ?? ""
    );
    const [disibleDays, setDisibleDays] = useState<string[]>([]);
    const [isTwentyFourHour, setIsTwentyFourHour] = useState(
        props.openTime == "00:00" && props.closeTime == "00:00" ? true : false
    );

    const generate24HourTimeSlots = (duration: number) => {
        const timeSlots = [];
        const durationMinutes = duration * 60; // Convert hours to minutes
        let currentTimeMinutes = 0; // Start at 00:00

        // Helper function to convert total minutes to time string
        const minutesToTime = (minutes: number) => {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return `${hours.toString().padStart(2, "0")}:${mins
                .toString()
                .padStart(2, "0")}`;
        };

        // Generate time slots for 24 hours
        while (currentTimeMinutes < 1440) {
            // 1440 minutes in a day
            const nextTimeMinutes = currentTimeMinutes + durationMinutes;
            if (nextTimeMinutes > 1440) break; // Stop if next slot exceeds 24:00

            const startTime = minutesToTime(currentTimeMinutes);
            const endTime =
                nextTimeMinutes === 1440
                    ? "00:00"
                    : minutesToTime(nextTimeMinutes);

            timeSlots.push({
                startTime,
                endTime,
            });

            currentTimeMinutes = nextTimeMinutes;
        }

        return timeSlots;
    };

    const generateTimeSlots = (
        startTime: string,
        endTime: string,
        duration: number
    ) => {
        const timeSlots = [];

        if (startTime > endTime) {
            // Helper function to convert time string to total minutes
            const timeToMinutes = (time: string) => {
                const [hours, minutes] = time.split(":").map(Number);
                return hours * 60 + minutes;
            };

            // Helper function to convert total minutes to time string
            const minutesToTime = (minutes: number) => {
                const hours = Math.floor(minutes / 60);
                const mins = minutes % 60;
                return `${hours.toString().padStart(2, "0")}:${mins
                    .toString()
                    .padStart(2, "0")}`;
            };

            let currentTimeMinutes = timeToMinutes(startTime);
            const endTimeMinutes = timeToMinutes(endTime);
            const durationMinutes = duration * 60;

            // Loop until the current time exceeds the end time on the next day
            while (currentTimeMinutes < 1440 + endTimeMinutes) {
                const nextTimeMinutes = currentTimeMinutes + durationMinutes;

                // Calculate endTime string
                const endTimeString = minutesToTime(nextTimeMinutes % 1440);

                // Break the loop if the next slot starts after the end time and it's past the next day
                if (currentTimeMinutes >= 1440 + endTimeMinutes) {
                    break;
                }

                // Add time slot
                timeSlots.push({
                    startTime: minutesToTime(currentTimeMinutes % 1440),
                    endTime: endTimeString,
                });

                // Update currentTimeMinutes
                currentTimeMinutes = nextTimeMinutes;
            }
        } else {
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
                timeSlots.push({
                    startTime: currentTime,
                    endTime: endTimeString,
                });
                currentTime = `${newHours
                    .toString()
                    .padStart(2, "0")}:${newMinutes
                    .toString()
                    .padStart(2, "0")}`;
            }
        }

        return timeSlots;
    };

    const timeSlots = isTwentyFourHour
        ? generate24HourTimeSlots(duration)
        : generateTimeSlots(openTime, closeTime, duration);

    const toggleSlotSelection = (
        index: number,
        startTime: string,
        endTime: string
    ) => {
        const sortedCapacity = [...manualCapacity].sort((a, b) => {
            if (a.startTime < b.startTime) return -1;
            if (a.startTime > b.startTime) return 1;
            return 0;
        });

        const indexManual = sortedCapacity.findIndex(
            (slot) => slot.startTime === startTime && slot.endTime === endTime
        );

        if (indexManual !== -1) {
            setManualCapacity((prevCapacity) =>
                prevCapacity.filter((_, index) => index !== indexManual)
            );
        } else {
            setManualCapacity((prevCapacity) => {
                const newCapacity = [
                    ...prevCapacity,
                    { startTime, endTime, capacity: guestNumber },
                ];
                return newCapacity.sort((a, b) => {
                    if (a.startTime < b.startTime) return -1;
                    if (a.startTime > b.startTime) return 1;
                    return 0;
                });
            });
        }

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

    const dayOrder = dataOfWeekEng.map((day) => day.value);
    const toggleDay = (dayValue: string) => {
        if (isDaySelected(dayValue)) {
            setDaysOpen((prevDays) =>
                prevDays
                    .filter((day) => day !== dayValue)
                    .sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b))
            );
        } else {
            setDaysOpen((prevDays) =>
                [...prevDays, dayValue].sort(
                    (a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b)
                )
            );
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
        setManualCapacity([]);
        setSelectedSlots([]);
    };
    const decreaseDuration = () => {
        setDuration((prev) => prev - 0.5);
        setManualCapacity([]);
        setSelectedSlots([]);
    };

    const handleResetGustNumber = () => {
        manualCapacity.forEach((element) => {
            element.capacity = 1;
        });
        setGuestNumber(1);
        setIsManually(false);
    };

    const handleCloseTime = (time: string) => {
        setCloseTime(time);
    };

    const handleIncreateMaximumAllow = () => {
        setMaximumAllow((prev) => prev + 1);
    };
    const handleDecreaseMaximumAllow = () => {
        setMaximumAllow((prev) => prev - 1);
    };

    const handleSubmit = async () => {
        const insertData = {
            daysOpen: daysOpen,
            availableFromDate: availableFromDate,
            availableToDate: availableToDate,
            slotsTime: manualCapacity,
            duration: duration,
            isLimitBooking: isLimitBooking,
            maximumAllow: maximumAllow,
        };
        props.serviceTime[props.editIndex] = insertData;
        if (props.handleSetServiceTime) {
            props.handleSetServiceTime(props.serviceTime);
        } else {
            localStorage.setItem(
                "serviceTime",
                JSON.stringify(props.serviceTime)
            );
        }
        props.handleSetEditTime();
    };

    useEffect(() => {
        const uniqueDays = new Set();
        if (props.serviceTime[0].daysOpen !== undefined) {
            props.serviceTime
                .filter((_item, index) => index !== props.editIndex)
                .forEach((element) => {
                    if (
                        element.availableFromDate == availableFromDate &&
                        element.availableToDate == availableToDate
                    ) {
                        element.daysOpen.forEach((day) => uniqueDays.add(day));
                        if (
                            !daysOpen.some((dayName) => uniqueDays.has(dayName))
                        ) {
                            setDisibleDays(Array.from(uniqueDays) as string[]);
                        }
                    } else {
                        setDisibleDays([]);
                    }
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [availableFromDate, availableToDate]);

    useEffect(() => {
        if (
            props.serviceTime[props.editIndex].slotsTime !== undefined &&
            props.serviceTime[props.editIndex].slotsTime.length > 0
        ) {
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

    useEffect(() => {
        if (timeSlots.length > 0) {
            setManualCapacity([]);
            const newSelectedSlots: number[] = [];
            timeSlots.forEach((element, index) => {
                newSelectedSlots.push(index);
                setManualCapacity((prevCapacity) => [
                    ...prevCapacity,
                    {
                        startTime: element.startTime,
                        endTime: element.endTime,
                        capacity: guestNumber,
                    },
                ]);
            });
            setSelectedSlots(newSelectedSlots);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openTime, closeTime, duration, isTwentyFourHour]);

    return (
        <div className="mb-10">
            <div className="pr-4 pl-4 pt-6">
                <Header
                    isClose={props.isClose}
                    context={t("title:serviceTime")}
                    handleClose={() => {
                        if (props.isClose) {
                            props.handleSetEditTime();
                        } else {
                            if (props.handleCloseCreateService) {
                                props.handleCloseCreateService();
                            }
                            if (props.handleSetServiceTime) {
                                props.handleSetServiceTime([]);
                            }
                            props.handleSetEditTime();
                        }
                    }}
                />
            </div>
            <Divider sx={{ marginTop: "16px", width: "100%" }} />
            <div className="flex flex-col pr-4 pl-4 mb-[10vh]">
                <div className="mt-4 flex flex-col">
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
                                min={new Date().toISOString().split("T")[0]}
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
                                    backgroundColor: disibleDays.some(
                                        (item) => item == day.value
                                    )
                                        ? "#dddddd" // Background color for disabled button
                                        : isDaySelected(day.value)
                                        ? "rgba(2, 8, 115, 0.2)"
                                        : "white",
                                }}>
                                {day.name}
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-between items-center">
                        <div
                            className="font-semibold mt-3"
                            style={{ fontSize: "14px" }}>
                            {t("availableTime")}
                        </div>
                        <div className="flex">
                            <div
                                className="mt-3"
                                style={{
                                    fontSize: "14px",
                                    marginRight: "10px",
                                }}>
                                24 {t("hr")}
                            </div>
                            <input
                                type="checkbox"
                                className="mt-3"
                                onChange={(e) => {
                                    setIsTwentyFourHour(e.target.checked);
                                }}
                                checked={isTwentyFourHour}
                            />
                        </div>
                    </div>

                    {!isTwentyFourHour && (
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
                                        onChange={(e) => {
                                            setOpenTime(e.target.value);
                                            setIsManually(false);
                                        }}
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
                                <div style={{ fontSize: "14px" }}>
                                    {t("to")}
                                </div>
                                <div className="flex">
                                    <input
                                        min={openTime}
                                        value={closeTime}
                                        onChange={(e) => {
                                            handleCloseTime(e.target.value);
                                            setIsManually(false);
                                        }}
                                        type="time"
                                        style={{ border: "none" }}
                                        className="focus:outline-none"
                                        name="closeTime"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}

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
                                            color:
                                                duration == 0.5
                                                    ? "#cccccc"
                                                    : "",
                                        }}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {timeSlots && timeSlots.length > 0 && (
                        <SlotTimes
                            timeSlots={timeSlots}
                            selectedSlots={selectedSlots}
                            toggleSlotSelection={toggleSlotSelection}
                        />
                    )}

                    {isManually == true ? (
                        { timeSlots } && timeSlots.length > 0 ? (
                            <GuestNumberManually
                                timeSlots={timeSlots}
                                handleResetGustNumber={handleResetGustNumber}
                                manualCapacity={manualCapacity}
                                selectedSlots={selectedSlots}
                                handleIncreaseCapacityManual={
                                    handleIncreaseCapacityManual
                                }
                                handleDecreaseCapacityManual={
                                    handleDecreaseCapacityManual
                                }
                                guestNumber={guestNumber}
                            />
                        ) : null
                    ) : { timeSlots } && timeSlots.length > 0 ? (
                        <GuestNumber
                            handleIsManually={() => setIsManually(true)}
                            timeSlots={timeSlots}
                            selectedSlots={selectedSlots}
                            guestNumber={guestNumber}
                            increaseGuest={increaseGuest}
                            decreaseGuest={decreaseGuest}
                        />
                    ) : null}

                    <LimitBooking
                        maximumAllow={maximumAllow}
                        isLimitBooking={isLimitBooking}
                        handleIsLimitBooking={() =>
                            setIsLimitBooking(!isLimitBooking)
                        }
                        handleIncreateMaximumAllow={handleIncreateMaximumAllow}
                        handleDecreaseMaximumAllow={handleDecreaseMaximumAllow}
                    />

                    <div className="w-full flex justify-center bottom-0 inset-x-0 fixed mb-2">
                        <button
                            disabled={
                                daysOpen.length == 0 ||
                                !openTime ||
                                !closeTime ||
                                !duration ||
                                !guestNumber ||
                                !availableFromDate ||
                                selectedSlots.length == 0
                            }
                            onClick={handleSubmit}
                            type="submit"
                            className="text-white mt-4 rounded-lg font-semibold"
                            style={{
                                width: "343px",
                                height: "51px",
                                cursor:
                                    daysOpen.length == 0 ||
                                    !openTime ||
                                    !closeTime ||
                                    !duration ||
                                    !guestNumber ||
                                    !availableFromDate ||
                                    selectedSlots.length == 0
                                        ? "not-allowed"
                                        : "pointer",
                                backgroundColor:
                                    daysOpen.length == 0 ||
                                    !openTime ||
                                    !closeTime ||
                                    !duration ||
                                    !guestNumber ||
                                    !availableFromDate ||
                                    selectedSlots.length == 0
                                        ? "#cccccc"
                                        : "#020873",
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
