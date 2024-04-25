import { useContext } from "react";
import { ApproveContext } from "../../pages/booking-approval/BookingApproval";
import moment from "moment";

const BookingApprovalSummary = () => {
  const { bookingDatas, approveRequested, setDialogState } =
    useContext(ApproveContext);

  const BookingDataLists: { label: string; text: string }[] = [
    {
      label: "Service:",
      text: bookingDatas?.title,
    },
    {
      label: "Date:",
      text: moment(bookingDatas?.bookingDate).format("dddd, DD MMMM YYYY"),
    },
    {
      label: "Time:",
      text: `${bookingDatas?.startTime.slice(
        0,
        -3
      )} - ${bookingDatas?.endTime.slice(0, -3)}`,
    },
    {
      label: "Price:",
      text: `${bookingDatas?.price} ฿`,
    },
  ];

  const GuestDataLists: { label: string; text: string }[] = [
    {
      label: "Name:",
      text: bookingDatas?.userName,
    },
    {
      label: "Phone Numbers:",
      text: bookingDatas?.phoneNumber,
    },
    {
      label: "Number of guest:",
      text: bookingDatas?.guestNumber,
    },
    {
      label: "Note:",
      text: bookingDatas?.remark,
    },
  ];

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex flex-col gap-3">
          {BookingDataLists?.map((item: any, index: number) => {
            return (
              <div key={index} className="flex justify-between">
                <span className="text-gray-500">{item.label}</span>
                <span className="text-[14px] font-semibold">{item.text}</span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 mt-5">
          {GuestDataLists?.map((item: any, index: number) => {
            return (
              <div key={index} className="flex justify-between">
                <span className="text-gray-500">{item.label}</span>
                <span className="text-[14px] font-semibold text-end">
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 mt-auto">
          <button
            type="button"
            className="bg-deep-blue text-white p-3 rounded-lg"
            onClick={() =>
              approveRequested(bookingDatas?.id, bookingDatas?.serviceId)
            }
          >
            Approve
          </button>
          <button
            type="button"
            className="border p-3 rounded-lg"
            onClick={() => setDialogState("booking-approval-reject")}
          >
            Reject
          </button>
        </div>
      </div>
    </>
  );
};

export default BookingApprovalSummary;
