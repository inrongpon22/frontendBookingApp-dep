import moment from "moment";
import { useContext } from "react";
import { ApproveContext } from "../../pages/booking-approval/BookingApproval";

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

  return (
    <div className="bg-white flex flex-col mb-2">
      <div className="flex justify-between items-center pt-4 px-4">
        <p className="text-[14px] font-semibold">{data.title}</p>
        <p className="text-[14px] font-semibold">฿{data.price}</p>
      </div>
      <div className="flex flex-col ps-4 pb-4 border-b border-gray-300">
        <p className="text-[14px]">
          {data.startTime.slice(0, -3)} ({data.guestNumber})
        </p>
        <p className="text-[14px]">
          {moment(data.bookingDate).format("dddd, DD MMMM YYYY")}
        </p>
      </div>
      <div className="flex justify-between items-center p-4">
        <p
          className="text-[14px] text-deep-blue underline cursor-pointer"
          onClick={() => {
            setShow(true);
            setBookingDatas(data);
          }}
        >
          view more details
        </p>
        <button
          type="button"
          className="px-4 py-2 text-[14px] text-white rounded bg-deep-blue"
          onClick={() => approveRequested(data.id, data.serviceId)}
        >
          Approve
        </button>
      </div>
    </div>
  );
};

export default RequestCards;
