import { useContext } from "react";
import { ApproveContext } from "../../pages/booking-approval/BookingApproval";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Divider } from "@mui/material";

const BookingApprovalSummary = () => {
  const { bookingDatas, approveRequested, setDialogState } =
    useContext(ApproveContext);

  const { t } = useTranslation();

  const BookingDataLists: { label: string; text: string }[] = [
    {
      label: `${t("services")}:`,
      text: bookingDatas?.title,
    },
    {
      label: `${t("date")}:`,
      text: moment(bookingDatas?.bookingDate).format("dddd, DD MMMM YYYY"),
    },
    {
      label: `${t("time")}:`,
      text: `${bookingDatas?.startTime.slice(
        0,
        -3
      )} - ${bookingDatas?.endTime.slice(0, -3)}`,
    },
    {
      label: `${t("price")}:`,
      text: `${bookingDatas?.price} ฿`,
    },
  ];

  const GuestDataLists: { label: string; text: string }[] = [
    {
      label: `${t('bookingName')}:`,
      text: bookingDatas?.userName,
    },
    {
      label: `${t('phoneNumbers')}:`,
      text: bookingDatas?.phoneNumber,
    },
    {
      label: `${t('numberOfGuest')}:`,
      text: bookingDatas?.guestNumber,
    },
    {
      label: `${t('note')}:`,
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
          <Divider />
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
            {t("button:approve")}
          </button>
          <button
            type="button"
            className="border p-3 rounded-lg"
            onClick={() => setDialogState("booking-approval-reject")}
          >
            {t("button:reject")}
          </button>
        </div>
      </div>
    </>
  );
};

export default BookingApprovalSummary;
