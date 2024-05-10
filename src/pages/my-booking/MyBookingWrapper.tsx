import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import moment from "moment";
import useSWR from "swr";
import { app_api } from "../../helper/url";
// icons
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DialogWrapper from "../../components/dialog/DialogWrapper";

const MyBookingWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const { t } = useTranslation();

  const [show, setShow] = useState<boolean>(false);
  const [dialogState, setDialogState] = useState<string>("phone-input")

  const { data: myReservDatas } = useSWR(
    token &&
      `${app_api}/getReservationByUserId/${
        userId ? userId : location.state.userId
      }?page=1&limit=100`,
    (url: string) =>
      axios
        .get(url, {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => res.data)
        .catch((err) => toast.error(err.response.data.message)),
        {revalidateOnFocus: false}
  );

  useEffect(() => {
    document.title = t("title:myBookings");

    if(!token && location.state){
      setShow(true);
    }
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4 p-5">
        <span className="text-[17px] font-semibold text-center">
          {t("title:myBookings")} ({myReservDatas?.length || "0"})
        </span>
        <div className="flex flex-col gap-4">
          {myReservDatas ? (
            myReservDatas.map((item: any, index: number) => {
              const start: string = `${moment(item.bookingDate).format(
                "YYYY-MM-DD"
              )}T${item.startTime}Z`;
              const end: string = `${moment(item.bookingDate).format(
                "YYYY-MM-DD"
              )}T${item.endTime}Z`;
              return (
                <div
                  key={index}
                  className="border rounded-lg p-5 cursor-pointer"
                  onClick={() => navigate(`/booking/${item.id}`)}
                >
                  <p className="flex justify-between">
                    <span className="flex items-center gap-4 text-[14px] font-semibold">
                      <span>{item.title}</span>
                      <span
                        className={`p-1 rounded-lg ${
                          item.status === "pending"
                            ? "bg-yellow-200"
                            : item.status === "approval"
                            ? "bg-green-400"
                            : "bg-red-400"
                        }`}
                      >
                        {item.status}
                      </span>
                    </span>
                    <span>{item.price} THB</span>
                  </p>
                  <p>
                    <CalendarTodayIcon fontSize="small" />
                    {moment(item.bookingDate).format("MMMM D, YYYY")}
                  </p>
                  <p>
                    <AccessTimeIcon />
                    {moment(start).format("HH:mm A")} -{" "}
                    {moment(end).format("HH:mm A")}
                  </p>
                  <p>
                    <LocationOnOutlinedIcon />
                    {item.address}
                  </p>
                </div>
              );
            })
          ) : (
            <>Loading...</>
          )}
        </div>
      </div>
      <DialogWrapper
        show={show}
        setShow={setShow}
        userSide="user"
        dialogState={dialogState}
        setDialogState={setDialogState}
      />
    </>
  );
};

export default MyBookingWrapper;
