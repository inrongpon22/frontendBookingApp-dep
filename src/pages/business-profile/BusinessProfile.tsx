import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import { app_api, fetcher } from "../../helper/url";
import { Slideshow } from "../../components/shop-details/Slideshow";
import { Divider } from "@mui/material";

const BusinessProfile = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { data } = useSWR(`${app_api}/business/${id}`, fetcher, {
    revalidateOnFocus: false,
  });

  console.log(data);

  return (
    <div className="flex flex-col h-dvh">
      <Slideshow data={data?.imagesURL} fixedHeight={300} />

      <div className="flex flex-col gap-2 p-5">
        <p className="text-[22px] font-semibold">Tenis With U</p>
        <p className="flex gap-5">
          <span>
            Today <b>0</b>
          </span>
          <span>
            Monthly <b>0</b>
          </span>
          <span>
            Profit <b>$0</b>
          </span>
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="text-white border bg-deep-blue rounded-full p-2"
          >
            Overview
          </button>
          <button
            type="button"
            className="text-white border bg-deep-blue rounded-full p-2"
          >
            Edit
          </button>
          <button
            type="button"
            className="text-white border bg-deep-blue rounded-full p-2"
          >
            ...
          </button>
        </div>
        <Divider />
      </div>
      <div className="">
        <p>
          <span>Services</span>
          <span>5 pending</span>
          <span>10 blocked</span>
        </p>
      </div>
      <button
        type="button"
        onClick={() => navigate("/serviceInfo")}
        className="text-white bg-deep-blue rounded-lg p-2 w-1/3"
      >
        Create service
      </button>
    </div>
  );
};

export default BusinessProfile;
