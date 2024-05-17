import { useTranslation } from "react-i18next";
import moment from "moment";
// components
import { Slideshow } from "../../components/shop-details/Slideshow";
import { Chip } from "@mui/material";
// icons
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { IconButton } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { app_api, fetcher } from "../../helper/url";

interface BusinessPreviewProps {
    businessId: number;
    title: string;
    description: string;
    price: number;
    isAutoApprove: boolean;
    currency: string;
    bookingSlots: {
        daysOpen: string[];
        availableFromDate: string;
        availableToDate: string;
        slotsTime: {
            startTime: string;
            endTime: string;
            capacity: number;
        }[];
    }[];
    availableFromDate: string;
    availableToDate: string;
    isHidePrice: boolean;
    isHideEndTime: boolean;
    handleClose: () => void;
}

const BusinessPreview = (props: BusinessPreviewProps) => {
    const { t } = useTranslation();

    const [calendar] = useState({
        // handle calendar date
        start: moment(),
        end: moment().add(10, "day"),
    });

    const [dateArr, setDateArr] = useState<object[]>([]); // get calendar date for custom render

    const slotArrays = props?.bookingSlots.find(
        (item: any) =>
            item.daysOpen?.includes(moment().format("dddd")) &&
            moment().isAfter(item.availableFromDate)
    );

    const { data } = useSWR(
        `${app_api}/business/${props.businessId}`,
        fetcher,
        {
            revalidateOnFocus: false,
        }
    );

    useEffect(() => {
        let newArr = [];
        for (let i = 0; i < calendar.end.diff(calendar.start, "day"); i++) {
            const element = calendar.start.clone().add(i, "day");
            newArr.push(element);
        }
        setDateArr(newArr);
    }, []);

    return (
        <div className="relative lg:grid lg:grid-cols-2">
            {/* header */}
            <div className="flex justify-between items-center text-white h-[60px] bg-deep-blue px-5">
                <span className="text-[14px]">ดูตัวอย่างในฐานะแขก</span>
                <button
                    type="button"
                    className="text-[14px] text-deep-blue bg-white rounded py-1 px-2"
                    onClick={props.handleClose}>
                    ออกจากการแสดงตัวอย่าง
                </button>
            </div>
            {/* header */}

            <Slideshow data={data?.imagesURL} />
            {/* shop detail */}
            <div className="relative my-auto p-5">
                <h1 className="text-[25px] font-semibold">{data?.title}</h1>
                <span className="text-[14px] font-normal">
                    {data?.description}
                </span>
                <div className="mt-2">
                    <Chip
                        className="mt-1 custom-chip-label"
                        icon={<LocationOnIcon fontSize="small" />}
                        label={data?.address}
                        color="info"
                    />
                    <Chip
                        className="mt-1 custom-chip-label"
                        icon={<LocalPhoneIcon fontSize="small" />}
                        label={data?.phoneNumber}
                        color="info"
                    />
                </div>
            </div>
            {/* shop detail */}

            {/* shop service */}
            <div className="p-5">
                <h2 className="text-[20px] font-semibold">
                    {t("serviceOptions")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {/* {services?.map((item: any, index: number) => {
            return ( */}
                    <div
                        // key={index}
                        className={`border-2 rounded-lg p-5 border-[#003B95] bg-[#006CE31A] text-[#003B95]`}
                        // ${
                        //   item.isSelected
                        //     ? "border-[#003B95] bg-[#006CE31A] text-[#003B95]"
                        //     : ""
                        // }
                    >
                        <div className="">
                            <p className="flex justify-between">
                                <span className="font-bold text-[14px]">
                                    {props.title}
                                </span>
                                <span>
                                    <span className="font-bold text-[14px]">
                                        {props.price}
                                    </span>
                                    <span className="font-normal">
                                        {" "}
                                        / person
                                    </span>
                                </span>
                            </p>
                            <div className="">
                                <p className="font-normal text-[14px]">
                                    {props.description}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* );
          })} */}
                </div>
            </div>
            {/* shop service */}

            {/* quantities */}
            <div
                id="quantity"
                className="flex justify-between items-center px-5">
                <h2 className="text-[17px] font-semibold">
                    {t("numberOfGuests")}
                </h2>
                <div className="w-[140px] flex justify-around items-center p-2 border border-black rounded-lg">
                    <IconButton aria-label="delete" size="small">
                        <RemoveIcon fontSize="small" />
                    </IconButton>
                    <span className="px-5 text-[#003B95] text-[20px] font-semibold">
                        1
                    </span>
                    <IconButton aria-label="delete" size="small">
                        <AddIcon fontSize="small" />
                    </IconButton>
                </div>
            </div>
            {/* quantities */}

            {/* calendar */}
            <div id="calendar" className="relative mt-5 p-5 col-span-2">
                {/* starts:: button */}
                <div className="flex justify-between">
                    <button type="button">
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
                    )?.format("MMMM D")} - ${moment(
                        dateArr[dateArr.length - 1]
                    )?.format("MMMM D")}`}</div>
                    <button type="button">
                        <ArrowForwardIosIcon />
                    </button>
                </div>
                {/* ends:: button */}

                <div className="mt-5 grid grid-cols-5 gap-2">
                    {dateArr.map((item: any, index: number) => {
                        // const isOpen: boolean = services
                        //   ?.find((item: any) => item.isSelected)
                        //   ?.daysOpen.includes(item.format("dddd"));
                        return (
                            <div
                                key={index}
                                className={`h-[72px] flex flex-col justify-center items-center border rounded-lg cursor-pointer
                  ${
                      moment().isSame(item, "day")
                          ? "border-2 border-[#003B95] bg-[#006CE31A] text-[#003B95]"
                          : ""
                  }`}
                                // ${
                                //   isOpen ? "" : "text-[#8B8B8B] bg-[#8B8B8B] bg-opacity-20"
                                // }
                            >
                                <p className="text-[14px] font-thin">
                                    {item.format("dd")}
                                </p>
                                <p className="text-[25px] font-semibold">
                                    {item.format("D")}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* calendar */}

            {/* time slots */}
            <div id="times" className="mt-5 p-5 col-span-2">
                <h2 className="text-[17px] font-semibold">
                    {moment().format("ll")}
                    <p>{t("time")}</p>
                </h2>
                <div
                    className={`grid gap-4 mt-2 ${
                        slotArrays
                            ? slotArrays?.slotsTime.length === 1
                                ? "grid-cols-1"
                                : "grid-cols-2"
                            : ""
                    }`}>
                    {slotArrays && slotArrays.slotsTime.length > 0 ? (
                        slotArrays?.slotsTime.map((ii: any, jj: number) => {
                            return (
                                <div
                                    key={jj}
                                    className={`flex flex-col border-2 rounded-lg text-center p-3 ${
                                        ii?.capacity >= 1
                                            ? " cursor-pointer"
                                            : "text-[#8C8C8C] bg-[#8B8B8B33]"
                                    } ${
                                        ii.isSelected
                                            ? "bg-[#006CE31A] border-[#003B95] text-[#003B95]"
                                            : ""
                                    }`}>
                                    <span>
                                        {ii.startTime} - {ii.endTime}
                                    </span>
                                    <span className="flex justify-center items-center text-[12px]">
                                        <div
                                            className={`h-[9px] w-[9px] mx-1 rounded ${
                                                ii?.capacity < 5
                                                    ? ii?.capacity === 0
                                                        ? "bg-[#9C9C9C]"
                                                        : "bg-[#FEC84B]"
                                                    : "bg-[#12B76A]"
                                            }`}></div>
                                        {ii?.capacity !== 0
                                            ? `${ii?.capacity} ${t(
                                                  "available"
                                              )}`
                                            : t("full")}
                                    </span>
                                </div>
                            );
                        })
                    ) : (
                        <span>{t("error:noTimeSlots")}...</span>
                    )}
                </div>
            </div>
            {/* time slots */}
        </div>
    );
};

export default BusinessPreview;
