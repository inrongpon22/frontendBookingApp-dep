import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// styled
// mockup datas
import { exploreDatas } from "../explore/exploreDatas";
// icon
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
// mock datas
import { peopleQuantities, getTimeIntervals } from "./shopDatas";
// calendar
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";

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

const ShopDetailsPageWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quantities, setQuantities] =
    useState<quantityTypes[]>(peopleQuantities);
  const [selectedDate, setSelectedDate] = useState<any>();
  const [avaiTimes, setAvaiTimes] = useState<openTimeTypes[]>(
    getTimeIntervals("09:00", "14:00").map((item: any, index: number) => {
      return { ...item, id: index + 1 };
    })
  );

  let getShopDetailsById = exploreDatas?.find(
    (item: any) => item.id === Number(id)
  );

  const quantityChanges = (id: number, type: string) => {
    switch (type) {
      case "increase":
        setQuantities(
          quantities.map((item: any) => {
            if (item.id === id && item.max > item.quantities) {
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
                  item.quantities > item.min ? item.quantities - 1 : 0,
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
        <div className="">
          <div className="flex mt-3">
            <AccessTimeIcon fontSize="small" />
            <span className="ms-2 text-[14px] font-normal">
              {`${getShopDetailsById?.openTime} - ${getShopDetailsById?.closeTime}`}
              , Everyday
            </span>
          </div>
          <div className="flex mt-3">
            <LocationOnIcon fontSize="small" />
            <span className="ms-2 text-[14px] font-normal">
              {getShopDetailsById?.location}
            </span>
          </div>
          <div className="flex mt-3">
            <LocalPhoneIcon fontSize="small" />
            <span className="ms-2 text-[14px] font-normal">
              {getShopDetailsById?.contact}
            </span>
          </div>
        </div>
        <div className="mt-5">
          <h2 className="text-[17px] font-semibold">Detail</h2>
          <span className="text-[14px] font-normal">
            {getShopDetailsById?.detail || "No detail for this shop"}
          </span>
        </div>
      </div>

      <div id="quantity" className="p-5">
        <h2 className="text-[20px] font-semibold">Who's coming?</h2>
        <div className="p-2">
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
                  <button
                    type="button"
                    className={`px-4 py-2 border rounded-full ${
                      item.quantities === item.min
                        ? "text-gray-300"
                        : "hover:bg-black hover:text-white border-black"
                    }`}
                    onClick={() => quantityChanges(item.id, "decrease")}
                  >
                    -
                  </button>
                  <span className="px-5">{item.quantities}</span>
                  <button
                    type="button"
                    className={`px-4 py-2 border rounded-full ${
                      item.quantities === item.max
                        ? "text-gray-300"
                        : "hover:bg-black hover:text-white border-black"
                    }`}
                    onClick={() => quantityChanges(item.id, "increase")}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div id="calendar" className="mt-5 p-5 col-span-2">
        <FullCalendar
          headerToolbar={{ end: "prev next" }}
          plugins={[interactionPlugin, dayGridPlugin]}
          initialView="dayGridMonth"
          height={550}
          selectable={true}
          validRange={function (nowDate) {
            return {
              start: nowDate,
            };
          }}
          select={(e) => setSelectedDate(e)}
        />
      </div>

      <div id="times" className="mt-5 p-5 col-span-2">
        <h2 className="text-[17px] font-semibold">
          {selectedDate
            ? moment(selectedDate?.start).format("ll")
            : moment().format("ll")}
        </h2>
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
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
