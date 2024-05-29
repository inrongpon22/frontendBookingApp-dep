import React, { useContext } from "react";
import { ApproveContext } from "../../pages/booking-approval/BookingApproval";
import { useTranslation } from "react-i18next";
import { GlobalContext } from "../../contexts/BusinessContext";

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

const RequestCards = ({ data }: cardTypes): React.ReactElement => {
  const { setBookingDatas } = useContext(ApproveContext);

  const {setShowDialog} = useContext(GlobalContext);

  const { t } = useTranslation();

  return (
    <div className="bg-white flex flex-col border border-gray-300 rounded-lg">
      <div className="flex justify-between items-center pt-4 px-4">
        <p className="text-[14px] font-semibold">
          <span>
            {data.startTime.slice(0, -3)} - {data.endTime.slice(0, -3)}
          </span>
          <span className="text-[14px] mx-1">
            ({data.guestNumber} {t("fragment:people")})
          </span>
        </p>
      </div>
      <div className="flex flex-col ps-4 pb-4">
        <p className="text-[12px] text-[#808080]">
          {data.remark ? data.remark : "no remark"}
        </p>
        {/* <p className="text-[12px] text-[#808080]">
          {data.status}
        </p> */}
      </div>
      <div className="flex justify-end items-center px-4 py-2">
        <button
          type="button"
          className="px-6 py-2 text-[14px] font-semibold text-white rounded-lg bg-deep-blue bg-opacity-80"
          onClick={() => {
            setShowDialog(true);
            setBookingDatas(data);
          }}
        >
          {t("desc:viewMoreDetails")}
        </button>
      </div>
    </div>
  );
};

export default RequestCards;
