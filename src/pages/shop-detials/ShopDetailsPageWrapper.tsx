import { createContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
export const ShopContext = createContext<any>(null); //create context to store all the data
import moment from "moment";
import "moment/locale/th";
// styled
import {
  Backdrop,
  CircularProgress,
  ThemeProvider,
  createTheme,
} from "@mui/material";
// fetcher
import useSWR from "swr";
import axios from "axios";
import { app_api } from "../../helper/url";
import {
  quantityTypes,
  serviceTypes,
  shopDetailTypes,
} from "../../components/shop-details/detailTypes"; //types
// components
import { Slideshow } from "../../components/shop-details/Slideshow";
import Calendar from "../../components/shop-details/Calendar";
import ServiceOptions from "../../components/shop-details/ServiceOptions";
import Quantity from "../../components/shop-details/Quantity";
import TimeSlots from "../../components/shop-details/TimeSlots";
import DialogWrapper from "../../components/dialog/DialogWrapper";
import ShopInformation from "../../components/shop-details/ShopInformation";

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
  const { t } = useTranslation();

  const [shopDetail, setShopDetail] = useState<shopDetailTypes>(); // get shop details by id connected api

  const [quantities, setQuantities] = useState<quantityTypes>({
    title: "Guest",
    desc: "Number of guest",
    quantities: 1,
    max: 10,
    min: 1,
  }); // handle quantities

  const [calendar, setCalendar] = useState({
    // handle calendar date
    start: moment(),
    end: moment().add(10, "day"),
  });

  const [dateArr, setDateArr] = useState<object[]>([]); // get calendar date for custom render

  const [selectedDate, setSelectedDate] = useState<any>({
    // handle select date on calendar
    date: moment(),
  });

  // handle services state
  const [services, setServices] = useState<serviceTypes[]>([]);
  const [serviceById, setServiceById] = useState<any>();

  // handle dialog
  const [isShowDialog, setIsShowDialog] = useState<boolean>(false);
  const [modalState, setModalState] = useState<string>("phone-input"); //phone-input

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

  // get time slots by service id
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

  useMemo(() => {
    if (
      // if today not includes days open, auto select next available date
      services.length > 0 &&
      !services
        .find((item: any) => item.isSelected)
        ?.daysOpen.includes(selectedDate.date.format("dddd"))
    ) {
      const nextavailable = dateArr.filter((item: any) =>
        services
          .find((item: any) => item.isSelected)
          ?.daysOpen.includes(item.format("dddd"))
      )[0];
      setSelectedDate({ date: nextavailable });
    } else {
      setSelectedDate({ date: moment() });
    }
  }, [services]);

  // browser tab title
  useEffect(() => {
    document.title = shopDetail?.title || "Shop Detail";
  }, [shopDetail]);

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
          modalState,
          setModalState,
        }}
      >
        {/* loading progress */}
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={servByIdLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {/* loading progress */}
        <div className="relative lg:grid lg:grid-cols-2">
          <Slideshow data={shopDetail?.imagesURL || []} />

          <ShopInformation />

          <ServiceOptions />

          <Quantity />

          <Calendar />

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
              {t("button:confirmBookingButton")}
            </button>
            <span className="text-[12px] py-2">{t("reviewDetails")}</span>
          </div>

          {/* Starts:: dialog */}
          <DialogWrapper
            show={isShowDialog}
            setShow={setIsShowDialog}
            userSide="user"
            dialogState={modalState}
            setDialogState={setModalState}
          />
          {/* Ends:: dialog */}
        </div>
      </ShopContext.Provider>
    </ThemeProvider>
  );
};

export default ShopDetailsPageWrapper;
