import { useContext, useEffect } from "react";
import { ShopContext } from "../../pages/shop-detials/ShopDetailsPageWrapper";
import { useTranslation } from "react-i18next";
import { DialogContext } from "./DialogWrapper";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { app_api } from "../../helper/url";
import toast from "react-hot-toast";

const BookingDetailsPreview = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { shopDetail, services, selectedDate, serviceById, quantities } =
    useContext<any>(ShopContext);

  const { formik, setIsLoading } = useContext<any>(DialogContext);

  const {
    t,
    i18n: { language },
  } = useTranslation();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const slotArrays = serviceById?.bookingSlots.find(
    (item: any) =>
      item.daysOpen?.includes(selectedDate.date.format("dddd")) &&
      selectedDate.date.isAfter(item.availableFromDate)
  );

  const filterSelected = slotArrays?.slotsTime.filter(
    (item: any) => item.isSelected
  );

  useEffect(() => {
    if (token && formik.values.userId === 0) {
      axios
        .get(`${app_api}/user/${userId}`, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          formik.setValues({
            userId: res.data.id,
            username: res.data.name,
            phoneNumbers: res.data.phoneNumber,
            otp: "",
            additionalNotes: "",
          });
        });
    }
  }, []);

  const createReservation = async () => {
    await setIsLoading(true);
    const selectedArr = slotArrays?.slotsTime.filter(
      (item: any) => item.isSelected
    );
    const body = {
      userId: formik.values.userId,
      serviceId: Number(services.find((item: any) => item.isSelected)?.id),
      phoneNumber: formik.values.phoneNumbers,
      remark: formik.values.additionalNotes,
      slotTimes: selectedArr.map((item: any) => {
        return { startTime: item.startTime, endTime: item.endTime };
      }),
      status: "pending",
      by: pathname.includes("business") ? "business" : "customer",
      userName: formik.values.username,
      bookingDate: selectedDate.date.format("YYYY-MM-DD"),
      guestNumber: quantities.quantities,
    };

    await axios
      .post(
        `${app_api}/${
          pathname.includes("business")
            ? "makeMutiReservationByBus"
            : "makeMutiReservation"
        }/${language}`,
        body,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        navigate(`/booking/${res.data.reservationId}`);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const getFirst = filterSelected[0];
  const getLast = filterSelected[filterSelected?.length - 1];

  console.log(getFirst, getLast);

  return (
    <section>
      <div className="">
        <p className="text-[14px] font-semibold">{t("bookingDetails")}</p>
        <div className="border rounded-md mt-1">
          <p className="flex justify-between p-3">
            <span>{t("services")}:</span>
            <span className="text-[14px] font-bold">
              {shopDetail.title}{" "}
              {services?.find((item: any) => item.isSelected)?.title}
            </span>
          </p>
          <p className="flex justify-between p-3">
            <span>{t("date")}:</span>
            <span className="text-[14px] font-bold">
              {selectedDate?.date.format("MMMM DD, YYYY")}
            </span>
          </p>
          <p className="flex justify-between p-3">
            <span>{t("time")}:</span>
            <span className="text-[14px] font-bold">
              {`${getFirst?.startTime} - ${getLast?.endTime}`}
            </span>
          </p>
          <p className="flex justify-between p-3">
            <span>{t("guests")}:</span>
            <span className="text-[14px] font-bold">
              {quantities.quantities}
            </span>
          </p>
          <p className="flex justify-between p-3">
            <span>{t("price")}:</span>
            <span className="text-[14px] font-bold">
              {services?.find((item: any) => item.isSelected)?.price}{" "}
              {serviceById?.currency}
            </span>
          </p>
        </div>
      </div>
      <div className="mt-3">
        <p className="text-[14px] font-semibold">{t("bookingName")}</p>
        <input
          type="text"
          {...formik.getFieldProps("username")}
          className={`w-full py-2 px-3 mt-1 border rounded-lg ${
            formik.errors?.username ? "border-2 border-rose-500" : "border"
          }`}
          placeholder="meetsoftware123"
        />
        {formik.touched.username && formik.errors.username && (
          <span className="text-[14px] text-rose-500">
            {formik.errors?.username}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-[14px] font-semibold">{t("bookingNumbers")}</p>
        <input
          type="text"
          {...formik.getFieldProps("phoneNumbers")}
          className={`w-full py-2 px-3 mt-1 border rounded-lg ${
            formik.errors?.phoneNumbers ? "border-2 border-rose-500" : "border"
          }`}
          placeholder="+66 12 345 6789"
        />
        {formik.touched.phoneNumbers && formik.errors.phoneNumbers && (
          <span className="text-[14px] text-rose-500">
            {formik.errors?.phoneNumbers}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-[14px] font-semibold">{t("notes")}</p>
        <textarea
          rows={3}
          {...formik.getFieldProps("additionalNotes")}
          className="w-full py-2 px-3 mt-1 border rounded-lg"
          placeholder="ex. Hair cut with spa and treatment"
        />
      </div>
      <div className="flex flex-col py-2">
        <label htmlFor="" className="text-[12px] text-[#5C5C5C]">
          {t("termsAndprivacy")}
        </label>
      </div>
      <button
        type="button"
        className="bg-[#020873] w-full text-white p-2 rounded-lg"
        onClick={createReservation}
      >
        {t("button:confirmBookingButton")}
      </button>
    </section>
  );
};

export default BookingDetailsPreview;
