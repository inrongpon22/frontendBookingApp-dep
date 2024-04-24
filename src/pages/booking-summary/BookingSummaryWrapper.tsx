import { Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Toast } from "../../helper/alerts";
import axios from "axios";
import { app_api } from "../../helper/url";
import useSWR from "swr";
import moment from "moment";
import { useTranslation } from "react-i18next";

const BookingSummaryWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // id click from my-bookings

  const token = localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token")!)
    : null;

  const { t } = useTranslation();

  const [lists, setLists] = useState<
    {
      label: string;
      text: string;
    }[]
  >([]);

  const { data: bookingById } = useSWR(
    id && `${app_api}/reservation/${id}`,
    (url: string) =>
      axios
        .get(url, {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => res.data)
        .catch((err) => console.log(err))
  );

  const cancelBooking = async () => {
    Swal.fire({
      title: `<span style="font-size: 17px; font-weight: bold;">${t(
        "noti:booking:cancel:confirmation"
      )}?</span>`,
      html: `
    <span style="font-size: 14px;">
    ${t("noti:booking:cancel:confirmationDesc")}
    
    </span>`,
      showCancelButton: true,
      cancelButtonText: t("button:cancel"),
      confirmButtonText: t("button:confirm"),
      reverseButtons: true,
      customClass: {
        confirmButton: "border rounded-lg py-3 px-10 text-white bg-[#020873]",
        cancelButton: "border rounded-lg py-3 px-10 text-black bg-white me-5",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(`${app_api}/cancelReservation/${id}/${bookingById.serviceId}`, {
            headers: {
              Authorization: `${token}`,
            },
          })
          .then(() => {
            Toast.fire({
              icon: "success",
              title: t("noti:booking:cancel:success"),
            });
          })
          .catch((error) => {
            console.log(error);
            Toast.fire({
              icon: "error",
              title: t("noti:booking:cancel:fail"),
            });
          });
      }
    });
  };

  useEffect(() => {
    if (location.state?.data.reservationId && location.state?.data.serviceId) {
      document.title = t("title:bookingSuccess");
      Toast.fire({
        icon: "success",
        title: t("noti:booking:create:success"),
      });
      setLists([
        {
          label: t("what"),
          text: location.state?.lists.what,
        },
        {
          label: t("when"),
          text: location.state?.lists.when,
        },
        {
          label: t("where"),
          text: location.state?.lists.where,
        },
        {
          label: t("who"),
          text: location.state?.lists.who,
        },
        {
          label: t("price"),
          text: location.state?.lists.price,
        },
        {
          label: t("notes"),
          text: location.state?.lists.note,
        },
      ]);
    } else {
      document.title = t("title:myBookings");
      setLists([
        {
          label: t("what"),
          text: bookingById?.title,
        },
        {
          label: t("when"),
          text: `${moment(bookingById?.bookingDate).format(
            "dddd, MMMM D, YYYY"
          )}`,
        },
        {
          label: t("where"),
          text: bookingById?.address,
        },
        {
          label: t("who"),
          text: `${bookingById?.userName} (${bookingById?.guestNumber} person)`,
        },
        {
          label: t("price"),
          text: bookingById?.price,
        },
        {
          label: t("notes"),
          text: bookingById?.remark ? bookingById?.remark : "-",
        },
      ]);
    }
  }, [bookingById]);

  return (
    <div className="p-5">
      <p className="text-[25px] font-semibold mt-14">
        {t("title:bookingIsconfirmed")}
      </p>
      <p className="my-3">{t("desc:weSendSms")}</p>
      <Divider />
      <div className="py-4">
        {lists?.map((item: any, index: number) => {
          return (
            <div key={index} className="grid grid-cols-4 py-1">
              <div className="font-semibold">{item.label}:</div>
              <span className="col-span-3">{item.text}</span>
            </div>
          );
        })}
      </div>
      <div className={id ? "flex justify-center" : "hidden"}>
        <Divider />
        <span className="py-5 w-2/3 text-center">
          {t("fragment:needTo")}{" "}
          <button type="button" className="underline" onClick={cancelBooking}>
            {t("fragment:cancel")}
          </button>{" "}
          {t("fragment:aBooking")}?
        </span>
        <Divider />
      </div>
      <button
        type="button"
        className="bg-[#020873] w-full text-white p-2 mt-5 rounded-lg"
        onClick={() => navigate("/my-bookings")}
      >
        {t("button:goToMyBookingButton")}
      </button>
    </div>
  );
};

export default BookingSummaryWrapper;
