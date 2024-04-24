import { Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Toast } from "../../helper/alerts";
import axios from "axios";
import { app_api } from "../../helper/url";
import useSWR from "swr";
import moment from "moment";

const BookingSummaryWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // id click from my-bookings

  const token = localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token")!)
    : null;

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
      title: `<span style="font-size: 17px; font-weight: bold;">Are you sure to cancel booking?</span>`,
      html: `
    <span style="font-size: 14px;">
      Booking slot will be available to others.
    </span>`,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Confirm",
      reverseButtons: true,
      customClass: {
        confirmButton: "border rounded-lg py-3 px-10 text-white bg-[#020873]",
        cancelButton: "border rounded-lg py-3 px-10 text-black bg-white me-5",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(
            `${app_api}/cancelReservation/${id}/${bookingById.serviceId}`,
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          )
          .then(() => {
            Toast.fire({
              icon: "success",
              title: "Booking cancelled successfully",
            });
          })
          .catch((error) => {
            console.log(error);
            Toast.fire({
              icon: "error",
              title: "Booking cancellation failed",
            });
          });
      } else {
        console.log("booking cancellation cancelled");
      }
    });
  };

  useEffect(() => {
    if (location.state?.data.reservationId && location.state?.data.serviceId) {
      document.title = "Booking Success";
      Toast.fire({
        icon: "success",
        title: "Create booking successfully",
      });
      console.log("success");
      setLists([
        {
          label: "What",
          text: location.state?.lists.what,
        },
        {
          label: "When",
          text: location.state?.lists.when,
        },
        {
          label: "Where",
          text: location.state?.lists.where,
        },
        {
          label: "Who",
          text: location.state?.lists.who,
        },
        {
          label: "Price",
          text: location.state?.lists.price,
        },
        {
          label: "Note",
          text: location.state?.lists.note,
        },
      ]);
    } else {
      document.title = "My Booking";
      setLists([
        {
          label: "What",
          text: bookingById?.title,
        },
        {
          label: "When",
          text: `${moment(bookingById?.bookingDate).format(
            "dddd, MMMM D, YYYY"
          )}`,
        },
        {
          label: "Where",
          text: bookingById?.address,
        },
        {
          label: "Who",
          text: `${bookingById?.userName} (${bookingById?.guestNumber} person)`,
        },
        {
          label: "Price",
          text: bookingById?.price,
        },
        {
          label: "Note",
          text: bookingById?.remark ? bookingById?.remark : "-",
        },
      ]);
    }
  }, [bookingById]);

  return (
    <div className="p-5">
      <p className="text-[25px] font-semibold mt-14">
        This booking is confirmed
      </p>
      <p className="my-3">
        We've sent an SMS to confirm your booking, You can review your booking
        details there.
      </p>
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
      <Divider />
      <div className="flex justify-center">
        <span className="py-5 w-2/3 text-center">
          Need to{" "}
          <button type="button" className="underline" onClick={cancelBooking}>
            Cancelled
          </button>{" "}
          a booking?
        </span>
      </div>
      <Divider />
      <button
        type="button"
        className="bg-[#020873] w-full text-white p-2 mt-5 rounded-lg"
        onClick={() => navigate("/my-bookings")}
      >
        Go to my booking
      </button>
    </div>
  );
};

export default BookingSummaryWrapper;
