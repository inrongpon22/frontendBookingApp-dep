import moment from "moment";
import { useContext } from "react";
import { ApproveContext } from "../../pages/booking-approval/BookingApproval";
import { useTranslation } from "react-i18next";

interface cardTypes {
  data: {
    id: string;
    serviceId: string;
    phoneNumber: string;
    remark: string;
    startTime: string;
    endTime: string;
    approveAt: null;
    cancelAt: null;
    created_at: string;
    status: string;
    by: string;
    userName: string;
    bookingDate: string;
    guestNumber: string;
    userId: string;
    uuid: string;
    title: string;
    price: number;
    address: string;
  };
}

const RequestCards = ({ data }: cardTypes) => {
  const { setShow, approveRequested, setBookingDatas } =
    useContext(ApproveContext);

  const { t } = useTranslation();

  return (
    <div className="bg-white flex flex-col mb-2">
      <div className="flex justify-between items-center pt-4 px-4">
        <p className="text-[14px] font-semibold">
          {data.startTime.slice(0, -3)} - {data.endTime.slice(0, -3)}
        </p>
        <p
          className={`text-[10px] text-white font-semibold p-1 rounded-lg ${(() => {
            switch (data.status) {
              case "pending":
                return "bg-[#F0AD4E]";

              case "approval":
                return "bg-green-500";

              case "cancel":
                return "bg-red-500";

              default:
                return "bg-[#F0AD4E]";
            }
          })()}`}
        >
          {(() => {
            switch (data.status) {
              case "pending":
                return t("pending");

              case "approval":
                return t("approved");

              case "cancel":
                return t("cancelled");

              default:
                return t("pending");
            }
          })()}
        </p>
      </div>
      <div className="flex flex-col ps-4 pb-4 border-b border-gray-300">
        <p className="text-[14px]">
          {moment(data.bookingDate).format("dddd, DD MMMM YYYY")}
        </p>
        <p className="text-[14px]">
          {t("fragment:amount")}: {data.guestNumber} {t("fragment:people")}
        </p>
        <p className="text-[12px] text-[#808080]">
          {data.remark ? data.remark : "no remark"}
        </p>
      </div>
      <div
        className={`flex ${
          data.status === "pending" ? "justify-between" : "justify-center"
        } items-center p-4`}
      >
        <p
          className="text-[14px] text-deep-blue underline cursor-pointer"
          onClick={() => {
            setShow(true);
            setBookingDatas(data);
          }}
        >
          {t("desc:viewMoreDetails")}
        </p>
        <button
          type="button"
          className={`${
            data.status === "pending" ? "block" : "hidden"
          } px-6 py-2 text-[14px] font-semibold text-white rounded-lg bg-deep-blue`}
          onClick={() => approveRequested(data.id, data.serviceId)}
        >
          {t("approved")}
        </button>
      </div>
    </div>
  );
};

export default RequestCards;
