import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import { app_api, fetcher } from "../../helper/url";
// icons
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useState } from "react";
import DialogWrapper from "../../components/dialog/DialogWrapper";
// import { shareBookingLink } from "../../helper/alerts";
import { useTranslation } from "react-i18next";
import { Badge } from "@mui/material";
// import toast from "react-hot-toast";
import { dayOfWeek } from "../../helper/daysOfWeek";
import axios from "axios";

const BusinessProfile = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const {
    t,
    i18n: { language },
  } = useTranslation();

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
    (url: string) =>
      axios
        .get(url, {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        })
        .then(async (res: any) =>
          res.data.sort((a: any, b: any) => a.id - b.id)
        ),
    {
      revalidateOnFocus: false,
    }
  );

  // const { data: getTotalPendingByBusiness } = useSWR(
  //   businessId &&
  //     `${app_api}/getTotalNumPendingReservationByBusinessId/${businessId}`,
  //   fetcher,
  //   {
  //     revalidateOnFocus: false,
  //   }
  // );

  return (
    <div className="flex flex-col h-dvh">
      {/* <Slideshow data={busiDatas?.imagesURL} fixedHeight={300} /> */}
      {/* <button
            type="button"
            className="flex justify-center items-center border rounded-lg p-2"
            onClick={() => setShowDialog(true)}
          >
            <MoreHorizOutlinedIcon fontSize="small" />
          </button> */}
      <div className="flex flex-col gap-2 p-5">
        <p className="text-[22px] font-semibold">{busiDatas?.title}</p>
        <div className="flex">
          <Badge color="secondary" variant="dot">
            <NotificationsActiveOutlinedIcon fontSize="small" />
          </Badge>
        </div>
      </div>
      {/* <Divider /> */}
      <div className="px-5 mt-3">
        <span className="text-[14px] font-semibold">{t("services")}</span>
        <div className="flex flex-col gap-4 my-5">
          {serviceByBusinessId?.length > 0 ? (
            serviceByBusinessId?.map((item: any, index: number) => {
              let daysOpenArr: string[] = [];

              for (let i = 0; i < item.bookingSlots.length; i++) {
                const element = item.bookingSlots[i];
                daysOpenArr.push(...element.daysOpen);
              }

              return (
                <div
                  key={index}
                  className="flex justify-between border rounded-lg p-3 cursor-pointer hover:bg-gray-100"
                  onClick={() =>
                    navigate(`/booking-approval/${businessId}/${item.id}`, {
                      state: item,
                    })
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
                      {daysOpenArr?.map((day: string, jj: number) => {
                        return (
                          <span key={jj} className="text-[12px] mx-1">
                            {dayOfWeek(language)?.find((ii) => ii.value === day)
                              ?.name ?? ""}
                          </span>
                        );
                      })}
                    </span>
                    <span className="flex gap-1">
                      <span className="px-2 py-1 bg-[#F0AD4E] text-white text-[12px] rounded-lg">
                        <span className="mx-1">{item.totalpending}</span>
                        {t("pending")}
                      </span>
                      <span className="px-2 py-1 bg-deep-blue bg-opacity-10 text-deep-blue text-[12px] rounded-lg">
                        <span className="mx-1">{item.totalapproved}</span>
                        {t("approved")}
                      </span>
                    </span>
                  </p>
                  <p className="flex flex-col gap-1 text-end justify-center">
                    <NavigateNextIcon />
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
