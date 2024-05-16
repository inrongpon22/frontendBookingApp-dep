import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import useSWR from "swr";
import { app_api, fetcher } from "../../helper/url";
// icons
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import DialogWrapper from "../../components/dialog/DialogWrapper";
// styled
import { Badge } from "@mui/material";
import toast from "react-hot-toast";
import moment from "moment";
import Loading from "../../components/dialog/Loading";
import { Ireservation } from "../../interface/reservation";

const BusinessProfile = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [dialogState, setDialogState] = useState<string | undefined>(
    "business-more-options"
  );

  const { data: busiDatas } = useSWR(
    businessId && `${app_api}/business/${businessId}`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const { data: getReservation, isLoading: reservLoading } = useSWR<
    Ireservation[]
  >(
    businessId && `${app_api}/getReservationByBusinessId/${businessId}/all`,
    (url: string) =>
      axios
        .get(url, {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        })
        .then((res) => res.data),
    {
      revalidateOnFocus: false,
    }
  );

  const pendingBookings = getReservation?.filter(
    (item: any) => item.status === "pending"
  );

  const todayBookings = getReservation?.filter(
    (item: any) =>
      (moment(item.bookingDate).isSame(moment(), "day") &&
        item.status === "approval") ||
      (moment(item.bookingDate).isSame(moment(), "day") &&
        item.status === "cancel")
  );

  return (
    <div className="flex flex-col h-dvh bg-[#F7F7F7]">
      <Loading openLoading={reservLoading} />
      {/* headers */}
      <div className="flex justify-between items-center bg-white p-5">
        <p className="text-[22px] font-semibold">{busiDatas?.title}</p>
        <div className="flex items-center gap-3">
          <Badge
            color="warning"
            variant="dot"
            className="cursor-pointer"
            onClick={() => toast("coming soon")}
          >
            <NotificationsActiveOutlinedIcon fontSize="small" />
          </Badge>
          <Badge
            color="secondary"
            variant="standard"
            className="cursor-pointer"
            onClick={() => setShowDialog(true)}
          >
            <SettingsOutlinedIcon fontSize="small" />
          </Badge>
        </div>
      </div>
      {/* headers */}

      <div className="w-full bg-white">
        <div className="text-[14px] text-[#A1A1A1] font-bold px-5">
          {t("pending")}
        </div>

        {/* pending section */}
        <div className="bg-white w-full">
          {pendingBookings?.map((item: Ireservation, index: number) => {
            return (
              <div
                key={index}
                className="flex justify-between cursor-pointer hover:bg-gray-100 px-5 py-3"
                onClick={() =>
                  navigate(
                    `/booking-approval/${businessId}/${item.serviceId}`,
                    {
                      state: item,
                    }
                  )
                }
              >
                <div className="flex flex-col">
                  <p className="flex items-center gap-1">
                    <span className="text-[14px] font-semibold">
                      {item.title}
                    </span>
                    <span className="flex items-center text-deep-blue bg-deep-blue bg-opacity-10 rounded-lg px-1">
                      {item.guestNumber > 1 ? (
                        <PeopleAltOutlinedIcon fontSize="small" />
                      ) : (
                        <PersonOutlinedIcon fontSize="small" />
                      )}
                      {item.guestNumber}
                    </span>
                  </p>
                  <p className="flex gap-1 text-[14px]">
                    <span>
                      {item.startTime.slice(0, -3)} -{" "}
                      {item.endTime.slice(0, -3)}
                    </span>
                    <span className="w-[3px] h-[3px] bg-black rounded-full self-center" />
                    <span>{moment(item.bookingDate).format("DD MMM")}</span>
                    <span className="w-[3px] h-[3px] bg-black rounded-full self-center" />
                    <span>{item.userName}</span>
                  </p>
                </div>
                <p className="flex flex-col gap-1 text-end justify-center">
                  <NavigateNextIcon className="text-deep-blue" />
                </p>
              </div>
            );
          })}
        </div>
        {/* pending section */}
      </div>

      {/* today section */}
      <div className="text-[14px] bg-white p-5 mt-2">
        <div className="flex justify-between">
          <p className="font-bold text-zinc-400">Today</p>
          {/* <p className="text-[12px] text-deep-blue text-opacity-80 underline">
            View all
          </p> */}
        </div>
        {/* <Divider>
          <span className="text-[12px] text-red-600 font-bold">
            Now, {moment().format("HH:mm")}
          </span>
        </Divider> */}
        <div className="flex flex-col gap-5 py-5">
          {todayBookings?.map((item: Ireservation, index: number) => {
            return (
              <div key={index} className="flex justify-between">
                <div className="flex gap-2">
                  <p
                    className={`${
                      item.status === "approval"
                        ? "bg-deep-blue bg-opacity-10 text-deep-blue"
                        : "bg-zinc-200 text-zinc-400"
                    } px-1 rounded`}
                  >
                    {item.startTime.slice(0, -3)}
                  </p>
                  <p
                    className={`${
                      item.status === "approval" ? "" : "text-zinc-400"
                    } font-semibold`}
                  >
                    {item.title}
                  </p>
                </div>
                <p
                  className={item.status === "approval" ? "" : "text-zinc-400"}
                >
                  {item.status === "approval" ? item.userName : "Cancel"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      {/* today section */}

      <DialogWrapper
        show={showDialog}
        setShow={setShowDialog}
        userSide="business"
        dialogState={dialogState}
        setDialogState={setDialogState}
      />
    </div>
  );
};

export default BusinessProfile;
