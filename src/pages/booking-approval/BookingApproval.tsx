import { useEffect } from "react";
import useSWR from "swr";
import { app_api, fetcher } from "../../helper/url";
import { useParams } from "react-router-dom";
import RequestCards from "../../components/business-approval/requestCards";

const BookingApproval = () => {
  const { id } = useParams();

  // const { data: getBusinesses } = useSWR(`${app_api}/`, fetcher);

  useEffect(() => {
    document.title = "Booking Approval";
  }, []);

  return (
    <div className="h-dvh flex flex-col">
      <p className="shadow p-4 font-semibold text-[14px]">Business Name</p>
      <div className="">
        <p className="p-4 text-[14px]">Booking request(s)</p>
        <RequestCards />
      </div>
    </div>
  );
};

export default BookingApproval;
