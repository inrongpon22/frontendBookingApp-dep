import { useEffect, useState } from "react";
import { dataOfWeekThai } from "../../helper/daysOfWeek";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { alpha } from "@mui/material";
import { Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
    IServiceEditTime,
    IBookingSlot,
} from "../../interfaces/services/Iservice";
import { useParams } from "react-router";
import useSWR from "swr";
import { app_api, fetcher } from "../../helper/url";
import Loading from "../../components/dialog/Loading";
import { IBusinessesById } from "../../interfaces/business";
import Header from "./components/Header";
import SlotTimes from "./components/SlotTimes";
import GuestNumber from "./components/GuestNumber";
import GuestNumberManually from "./components/GuestNumberManually";
import SelectOpenDate from "./components/SelectOpenDate";

interface IParams {
    isAddServiceTime: boolean;
    serviceTime: IServiceEditTime[];
    isClose: boolean;
    handleAddTime: () => void;
    handleCloseCreateService?: () => void;
}

export default function AddServiceTime(props: IParams) {
    const { t } = useTranslation();
    const { businessId } = useParams();
    const { data: businessData, isLoading: businessLoading } = useSWR<IBusinessesById>(
        businessId && `${app_api}/business/${businessId}`,
        fetcher
    );
    const [daysOpen, setDaysOpen] = useState<string[]>([]);
    const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
    const [duration, setDuration] = useState(1);
    const [openTime, setOpenTime] = useState("");
    const [closeTime, setCloseTime] = useState("");
    const [guestNumber, setGuestNumber] = useState(1);
    const [isManually, setIsManually] = useState(false);
    const [manualCapacity, setManualCapacity] = useState<IBookingSlot[]>([]);
    const [availableFromDate, setAvailableFromDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [availableToDate, setAvailableToDate] = useState("");
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

    const toggleSlotSelection = (
        index: number,
        startTime: string,
        endTime: string
    ) => {
        setIsManually(false);
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
        setIsManually(false);
    };
    const decreaseDuration = () => {
        setDuration((prev) => prev - 0.5);
        setIsManually(false);
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

    generateTimeSlots(openTime, closeTime, duration);

    const handleSubmit = async () => {
        if (manualCapacity.length == 0) {
            selectedSlots.forEach((element) => {
                manualCapacity.push({
                    startTime: timeSlots[element].startTime,
                    endTime: timeSlots[element].endTime,
                    capacity: guestNumber,
                });
            });
        }
        const insertData = {
            daysOpen: daysOpen,
            availableFromDate: availableFromDate,
            availableToDate: availableToDate,
            slotsTime: manualCapacity,
            duration: duration,
        };
        props.serviceTime.push(insertData);
        if (props.handleAddTime) {
            props.handleAddTime();

        } else {
            localStorage.setItem(
                "serviceTime",
                JSON.stringify(props.serviceTime)
            );
            // if (props.handleCloseCard) {
            //     props.handleCloseCard();
            // }
        }
    };

    useEffect(() => {
        if (businessData) {
            setOpenTime(businessData.openTime.substring(0, 5));
            setCloseTime(businessData.closeTime.substring(0, 5));
        }
    }, [businessData]);

    useEffect(() => {
        if (props.serviceTime !== undefined && props.serviceTime.length > 0) {
            if (props.serviceTime[0].daysOpen !== undefined) {
                const uniqueDays = new Set(); // Create a Set to store unique days
                props.serviceTime.forEach((element) => {
                    if (
                        element.availableFromDate <= availableFromDate &&
                        (element.availableToDate ?? "") == availableToDate
                    ) {
                        element.daysOpen.forEach((day) => uniqueDays.add(day));
                    } else {
                        setDisibleDays([]);
                    }
                    if (
                        element.daysOpen.some((dayName) => uniqueDays.has(dayName))
                    ) {
                        setDisibleDays(Array.from(uniqueDays) as string[]);
                    }
                });
            } else {
                setDisibleDays([]);
            }
        } else {
            setDisibleDays([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [availableFromDate, availableToDate]);

    useEffect(() => {
        if (businessData) {
            setDaysOpen(businessData.daysOpen.filter((day, index) => day !== disibleDays[index]));
            setOpenTime(businessData.openTime.substring(0, 5));
            setCloseTime(businessData.closeTime.substring(0, 5));
            setCloseTime(businessData.closeTime.substring(0, 5));
            setOpenTime(businessData.openTime.substring(0, 5));
        }
    }, [businessData, disibleDays]);

    useEffect(() => {
        if (timeSlots.length > 0) {
            setManualCapacity([]);
            const newSelectedSlots: number[] = [];
            timeSlots.forEach((element, index) => {
                newSelectedSlots.push(index);
                setManualCapacity((prevCapacity) => [
                    ...prevCapacity,
                    { startTime: element.startTime, endTime: element.endTime, capacity: guestNumber },
                ]);
            });
            setSelectedSlots(newSelectedSlots);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openTime, closeTime, duration]);

    return (
        <>
            <div className="mb-[12vh]">
                <Loading openLoading={businessLoading} />
                <div className="pr-4 pl-4 pt-6">
                    <Header
                        isClose={props.isClose}
                        context={t("title:serviceTime")}
                        handleClose={() => {
                            if (props.isClose) {
                                props.handleAddTime();
                            } else {
                                if (props.handleCloseCreateService) {
                                    props.handleCloseCreateService();
                                }
                                props.handleAddTime();
                            }
                        }}
                    />
                </div>
                <Divider sx={{ marginTop: "16px", width: "100%" }} />
                <div className="flex flex-col pr-4 pl-4">
                    <div className="mt-4 flex flex-col">
                        <SelectOpenDate
                            availableFromDate={availableFromDate}
                            setAvailableFromDate={setAvailableFromDate}
                            availableToDate={availableToDate}
                            setAvailableToDate={setAvailableToDate}
                        />

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
                                            : `1px solid ${alpha(
                                                "#000000",
                                                0.2
                                            )}`,
                                        borderRadius: "8px",
                                        backgroundColor: disibleDays.some(
                                            (item) => item == day.value
                                        )
                                            ? "#dddddd"
                                            : isDaySelected(day.value)
                                                ? "rgba(2, 8, 115, 0.2)"
                                                : "white",
                                    }}>
                                    {day.name}
                                </button>
                            ))}
                        </div>

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
                                        onChange={(e) => {
                                            setOpenTime(e.target.value);
                                            setIsManually(false);
                                        }
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

                        <div
                            style={{
                                width: "100%",
                                height: "51px",
                                borderColor: `${alpha("#000000", 0.2)}`,
                            }}
                            className="rounded-lg flex border-black-50 border justify-between items-center p-4 mt-3">
                            <div style={{ fontSize: "14px" }}>
                                {t("duration")}
                            </div>
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
                                                color: duration == 0.5 ? "#cccccc" : "",
                                            }}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {timeSlots && timeSlots.length > 0 &&
                            <SlotTimes
                                timeSlots={timeSlots}
                                selectedSlots={selectedSlots}
                                toggleSlotSelection={toggleSlotSelection}
                            />
                        }

                        {isManually ? (
                            isManually && (
                                (timeSlots !== undefined && timeSlots.length > 0) &&
                                    (selectedSlots.length > 0) &&
                                    (manualCapacity.length > 0) ? (
                                    <GuestNumberManually
                                        timeSlots={timeSlots}
                                        handleResetGustNumber={handleResetGustNumber}
                                        manualCapacity={manualCapacity}
                                        selectedSlots={selectedSlots}
                                        handleIncreaseCapacityManual={handleIncreaseCapacityManual}
                                        handleDecreaseCapacityManual={handleDecreaseCapacityManual}
                                        guestNumber={guestNumber}
                                    />
                                ) : null
                            )
                        ) : (
                            { timeSlots } && timeSlots.length > 0 ? (
                                <GuestNumber
                                    handleIsManually={() => setIsManually(true)}
                                    timeSlots={timeSlots}
                                    selectedSlots={selectedSlots}
                                    guestNumber={guestNumber}
                                    increaseGuest={increaseGuest}
                                    decreaseGuest={decreaseGuest}
                                />
                            ) : null
                        )}

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
        </>
    );
}
