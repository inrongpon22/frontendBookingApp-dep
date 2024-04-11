import { createContext, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
export const ShopContext = createContext<any>(null);
import moment from "moment";
// icon
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
// styled
import { Chip, ThemeProvider, createTheme } from "@mui/material";
import axios from "axios";
import { app_api } from "../../helper/url";
import {
  // openTimeTypes,
  quantityTypes,
  serviceTypes,
  shopDetailTypes,
} from "./detailTypes";
// components
import { Slideshow } from "./components/Slideshow";
import Calendar from "./components/Calendar";
import ServiceOptions from "./components/ServiceOptions";
import Quantity from "./components/Quantity";
import TimeSlots from "./components/TimeSlots";
import ConfirmDialog from "./components/ConfirmDialog";

const theme = createTheme({
  palette: {
    info: {
      main: "#E6F1FD",
    },
  },
});

const ShopDetailsPageWrapper = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // id from params
  // get shop details by id connected api
  const [shopDetail, setShopDetail] = useState<shopDetailTypes>();

  // mock up quantities
  const [quantities, setQuantities] = useState<quantityTypes>({
    title: "Guest",
    desc: "Number of guest",
    quantities: 1,
    max: 10,
    min: 1,
  });

  const [calendar, setCalendar] = useState({
    start: moment(),
    end: moment().add(10, "day"),
  });
  // get calendar date for custom render
  const [dateArr, setDateArr] = useState<object[]>([]);

  // handle select date on calendar
  const [selectedDate, setSelectedDate] = useState<any>({
    date: moment(),
  });

  // handle services state
  const [services, setServices] = useState<serviceTypes[]>([]);
  // mock up time & handle select time
  // const [avaiTimes, setAvaiTimes] = useState<openTimeTypes[]>([]);

  // handle dialog
  const [isShowDialog, setIsShowDialog] = useState<boolean>(false);

  // get business by id from params
  useMemo(() => {
    axios.get(`${app_api}/business/${id}`).then((res) => {
      if (res.status === 200) {
        setShopDetail(res.data);
      }
    });
  }, []);

  // get services by business id
  useMemo(() => {
    axios.get(`${app_api}/serviceByBusinessId/${id}`).then((res) => {
      if (res.status === 200) {
        setServices(
          res.data.map((item: any, index: number) => {
            if (index === 0) {
              return {
                ...item,
                isSelected: true,
                bookingSlots: item.bookingSlots.map((ii: any) => {
                  return { ...ii, isSelected: false };
                }),
              };
            } else {
              return {
                ...item,
                isSelected: false,
                bookingSlots: item.bookingSlots.map((ii: any) => {
                  return { ...ii, isSelected: false };
                }),
              };
            }
          })
        );
      }
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <ShopContext.Provider
        value={{
          shopDetail,
          setShopDetail,
          calendar,
          setCalendar,
          dateArr,
          setDateArr,
          selectedDate,
          setSelectedDate,
          services,
          setServices,
          quantities,
          setQuantities,
          isShowDialog,
          setIsShowDialog,
        }}
      >
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

          <Slideshow data={shopDetail?.imagesURL || []} />

          <div id="shop-details" className="relative my-auto p-5">
            <h1 className="text-[25px] font-semibold">{shopDetail?.title}</h1>
            <span className="text-[14px] font-normal">
              {shopDetail?.description || "No detail for this shop"}
            </span>
            <div className="mt-2">
              <Chip
                className="mt-1 custom-chip-label"
                icon={<LocationOnIcon fontSize="small" />}
                label={shopDetail?.address}
                color="info"
              />
              <Chip
                className="mt-1 custom-chip-label"
                icon={<LocalPhoneIcon fontSize="small" />}
                label={shopDetail?.phoneNumber}
                color="info"
              />
              <Chip
                className="mt-1 ms-1 custom-chip-label"
                // icon={<LocalPhoneIcon fontSize="small" />}
                label="Hair Cut"
                color="info"
              />
            </div>
          </div>

          <Quantity />

          <Calendar />

          <ServiceOptions />

          <TimeSlots />

          {/* Starts:: dialog */}
          <ConfirmDialog />
          {/* Ends:: dialog */}
        </div>
      </ShopContext.Provider>
    </ThemeProvider>
  );
};

export default ShopDetailsPageWrapper;
