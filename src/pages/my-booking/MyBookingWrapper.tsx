import { useEffect } from "react";
import axios from "axios";
import moment from "moment";
import useSWR from "swr";
import { app_api } from "../../helper/url";
// icons
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { useNavigate } from "react-router-dom";

const MyBookingWrapper = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token")!)
    : null;

  const { data: myReservDatas } = useSWR(
    `${app_api}/getReservationByUserId/14`,
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

  useEffect(() => {
    document.title = "My Bookings";
  }, []);

  return (
    <div className="flex flex-col gap-4 p-5">
      <span className="text-[17px] font-semibold text-center">My Bookings ({myReservDatas?.length})</span>
      <div className="flex flex-col gap-4">
        {myReservDatas?.map((item: any, index: number) => {
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
                <span className="text-[14px] font-semibold">{item.title}</span>
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
        })}
      </div>
    </div>
  );
};

export default MyBookingWrapper;
