import { useContext } from "react";
import { ShopContext } from "../../pages/shop-detials/ShopDetailsPageWrapper";
import { useTranslation } from "react-i18next";
import { DialogContext } from "./DialogWrapper";
import { useNavigate } from "react-router-dom";
import { Toast } from "../../helper/alerts";
import axios from "axios";
import { app_api } from "../../helper/url";

const BookingDetailsPreview = () => {
  const navigate = useNavigate();
  const { shopDetail, services, selectedDate, serviceById, quantities } =
    useContext<any>(ShopContext);

  const { formik } = useContext<any>(DialogContext);

  const { t } = useTranslation();

  const token = JSON.parse(localStorage.getItem("token") || "{}");

  const createReservation = async () => {
    const body = {
      userId: formik.values.userId,
      serviceId: Number(services.find((item: any) => item.isSelected)?.id),
      phoneNumber: formik.values.phoneNumbers,
      remark: formik.values.additionalNotes,
      startTime: serviceById?.bookingSlots.find((item: any) => item.isSelected)
        ?.startTime,
      endTime: serviceById?.bookingSlots.find((item: any) => item.isSelected)
        ?.endTime,
      status: "pending",
      by: "customer",
      userName: formik.values.username,
      bookingDate: selectedDate.date.format("YYYY-MM-DD"),
      guestNumber: quantities.quantities,
    };

    axios
      .post(`${app_api}/reservation`, body, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((res) => {
        navigate("/booking-success", {
          state: {
            lists: {
              what: services.find((item: any) => item.isSelected)?.title,
              when: `${selectedDate.date.format("dddd, MMMM D, YYYY")} ${
                serviceById?.bookingSlots.find((item: any) => item.isSelected)
                  ?.startTime
              } - ${
                serviceById?.bookingSlots.find((item: any) => item.isSelected)
                  ?.endTime
              }`,
              where: `${shopDetail?.address}`,
              who: `${formik.values.username} (${quantities?.quantities} person)`,
              price: `${services.find((item: any) => item.isSelected)?.price} ${
                services.find((item: any) => item.isSelected)?.currency
              }`,
              note: formik.values.additionalNotes,
            },
            data: {
              reservationId: res.data.reservationId,
              serviceId: Number(
                services.find((item: any) => item.isSelected)?.id
              ),
            },
          },
        });
      })
      .catch((err) => {
        Toast.fire({
          icon: "error",
          title: err.response.data.message,
        });
      });
  };

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
              {
                serviceById?.bookingSlots.find((item: any) => item.isSelected)
                  ?.startTime
              }{" "}
              -{" "}
              {
                serviceById?.bookingSlots.find((item: any) => item.isSelected)
                  ?.endTime
              }
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
