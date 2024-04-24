import { useContext } from "react";
import { ShopContext } from "../ShopDetailsPageWrapper";
import moment from "moment";

const TimeSlots = () => {
  const { selectedDate, setServiceById, serviceById, quantities } =
    useContext(ShopContext);

  return (
    <div id="times" className="mt-5 p-5 col-span-2">
      <h2 className="text-[17px] font-semibold">
        {moment(selectedDate.date).format("ll")}
      </h2>
      <div
        className={`grid ${
          serviceById?.bookingSlots.length > 1 ? "grid-cols-2" : " grid-cols-1"
        } gap-4 mt-2`}
      >
        {serviceById ? (
          serviceById?.bookingSlots.map((item: any, index: number) => {
            return (
              <div
                key={index}
                className={`flex flex-col border-2 rounded-lg text-center p-3 ${
                  item?.capacity >= quantities.quantities
                    ? " cursor-pointer"
                    : "text-[#8C8C8C] bg-[#8B8B8B33]"
                } ${
                  item.isSelected
                    ? "bg-[#006CE31A] border-[#003B95] text-[#003B95]"
                    : ""
                }`}
                onClick={() => {
                  if (item?.capacity >= quantities.quantities) {
                    setServiceById({
                      ...serviceById,
                      bookingSlots: serviceById?.bookingSlots.map((ii: any) => {
                        if (ii.startTime === item.startTime) {
                          return { ...ii, isSelected: true };
                        } else {
                          return { ...ii, isSelected: false };
                        }
                      }),
                    });
                  }
                }}
              >
                <span>
                  {item.startTime} - {item.endTime}
                </span>
                <span className="flex justify-center items-center text-[12px]">
                  <div
                    className={`h-[9px] w-[9px] mx-1 rounded ${
                      item?.capacity < 5
                        ? item?.capacity === 0
                          ? "bg-[#9C9C9C]"
                          : "bg-[#FEC84B]"
                        : "bg-[#12B76A]"
                    }`}
                  ></div>
                  {item?.capacity !== 0
                    ? `${item?.capacity} available`
                    : "Full"}
                </span>
              </div>
            );
          })
        ) : (
          <span>Loading...</span>
        )}
      </div>
    </div>
  );
};

export default TimeSlots;
