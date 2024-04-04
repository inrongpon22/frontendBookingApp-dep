import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
// mockup datas
import { exploreDatas } from "../explore/exploreDatas";
import {
  peopleQuantities,
  serviceOptions,
  getTimeIntervals,
} from "./shopDatas";
// icon
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
// calendar & plugin
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
// styled
import { Chip, IconButton } from "@mui/material";
// components
import CustomCarousel from "./CustomCarousel";

interface quantityTypes {
  id: number;
  title: string;
  desc?: string;
  additionalNotes?: string;
  quantities: number;
  max: number;
  min: number;
}

interface openTimeTypes {
  label: string;
  isAvailiable: boolean;
  isSelected: boolean;
}

interface serviceTypes {
  label: string;
  desc: string;
  availability: number;
  isAvailiable: boolean;
  isSelected: boolean;
}

const ShopDetailsPageWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // get shop details by id not have api yet
  let getShopDetailsById: any = exploreDatas?.find(
    (item: any) => item.id === Number(id)
  );

  const [renderedDayCells, setRenderedDayCells] = useState<any>([]);
  // mock up quantities
  const [quantities, setQuantities] =
    useState<quantityTypes[]>(peopleQuantities);
  // handle select date on calendar
  const [selectedDate, setSelectedDate] = useState<any>({
    date: moment(),
  });
  // mock up time & handle select time
  const [avaiTimes, setAvaiTimes] = useState<openTimeTypes[]>(
    getTimeIntervals(
      getShopDetailsById.openTime,
      getShopDetailsById.closeTime,
      60
    ).map((item: any, index: number) => {
      return { ...item, id: index + 1 };
    })
  );
  // handle services state
  const [services, setServices] = useState<serviceTypes[]>(serviceOptions);

  // handle quantity chage
  const quantityChanges = (id: number, type: string) => {
    switch (type) {
      case "increase":
        setQuantities(
          quantities.map((item: any) => {
            if (item.id === id && item.max > item.quantities) {
              // no more max val
              return { ...item, quantities: item.quantities + 1 };
            } else {
              return item;
            }
          })
        );
        break;

      case "decrease":
        setQuantities(
          quantities.map((item: any) => {
            if (item.id === id) {
              return {
                ...item,
                quantities:
                  item.quantities > item.min ? item.quantities - 1 : 0, // no less than min
              };
            } else {
              return item;
            }
          })
        );
        break;

      default:
        break;
    }
  };

  const dayCellsMap = new Map();

  const handleDayCellMount = (info: any) => {
    dayCellsMap.set(info.el, info);
    setRenderedDayCells(Array.from(dayCellsMap.values()));
  };

  const handleDayCellUnmount = (info: any) => {
    dayCellsMap.delete(info.el);
    setRenderedDayCells(Array.from(dayCellsMap.values()));
  };


  return (
    <div className="relative lg:grid lg:grid-cols-2">
      {/* Starts: back button */}
      <button
        type="button"
        className="absolute top-5 left-5 bg-white py-1 px-3 rounded-lg z-50"
        onClick={() => navigate("/")}
      >
        <KeyboardBackspaceIcon />
        Back
      </button>
      {/* Starts: back button */}

      <div id="detail-images">
        <img className="w-full" src="https://placehold.jp/375x343.png" />
      </div>

      <div id="shop-details" className="relative my-auto p-5">
        <h1 className="text-[25px] font-semibold">
          {getShopDetailsById?.title}
        </h1>
        <span className="text-[14px] font-normal">
          {getShopDetailsById?.detail || "No detail for this shop"}
        </span>
        <div className="mt-2">
          <Chip
            className="mt-1"
            icon={<AccessTimeIcon fontSize="small" />}
            label={`${getShopDetailsById?.openTime} - ${getShopDetailsById?.closeTime}`}
          />
          <Chip
            className="mt-1"
            icon={<LocationOnIcon fontSize="small" />}
            label={getShopDetailsById?.location}
          />
          <Chip
            className="mt-1"
            icon={<LocalPhoneIcon fontSize="small" />}
            label={getShopDetailsById?.contact}
          />
          <Chip
            className="mt-1 ms-1"
            // icon={<LocalPhoneIcon fontSize="small" />}
            label="Hair Cut"
          />
        </div>
      </div>

      <div id="calendar" className="relative mt-5 p-5 col-span-2">
        <FullCalendar
          initialView="customGrid"
          views={{
            customGrid: {
              type: "dayGrid",
              duration: {
                days: 7,
              },
            },
          }}
          validRange={function () {
            return {
              start: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
            };
          }}
          headerToolbar={{
            start: "prev",
            center: "title",
            end: "next",
          }}
          dayHeaders={false}
          plugins={[interactionPlugin, dayGridPlugin]}
          height={0}
          dayCellDidMount={handleDayCellMount}
          dayCellWillUnmount={handleDayCellUnmount}
        />
        <div className="mt-14">
          <CustomCarousel>
            {renderedDayCells.map((item: any, index: number) => {
              return (
                <div
                  key={index}
                  className={`flex flex-col justify-center items-center my-1 me-5 w-[100px] h-[100px] border rounded-lg
                  ${
                    moment(selectedDate?.date).isSame(moment(item?.date), "day")
                      ? "border-black bg-[#8B8B8B33]"
                      : ""
                  }`}
                  onClick={() => setSelectedDate(item)}
                >
                  <p>{moment(item.date).format("dd")}</p>
                  <p>{moment(item.date).format("D")}</p>
                </div>
              );
            })}
          </CustomCarousel>
        </div>
      </div>

      <div id="quantity" className="p-5">
        <h2 className="text-[20px] font-semibold">How many people?</h2>
        <div className="px-5 my-2 border border-black rounded-lg">
          {quantities?.map((item: any, index: number) => {
            return (
              <div
                key={index}
                className={`flex justify-between py-3 ${
                  quantities.length !== index + 1 ? "border-b-2" : ""
                }`}
              >
                <div className="flex flex-col">
                  <p className="text-[17px]">{item.title}</p>
                  <p className="font-thin text-[14px]">{item.desc}</p>
                  {item.additionalNotes && (
                    <a href="#" className="underline font-thin">
                      {item.additionalNotes}
                    </a>
                  )}
                </div>
                <div className="flex items-center">
                  <IconButton
                    disabled={item.quantities === item.min}
                    aria-label="delete"
                    className={`h-[24px] w-[24px] ${
                      item.quantities === item.min
                        ? "not-allow-custom-btn"
                        : "allow-custom-btn"
                    }`}
                    size="small"
                    onClick={() => quantityChanges(item.id, "decrease")}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <span className="px-5">{item.quantities}</span>
                  <IconButton
                    disabled={item.quantities === item.max}
                    aria-label="delete"
                    className={`h-[24px] w-[24px] ${
                      item.quantities === item.max
                        ? "not-allow-custom-btn"
                        : "allow-custom-btn"
                    }`}
                    size="small"
                    onClick={() => quantityChanges(item.id, "increase")}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div id="service-option" className="p-5">
        <h2 className="text-[20px] font-semibold">Service Option</h2>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {services?.map((item: any, index: number) => {
            return (
              <div
                key={index}
                className={`border rounded-lg p-5 cursor-pointer ${
                  item.isSelected ? "border-1 border-black bg-[#F1F1F1]" : ""
                }`}
                onClick={() =>
                  setServices(
                    services.map((ii: any) => {
                      if (ii.id === item.id) {
                        return { ...ii, isSelected: true };
                      } else {
                        return { ...ii, isSelected: false };
                      }
                    })
                  )
                }
              >
                <p className="text-[12px]">{item.availability} Available</p>
                <div className="mt-4">
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-[14px] font-thin">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div id="times" className="mt-5 p-5 col-span-2">
        <h2 className="text-[17px] font-semibold">
          {moment(selectedDate.date).format("ll")}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {avaiTimes?.map((item: any, index: number) => {
            return (
              <div
                key={index}
                className={`border rounded-lg text-center p-3 ${
                  item.isAvailiable
                    ? "border-[#000000] cursor-pointer"
                    : "text-[#8C8C8C]"
                } ${item.isSelected ? "bg-[#000000] text-white" : ""}`}
                onClick={() =>
                  setAvaiTimes(
                    avaiTimes.map((ii: any) => {
                      if (ii.isAvailiable && ii.id === item.id) {
                        return { ...ii, isSelected: true };
                      } else {
                        return { ...ii, isSelected: false };
                      }
                    })
                  )
                }
              >
                {item.label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ShopDetailsPageWrapper;
