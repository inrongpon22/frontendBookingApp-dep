import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
// styled
// mockup datas
import { exploreDatas } from "../explore/exploreDatas";
// icon
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
// mock datas
import { times, weekdays } from "./shopDatas";

interface weekDaysTypes {
  label: string;
  date: number;
  isActive: boolean;
}

interface openTimeTypes {
  label: string;
  isAvailiable: boolean;
  isSelected: boolean;
}

const ShopDetailsPageWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<weekDaysTypes[]>(weekdays);
  const [avaiTimes, setAvaiTimes] = useState<openTimeTypes[]>(times);

  let getShopDetailsById = exploreDatas?.find(
    (item: any) => item.id === Number(id)
  );

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

      <div title="shop-image">
        <img className="w-full" src="https://placehold.jp/375x343.png" />
      </div>
      <div title="shop-details" className="relative my-auto p-5">
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
      <div title="schedule" className="mt-5 p-5 col-span-2">
        <h2 className="text-[17px] font-semibold">Schedule</h2>
        <div className="flex justify-between mt-2">
          <ArrowBackIosNewIcon
            fontSize="large"
            className="border border-[#D5D5D5] rounded-lg p-2"
          />
          {dayjs().format("MMM")}
          <ArrowForwardIosIcon
            fontSize="large"
            className="border border-[#D5D5D5] rounded-lg p-2"
          />
        </div>
        <div className="flex justify-around mt-2">
          {schedules?.map((item: any, index: number) => {
            return (
              <div
                key={index}
                className={`flex flex-col items-center p-2 cursor-pointer ${
                  item.isActive ? "bg-black text-white rounded-lg" : ""
                }`}
                onClick={() =>
                  setSchedules(
                    schedules.map((ii: any) => {
                      if (ii.date === item.date) {
                        return { ...ii, isActive: true };
                      } else {
                        return { ...ii, isActive: false };
                      }
                    })
                  )
                }
              >
                <p className="text-[15px] font-medium">{item.label}</p>
                <p className="text-[17px] font-medium">{item.date}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div title="time" className="mt-5 p-5 col-span-2">
        <h2 className="text-[17px] font-semibold">Time</h2>
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

      {/* Starts: footer button */}
      <div className="absolute bottom-0 left-0 bg-[#D9D9D9] p-5 w-full">
        <button
          type="button"
          className="bg-[#000000] text-white text-[14px] font-bold rounded-lg p-3 w-full"
          onClick={() => alert("Confirmation booking appointment!")}
        >
          Book Appointment
        </button>
      </div>
      {/* Ends: footer button */}
    </div>
  );
};

export default ShopDetailsPageWrapper;
