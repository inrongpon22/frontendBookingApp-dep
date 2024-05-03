import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import { app_api, fetcher } from "../../helper/url";
import { Slideshow } from "../../components/shop-details/Slideshow";
// icons
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LinkIcon from "@mui/icons-material/Link";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { useState } from "react";
import DialogWrapper from "../../components/dialog/DialogWrapper";
import { Toast, shareBookingLink } from "../../helper/alerts";
import { useTranslation } from "react-i18next";
import { Divider } from "@mui/material";

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

  const { data: serviceByBusinessId } = useSWR(
    businessId && `${app_api}/serviceByBusinessId/${businessId}`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const { data: getTotalReservByBusiness } = useSWR(
    businessId && `${app_api}/getReservationByBusinessId/${businessId}`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const { data: getTotalPendingByBusiness } = useSWR(
    businessId &&
      `${app_api}/getTotalNumPendingReservationByBusinessId/${businessId}`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return (
    <div className="flex flex-col h-dvh">
      <Slideshow data={busiDatas?.imagesURL} fixedHeight={300} />

      <div className="flex flex-col gap-2 p-5">
        <p className="text-[22px] font-semibold">{busiDatas?.title}</p>
        <p className="flex gap-5">
          <span>
            {t('totalPending')}{" "}
            <b className="text-deep-blue">
              {getTotalPendingByBusiness?.pendingnumber}
            </b>
          </span>
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex justify-center items-center text-[14px] text-white border bg-deep-blue rounded-lg p-2"
            onClick={() => {
              Toast.fire({
                icon: "info",
                title: "Coming Soon",
              });
            }}
          >
            <CalendarMonthIcon fontSize="small" />
            {t("button:overview")}
          </button>
          <button
            type="button"
            className="flex justify-center items-center text-[14px] border rounded-lg p-2"
            onClick={() => shareBookingLink(businessId)}
          >
            <LinkIcon fontSize="small" />
            {t("button:shareBookingLink")}
          </button>
          <button
            type="button"
            className="flex justify-center items-center border rounded-lg p-2"
            onClick={() => setShowDialog(true)}
          >
            <MoreHorizOutlinedIcon fontSize="small" />
          </button>
        </div>
      </div>
      <Divider />
      {/* <div style={{ height: "4px !important" }} className="bg-[#F7F7F7] mb-5" /> */}
      <div className="px-5 mt-3">
        <span className="text-[14px] font-semibold">{t("services")}</span>
        <div className="flex flex-col gap-4 my-5">
          {serviceByBusinessId?.length > 0 ? (
            serviceByBusinessId?.map((item: any, index: number) => {
              return (
                <div
                  key={index}
                  className="flex justify-between border rounded-lg p-3 cursor-pointer hover:bg-gray-100"
                  onClick={() =>
                    navigate(`/booking-approval/${businessId}/${item.id}`)
                  }
                >
                  <p className="flex flex-col gap-1">
                    <span className="text-[14px] font-semibold">
                      {item.title}
                    </span>
                    <span>
                      {item.openTime.slice(0, -3)} -{" "}
                      {item.closeTime.slice(0, -3)}
                    </span>
                    <span>
                      {item.daysOpen?.map((jj: string, kk: number) => {
                        return (
                          <span key={kk} className="text-[12px] mx-1">
                            {jj.slice(0, 3)}
                          </span>
                        );
                      })}
                    </span>
                  </p>
                  <p className="flex flex-col gap-1 text-end justify-end">
                    <span className="text-green-400">
                      {
                        getTotalReservByBusiness?.filter(
                          (ii: any) =>
                            ii.serviceId === item.id && ii.status === "pending"
                        )?.length
                      }{" "}
                      {t("pending")}
                    </span>
                  </p>
                </div>
              );
            })
          ) : (
            <span className="text-[14px] text-gray-400">
              {t("error:noServicesYet")}
            </span>
          )}
        </div>
      </div>
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
