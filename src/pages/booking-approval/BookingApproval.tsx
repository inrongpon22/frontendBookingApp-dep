import { createContext, useEffect, useState } from "react";
export const ApproveContext = createContext<any>(null); //create context to store all the data
import { useParams } from "react-router-dom";
import useSWR from "swr";
import axios from "axios";
import { app_api, fetcher } from "../../helper/url";
import { Backdrop, CircularProgress } from "@mui/material";
// components
import RequestCards from "../../components/business-approval/RequestCards";
import DialogWrapper from "../../components/dialog/DialogWrapper";
import { Toast } from "../../helper/alerts";
import Swal from "sweetalert2";

const BookingApproval = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [show, setShow] = useState<boolean>(false);
  const [dialogState, setDialogState] = useState<string | undefined>(
    "booking-approval-summary"
  );
  const [bookingDatas, setBookingDatas] = useState<any>();

  const { data: getBusinessById, error: BusinessByIdError } = useSWR(
    `${app_api}/business/${id}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  const {
    data: getReservByBusiId,
    isLoading,
    error: ReservByBusiIdError,
    mutate,
  } = useSWR(
    id && `${app_api}/getReservationByBusinessId/${id}`,
    (url: string) =>
      axios
        .get(url, {
          headers: {
            Authorization: token,
          },
        })
        .then((res) =>
          res.data.filter((item: any) => item.status === "pending")
        ),
    { revalidateOnFocus: false }
  );

  const approveRequested = async (id: string, serviceId: string) => {
    Swal.fire({
      icon: "warning",
      title: `<span style="font-size: 17px; font-weight: bold;">Are you sure you want to approve this booking?</span>`,
      html: `<p style="font-size: 14px;">Once approved, the customer will be notified, 
      and the booking will be finalized.</p>`,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Approve",
      reverseButtons: true,
      customClass: {
        confirmButton: "border rounded-lg py-3 px-10 text-white bg-[#020873]",
        cancelButton: "border rounded-lg py-3 px-10 text-black bg-white me-5",
        popup: "custom-swal",
      },
      buttonsStyling: false,
    }).then((result: any) => {
      if (result.isConfirmed) {
        axios
          .post(`${app_api}/approveReservation/${id}/${serviceId}`, undefined, {
            headers: {
              Authorization: token,
            },
          })
          .then(() => {
            setShow(false);
            Toast.fire({
              icon: "success",
              title: "Booking approved successfully",
            });
            setShow(false);
            mutate();
          })
          .catch((err) => Toast.fire({ icon: "error", title: err.message }));
      }
    });
  };

  const rejectRequested = async (id: string, serviceId: string) => {
    Swal.fire({
      icon: "warning",
      title: `<span style="font-size: 17px; font-weight: bold;">Are you sure you want to reject this booking?</span>`,
      html: `<p style="font-size: 14px;">Once approved, the customer will be notified, 
      and the booking will be finalized.</p>`,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Reject",
      reverseButtons: true,
      customClass: {
        confirmButton: "border rounded-lg py-3 px-10 text-white bg-[#020873]",
        cancelButton: "border rounded-lg py-3 px-10 text-black bg-white me-5",
        popup: "custom-swal",
      },
      buttonsStyling: false,
    }).then((result: any) => {
      if (result.isConfirmed) {
        axios
          .post(`${app_api}/cancelReservation/${id}/${serviceId}`, undefined, {
            headers: {
              Authorization: token,
            },
          })
          .then(() => {
            setShow(false);
            Toast.fire({
              icon: "success",
              title: "Booking has been reject",
            });
            setShow(false);
            mutate();
          })
          .catch((err) => Toast.fire({ icon: "error", title: err.message }));
      }
    });
  };

  useEffect(() => {
    document.title = "Booking Approval";
  }, []);

  if (BusinessByIdError || ReservByBusiIdError) return <div>API ERROR</div>;

  return (
    <ApproveContext.Provider
      value={{
        show,
        setShow,
        mutate,
        approveRequested,
        rejectRequested,
        bookingDatas,
        setBookingDatas,
        dialogState,
        setDialogState,
      }}
    >
      <div className="h-dvh flex flex-col">
        {/* loading progress */}
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {/* loading progress */}
        <p className="drop-shadow-lg p-4 font-semibold text-[14px]">
          {getBusinessById?.title}
        </p>
        <div className="bg-gray-100">
          <p className="p-4 text-[14px]">
            Booking request({getReservByBusiId?.length})
          </p>
          <div className="">
            {getReservByBusiId ? (
              getReservByBusiId.map((item: any, index: number) => {
                return <RequestCards key={index} data={item} />;
              })
            ) : (
              <p className="p-4 text-[14px]">No booking request</p>
            )}
          </div>
        </div>
        <DialogWrapper
          show={show}
          setShow={setShow}
          userSide="business"
          dialogState={dialogState}
          setDialogState={setDialogState}
        />
      </div>
    </ApproveContext.Provider>
  );
};

export default BookingApproval;
