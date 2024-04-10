import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
// components
import ExploreHeaderWrapper from "./ExploreHeaderWrapper";
// helper
import { app_api } from "../../helper/url";
import axios from "axios";
// icons
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";

const ExplorePageWrapper = () => {
  const navigate = useNavigate();

  const [bussiness, setBussiness] = useState([]);

  useMemo(() => {
    axios.get(`${app_api}/business`).then((res) => {
      if (res.status === 200) {
        setBussiness(res.data);
      }
    });
  }, []);

  return (
    <div className="p-4">
      <ExploreHeaderWrapper />
      <h1 className="text-[25px] font-semibold mt-5">Explore</h1>
      <input
        className="border border-[#000000] rounded-lg p-3 mt-3 w-full"
        placeholder="Hair cut, Restaurant, Tennis Court & more"
      />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
        {bussiness.map((item: any, index: number) => {
          return (
            <div
              key={index}
              className="cursor-pointer"
              onClick={() => navigate(`/details/${item.id}`)}
            >
              <img src="https://placehold.jp/164x164.png" className="rounded" />
              <label htmlFor="" className="text-[14px] font-semibold">
                {item.title}
              </label>
              <p className="text-[14px]">
                <LocalPhoneIcon fontSize="small" />
                {item.phoneNumber}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExplorePageWrapper;
