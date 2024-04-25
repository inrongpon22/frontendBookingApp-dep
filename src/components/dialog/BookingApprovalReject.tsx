import { useContext } from "react";
import { ApproveContext } from "../../pages/booking-approval/BookingApproval";

const BookingApprovalReject = () => {
  const { bookingDatas, rejectRequested } = useContext(ApproveContext);

  return (
    <div className="flex flex-col gap-4 h-full">
      <p>Tell the customer why they were rejected.</p>
      <textarea
        name=""
        id=""
        rows={4}
        placeholder="Additional note (optional)"
        className="w-full border rounded-lg p-3"
      ></textarea>
      <button
        type="button"
        className="bg-deep-blue text-white rounded-lg py-3 mt-auto"
        onClick={() =>
          rejectRequested(bookingDatas?.id, bookingDatas?.serviceId)
        }
      >
        Reject
      </button>
    </div>
  );
};

export default BookingApprovalReject;
