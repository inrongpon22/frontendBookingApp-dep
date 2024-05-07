import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { globalConfirmation } from "../../helper/alerts";
import axios from "axios";
import { app_api } from "../../helper/url";
import useSWR from "swr";
import moment from "moment";
import { useTranslation } from "react-i18next";
// icons
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import toast from "react-hot-toast";

const BookingSummaryWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId } = useParams(); // bookingId click from my-bookings

  const token = localStorage.getItem("token");
  const lang = localStorage.getItem("lang");

  const { t } = useTranslation();

  const switchStatus = (status: string) => {
    switch (status) {
      case "pending":
        return {
          title: t("title:waitingForApproval"),
          desc: t("desc:waitingForApproval"),
          icon: <HourglassTopIcon style={{ fontSize: 50 }} color="warning" />,
        };

      case "approval":
        return {
          title: t("title:bookingHasApproved"),
          desc: t("desc:bookingHasApproved"),
          icon: <CheckIcon style={{ fontSize: 50 }} color="success" />,
        };

      case "cancel":
        return {
          title: t("title:bookingHasCancelled"),
          desc: t("desc:bookingHasCancelled"),
          icon: <CloseIcon style={{ fontSize: 50 }} color="error" />,
        };

      case "expired":
        return {
          title: t("title:waitingForApproval"),
          desc: t("desc:waitingForApproval"),
          icon: <QueryBuilderIcon style={{ fontSize: 50 }} color="secondary" />,
        };

      case "declinded":
        return {
          title: t("title:bookingHasDeclined"),
          desc: t("desc:bookingHasDeclined"),
          icon: <SentimentNeutralIcon style={{ fontSize: 50 }} color="info" />,
        };

      default:
        break;
    }
  };

  const [lists, setLists] = useState<
    {
      label: string;
      text: string;
    }[]
  >([]);

  const { data: bookingById } = useSWR(
    bookingId && `${app_api}/reservation/${bookingId}`,
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
    globalConfirmation(
      t("noti:booking:cancel:confirmation"),
      t("noti:booking:cancel:confirmationDesc"),
      t("button:approve"),
      undefined,
      t("button:cancel")
    ).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(
            `${app_api}/cancelReservation/${bookingId}/${bookingById.serviceId}/${lang}/customer`,{},
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          )
          .then(() => {
            toast.success(t("noti:booking:cancel:success"));
            navigate("/my-bookings")
          })
          .catch((error) => {
            console.log(error);
            toast.error(t("noti:booking:cancel:fail"));
          });
      }
    });
  };

  useEffect(() => {
    if (location.state?.data.reservationId && location.state?.data.serviceId) {
      document.title = t("title:bookingSuccess");
      toast.success(t("noti:booking:create:success"))
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
      <p className="flex flex-col justify-center items-center text-[25px] font-semibold mt-14">
        <span>{switchStatus(bookingById?.status)?.icon}</span>
        <span>{switchStatus(bookingById?.status)?.title}</span>
      </p>
      <p className="my-3 text-center">
        {switchStatus(bookingById?.status)?.desc}
      </p>

      <div className="p-4 border rounded-lg">
        {lists?.map((item: any, index: number) => {
          return (
            <div
              key={index}
              className={`text-[14px] grid grid-cols-6 py-1 ${
                bookingById?.status === "cancel" ||
                bookingById?.status === "declinded"
                  ? "text-gray-500"
                  : ""
              }`}
            >
              <div className="col-span-2 font-semibold">{item.label}:</div>
              <span className="col-span-4 font-medium text-end">
                {item.text}
              </span>
            </div>
          );
        })}
      </div>

      <div
        className={
          bookingById?.status === "cancel" ||
          bookingById?.status === "declinded"
            ? "flex gap-3"
            : ""
        }
      >
        <button
          type="button"
          className={`w-full p-2 mt-5 rounded-lg ${
            bookingById?.status === "cancel" ||
            bookingById?.status === "declinded"
              ? "border-2 border-deep-blue text-deep-blue"
              : "bg-deep-blue text-white"
          }`}
          onClick={() => navigate("/my-bookings")}
        >
          {t("button:goToMyBookingButton")}
        </button>
        <button
          type="button"
          className={`bg-[#020873] w-full text-white p-2 mt-5 rounded-lg ${
            bookingById?.status === "cancel" ||
            bookingById?.status === "declinded"
              ? "block"
              : "hidden"
          }`}
          onClick={() => navigate(`/details/${bookingById?.businessId}`)}
        >
          {t("button:rebook")}
        </button>
      </div>
      <div
        className={
          bookingById?.status === "cancel" ||
          bookingById?.status === "declinded"
            ? "hidden"
            : "flex justify-center"
        }
      >
        <span className="py-5 w-2/3 text-center">
          {t("fragment:needTo")}{" "}
          <button type="button" className="underline" onClick={cancelBooking}>
            {t("fragment:cancel")}
          </button>{" "}
          {t("fragment:aBooking")}?
        </span>
      </div>
    </div>
  );
};

export default BookingSummaryWrapper;
