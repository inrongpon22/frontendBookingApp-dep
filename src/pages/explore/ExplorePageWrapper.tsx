import { useNavigate } from "react-router-dom";
// components
import ExploreHeaderWrapper from "./ExploreHeaderWrapper";
// mock up datas
import { exploreDatas } from "./exploreDatas";

const ExplorePageWrapper = () => {
  const navigate = useNavigate();
  return (
    <div className="p-4">
      <ExploreHeaderWrapper />
      <h1 className="text-[25px] font-semibold mt-5">Explore</h1>
      <input
        className="border border-[#000000] rounded-lg p-3 mt-3 w-full"
        placeholder="Hair cut, Restaurant, Tennis Court & more"
      />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
        {exploreDatas.map((item: any, index: number) => {
          return (
            <div
              key={index}
              className="cursor-pointer"
              onClick={() => navigate(`/details/${item.id}`)}
            >
              <img src={item.image} className="rounded" />
              <label htmlFor="" className="text-[14px] font-semibold">
                {item.title}
              </label>
              <p className="text-[14px]">{`${item.openTime} - 
                ${item.closeTime}`}</p>
              <p className="text-[14px]">{item.contact}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExplorePageWrapper;
