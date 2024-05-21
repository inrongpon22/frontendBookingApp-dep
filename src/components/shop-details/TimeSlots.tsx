// import { useContext } from "react";
// import { ShopContext } from "../../pages/shop-detials/ShopDetailsPageWrapper";
import moment from "moment";
import { useEffect, useState } from "react";
// import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

interface TimeSlotsProps {
    selectedDate: any;
    setServiceById: Function;
    serviceById: any;
    quantities: any;
    selectedIndices: any;
    setSelectedIndices: Function;
}

const TimeSlots = ({
    selectedDate,
    setServiceById,
    serviceById,
    quantities,
    selectedIndices,
    setSelectedIndices,
}: TimeSlotsProps) => {
    const { t } = useTranslation();

    const [minIndex, setMinIndex] = useState<number | null>(null);
    const [maxIndex, setMaxIndex] = useState<number | null>(null);

    // find available time slots from daysOpen and availableFromDate
    const slotArrays = serviceById?.bookingSlots.find(
        (item: any) =>
            item.daysOpen?.includes(selectedDate.date.format("dddd")) &&
            selectedDate.date.isAfter(item.availableFromDate)
    );

    const handleSelectTime = (item: any, index: number) => {
        setSelectedIndices((prevSelectedIndices: any) => {
            const newSelectedIndices = new Set(prevSelectedIndices);

            if (newSelectedIndices.has(index)) {
                newSelectedIndices.delete(index);
            } else {
                newSelectedIndices.add(index);
            }
            return newSelectedIndices;
        });
        setServiceById({
            ...serviceById,
            bookingSlots: serviceById?.bookingSlots.map((kk: any) => {
                if (kk.daysOpen.includes(selectedDate.date.format("dddd"))) {
                    return {
                        ...kk,
                        slotsTime: kk.slotsTime?.map((mm: any) => {
                            if (mm.startTime === item.startTime) {
                                return { ...mm, isSelected: !mm.isSelected };
                            } else {
                                return { ...mm, isSelected: mm.isSelected };
                            }
                        }),
                    };
                } else {
                    return kk;
                }
            }),
        });
    };

    useEffect(() => {
        if (selectedIndices.size > 0) {
            setMinIndex(Math.min(...(Array.from(selectedIndices) as number[])));
            setMaxIndex(Math.max(...(Array.from(selectedIndices) as number[])));
        } else {
            setMinIndex(null);
            setMaxIndex(null);
        }
    }, [selectedIndices]);

    return (
        <div id="times" className="mt-5 col-span-2">
            <p className="flex justify-between items-center">
                <span className="text-[17px] font-semibold">
                    {moment(selectedDate.date).format("ll")}
                </span>
                <span
                    className="text-[12px] underline cursor-pointer"
                    onClick={() => {
                        setServiceById({
                            ...serviceById,
                            bookingSlots: serviceById?.bookingSlots.map(
                                (kk: any) => {
                                    if (
                                        kk.daysOpen.includes(
                                            selectedDate.date.format("dddd")
                                        )
                                    ) {
                                        return {
                                            ...kk,
                                            slotsTime: kk.slotsTime?.map(
                                                (mm: any) => {
                                                    return {
                                                        ...mm,
                                                        isSelected: false,
                                                    };
                                                }
                                            ),
                                        };
                                    } else {
                                        return kk;
                                    }
                                }
                            ),
                        });
						setSelectedIndices(new Set());
                    }}
                >
                    ล้างข้อมูล
                </span>
            </p>
            <div
                className={`grid gap-4 mt-2 ${
                    slotArrays
                        ? slotArrays?.slotsTime.length === 1
                            ? "grid-cols-1"
                            : "grid-cols-2"
                        : ""
                }`}
            >
                {slotArrays?.slotsTime.length > 0 ? (
                    slotArrays?.slotsTime.map((ii: any, jj: number) => {
                        // check if the time slot is available, not full
                        const isAvailiable =
                            ii?.capacity >= quantities.quantities;
                        // get selected index
                        const isSelected = selectedIndices.has(jj);
                        const isPrevious = selectedIndices.has(jj + 1);
                        const isNext = selectedIndices.has(jj - 1);

                        let className = "";
                        if (isSelected) {
                            className =
                                "bg-[#006CE31A] border-[#003B95] text-[#003B95]";
                        } else if (isPrevious && isAvailiable) {
                            className = "border-dashed border-green-500";
                        } else if (isNext && isAvailiable) {
                            className = "border-dashed border-green-500";
                        } else if (!isAvailiable) {
                            className = "text-[#8C8C8C] bg-[#8B8B8B33]";
                        } else if (
                            !isSelected &&
                            !isNext &&
                            !isPrevious &&
                            selectedIndices.size > 0
                        ) {
                            className = "";
                        }

                        return (
                            <div
                                key={jj}
                                className={`${className} flex flex-col border-2 rounded-lg text-center p-3 cursor-pointer`}
                                onClick={() => {
                                    const selectFirst =
                                        selectedIndices.size === 0 &&
                                        isAvailiable; // if no selected time slot, select the first one
                                    const extendedSelect =
                                        selectedIndices.size > 0 &&
                                        (isNext || isPrevious) &&
                                        isAvailiable &&
                                        !isSelected; // if there is a selected time slot, select the next or previous one
                                    const allowedUnselected =
                                        (isSelected && jj === minIndex) ||
                                        (isSelected && jj === maxIndex);
                                    if (
                                        selectFirst ||
                                        extendedSelect ||
                                        allowedUnselected
                                    ) {
                                        handleSelectTime(ii, jj);
                                    }
                                }}
                            >
                                <span>
                                    {ii.startTime} - {ii.endTime}
                                </span>
                                {/* dot color:: status */}
                                <span className="flex justify-center items-center text-[12px]">
                                    <div
                                        className={`h-[9px] w-[9px] mx-1 rounded ${
                                            ii?.capacity < 5
                                                ? ii?.capacity === 0
                                                    ? "bg-[#9C9C9C]"
                                                    : "bg-[#FEC84B]"
                                                : "bg-[#12B76A]"
                                        }`}
                                    ></div>
                                    {ii?.capacity !== 0
                                        ? `${ii?.capacity} ${t("available")}`
                                        : t("full")}
                                </span>
                                {/* dot color:: status */}
                            </div>
                        );
                    })
                ) : (
                    <span>{t("error:noTimeSlots")}...</span>
                )}
            </div>
        </div>
    );
};

export default TimeSlots;
