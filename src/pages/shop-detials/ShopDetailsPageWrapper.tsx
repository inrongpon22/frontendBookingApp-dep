import { createContext, useState } from "react";
import { useParams } from "react-router-dom";
export const ShopContext = createContext<any>(null); //create context to store all the data
import moment from "moment";
// icon
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
// styled
import {
  Backdrop,
  Chip,
  CircularProgress,
  ThemeProvider,
  createTheme,
} from "@mui/material";
// fetcher
import useSWR from "swr";
import axios from "axios";
import { app_api } from "../../helper/url";
import { quantityTypes, serviceTypes, shopDetailTypes } from "./detailTypes"; //types
// components
import { Slideshow } from "./components/Slideshow";
import Calendar from "./components/Calendar";
import ServiceOptions from "./components/ServiceOptions";
import Quantity from "./components/Quantity";
import TimeSlots from "./components/TimeSlots";
import ConfirmDialog from "./components/ConfirmDialog";

const theme = createTheme({
  // create theme for custom color mui
  palette: {
    info: {
      main: "#E6F1FD",
    },
  },
});

const ShopDetailsPageWrapper = () => {
  const { id } = useParams(); // id from params
  // get shop details by id connected api
  const [shopDetail, setShopDetail] = useState<shopDetailTypes>();

  // handle quantities
  const [quantities, setQuantities] = useState<quantityTypes>({
    title: "Guest",
    desc: "Number of guest",
    quantities: 1,
    max: 10,
    min: 1,
  });

  // handle calendar date
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
  const [serviceById, setServiceById] = useState<any>();

  // handle dialog
  const [isShowDialog, setIsShowDialog] = useState<boolean>(false);

  // get business by id from params
  const { error: bussDataError } = useSWR(
    `${app_api}/business/${id}`,
    (url: string) => axios.get(url).then((res) => setShopDetail(res.data)),
    { revalidateOnFocus: false }
  );

  // get services by business id
  const { error: servicesDataError } = useSWR(
    `${app_api}/serviceByBusinessId/${id}`,
    (url: string) =>
      axios.get(url).then((res) =>
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
        )
      ),
    { revalidateOnFocus: false }
  );

  // get services by id
  const { isLoading: servByIdLoading, error: serviceByIdError } = useSWR(
    () =>
      services.find((item: any) => item.isSelected) &&
      `${app_api}/service/${
        services.find((item: any) => item.isSelected)?.id
      }/${selectedDate.date.format("YYYY-MM-DD")}`,
    (url: string) =>
      axios.get(url).then((res) =>
        setServiceById({
          ...res.data,
          bookingSlots: res.data.bookingSlots.map((item: any) => {
            return { ...item, isSelected: false };
          }),
        })
      ),
    {
      revalidateOnFocus: false,
      onLoadingSlow: () => setServiceById(undefined),
      loadingTimeout: 0,
    }
  );

  // catch errors api
  if (bussDataError | servicesDataError | serviceByIdError)
    return <div>Api Error</div>;

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
          serviceById,
          setServiceById,
          quantities,
          setQuantities,
          isShowDialog,
          setIsShowDialog,
        }}
      >
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={servByIdLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <div className="relative lg:grid lg:grid-cols-2">
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

          <div className="flex flex-col justify-center items-center my-5">
            <button
              type="button"
              disabled={
                !serviceById?.bookingSlots.find((item: any) => item.isSelected)
              }
              className={`${
                !serviceById?.bookingSlots.find((item: any) => item.isSelected)
                  ? "bg-gray-300"
                  : "bg-[#020873]"
              }  text-white text-[14px] font-semibold w-11/12 rounded-md py-3`}
              onClick={() => {
                if (
                  serviceById?.bookingSlots.find((item: any) => item.isSelected)
                ) {
                  setIsShowDialog(true);
                }
              }}
            >
              Confirm & Booking
            </button>
            <span className="text-[12px]">Please review details carefully</span>
          </div>

          {/* Starts:: dialog */}
          <ConfirmDialog />
          {/* Ends:: dialog */}
        </div>
      </ShopContext.Provider>
    </ThemeProvider>
  );
};

export default ShopDetailsPageWrapper;
