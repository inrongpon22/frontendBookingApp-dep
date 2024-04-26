import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import { app_api, fetcher } from "../../helper/url";
import { Slideshow } from "../../components/shop-details/Slideshow";
// icons
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { useState } from "react";
import DialogWrapper from "../../components/dialog/DialogWrapper";
import { Toast } from "../../helper/alerts";

const BusinessProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [dialogState, setDialogState] = useState<string | undefined>(
    "business-more-options"
  );

  const { data: busiDatas } = useSWR(
    id && `${app_api}/business/${id}`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const { data: busiById } = useSWR(
    id && `${app_api}/serviceByBusinessId/${id}`,
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
            Today <b className="text-deep-blue">0</b>
          </span>
          <span>
            Monthly <b className="text-deep-blue">0</b>
          </span>
          <span>
            Total visitors <b className="text-deep-blue">0</b>
          </span>
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="text-white border bg-deep-blue rounded-lg p-2"
            onClick={() => {
              Toast.fire({
                icon: "info",
                title: "Coming Soon",
              });
            }}
          >
            <CalendarMonthIcon />
            Overview
          </button>
          <button
            type="button"
            className=" border rounded-lg p-2"
            onClick={() => navigate("/serviceInfo")}
          >
            <EditOutlinedIcon />
            Edit
          </button>
          <button
            type="button"
            className="border rounded-lg p-2"
            onClick={() => setShowDialog(true)}
          >
            <MoreHorizOutlinedIcon />
          </button>
        </div>
      </div>
      <div className="px-5">
        <span className="text-[14px] font-semibold">Services</span>
        <div className="flex flex-col gap-4 my-5">
          {busiById?.map((item: any, index: number) => {
            return (
              <div
                key={index}
                className="flex justify-between border rounded-lg p-3 cursor-pointer hover:bg-gray-100"
                onClick={() => navigate(`/booking-approval/${id}/${item.id}`)}
              >
                <p className="flex flex-col gap-1">
                  <span className="text-[14px] font-semibold">
                    {item.title}
                  </span>
                  <span>
                    {item.openTime.slice(0, -3)} - {item.closeTime.slice(0, -3)}
                  </span>
                </p>
                <p className="flex flex-col gap-1 text-end">
                  <span className="text-[14px] font-semibold">6 of 10</span>
                  <span className="text-green-400">4 pending</span>
                </p>
              </div>
            );
          })}
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
