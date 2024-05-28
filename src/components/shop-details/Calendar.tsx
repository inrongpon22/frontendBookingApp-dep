import { useEffect } from "react";
// import { useTranslation } from "react-i18next";
import moment from "moment";
// icons
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { monthsOfYearFullName } from "../../helper/monthsOfYear";
import { useTranslation } from "react-i18next";
import { dayOfWeek } from "../../helper/daysOfWeek";
import toast from "react-hot-toast";

interface CalendarProps {
    calendar: any;
    setCalendar: Function;
    dateArr: any;
    setDateArr: Function;
    selectedDate: any;
    setSelectedDate: Function;
    serviceById: any;
}

const Calendar = ({
    calendar,
    setCalendar,
    dateArr,
    setDateArr,
    selectedDate,
    setSelectedDate,
    serviceById,
}: CalendarProps) => {
    const {
        i18n: { language },
    } = useTranslation();

    const handleDateChange = (meth: string) => {
        switch (meth) {
            case "prev":
                setCalendar({
                    start: calendar.start.subtract(10, "day"),
                    end: calendar.end.subtract(10, "day"),
                });
                break;

            case "next":
                setCalendar({
                    start: calendar.start.add(10, "day"),
                    end: calendar.end.add(10, "day"),
                });
                break;

            default:
                break;
        }
    };

    // loop date with start and end date
    useEffect(() => {
        let newArr = [];
        for (let i = 0; i < calendar.end.diff(calendar.start, "day"); i++) {
            const element = calendar.start.clone().add(i, "day");
            newArr.push(element);
        }
        setDateArr(newArr);
    }, [calendar]);

    return (
        <div id="calendar" className="relative mt-5 col-span-2">
            {/* starts:: button */}
            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={() => {
                        if (
                            !calendar.start
                                .startOf("day")
                                .isSame(moment().startOf("day"))
                        ) {
                            handleDateChange("prev");
                        }
                    }}
                >
                    <ArrowBackIosIcon
                        color={
                            calendar.start
                                .startOf("day")
                                .isSame(moment().startOf("day"))
                                ? "disabled"
                                : "inherit"
                        }
                    />
                </button>

                <div className="font-semibold text-[17px]">{`${moment(
                    dateArr[0]
                )?.format("D")} ${
                    monthsOfYearFullName(language)?.find(
                        (ii) => ii.value === moment(dateArr[0])?.format("MMMM")
                    )?.name ?? ""
                } - ${moment(dateArr[dateArr.length - 1])?.format("D")} ${
                    monthsOfYearFullName(language)?.find(
                        (ii) =>
                            ii.value ===
                            moment(dateArr[dateArr.length - 1])?.format("MMMM")
                    )?.name ?? ""
                }`}</div>
                <button type="button" onClick={() => handleDateChange("next")}>
                    <ArrowForwardIosIcon />
                </button>
            </div>
            {/* ends:: button */}

            <div className="mt-5 grid grid-cols-5 gap-2">
                {dateArr.map((item: any, index: number) => {
                    const isOpen: boolean =
                        serviceById?.bookingSlots[0]?.daysOpen.includes(
                            item.format("dddd")
                        );
                    return (
                        <div
                            key={index}
                            className={`h-[72px] flex flex-col justify-center items-center border rounded-lg cursor-pointer
                  ${
                      moment(selectedDate?.date).isSame(item, "day")
                          ? "border-2 border-[#003B95] bg-[#006CE31A] text-[#003B95]"
                          : ""
                  } ${
                                isOpen
                                    ? ""
                                    : "text-[#8B8B8B] bg-[#8B8B8B] bg-opacity-20"
                            }`}
                            onClick={() => {
                                if (isOpen) {
                                    setSelectedDate({ date: item });
                                } else {
                                    toast.error(
                                        `วันที่ ${item.format("D")} ${
                                            monthsOfYearFullName(
                                                language
                                            )?.find(
                                                (ii) =>
                                                    ii.value ===
                                                    item.format("MMMM")
                                            )?.name ?? ""
                                        } ร้านไม่เปิดให้บริการ`,
                                        {
                                            icon: "⚠️",
                                        }
                                    );
                                }
                            }}
                        >
                            <p className="text-[14px] font-thin">
                                {dayOfWeek(language)?.find(
                                    (ii) => ii.value === item.format("dddd")
                                )?.name ?? ""}
                            </p>
                            <p className="text-[25px] font-semibold">
                                {item.format("D")}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;
