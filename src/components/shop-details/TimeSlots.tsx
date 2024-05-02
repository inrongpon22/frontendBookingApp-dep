import { useContext } from "react";
import { ShopContext } from "../../pages/shop-detials/ShopDetailsPageWrapper";
import moment from "moment";
import { useTranslation } from "react-i18next";

const TimeSlots = () => {
  const { selectedDate, setServiceById, serviceById, quantities } =
    useContext(ShopContext);

  const { t } = useTranslation();

  const slotArrays = serviceById?.bookingSlots.find(
    (item: any) =>
      item.daysOpen?.includes(selectedDate.date.format("dddd")) &&
      selectedDate.date.isAfter(item.availableFromDate)
  );

  return (
    <div id="times" className="mt-5 p-5 col-span-2">
      <h2 className="text-[17px] font-semibold">
        {moment(selectedDate.date).format("ll")}
        <p>{t("time")}</p>
      </h2>
      <div
        className={`grid gap-4 mt-2 ${
          slotArrays
            ? slotArrays?.slotsTime.length === 1
              ? "grid-cols-1"
              : "grid-cols-2"
            : ""
        }`}
      >
        {slotArrays?.slotsTime.length > 0 ? (
          slotArrays?.slotsTime.map((ii: any, jj: number) => {
            return (
              <div
                key={jj}
                className={`flex flex-col border-2 rounded-lg text-center p-3 ${
                  ii?.capacity >= quantities.quantities
                    ? " cursor-pointer"
                    : "text-[#8C8C8C] bg-[#8B8B8B33]"
                } ${
                  ii.isSelected
                    ? "bg-[#006CE31A] border-[#003B95] text-[#003B95]"
                    : ""
                }`}
                onClick={() => {
                  if (ii?.capacity >= quantities.quantities) {
                    setServiceById({
                      ...serviceById,
                      bookingSlots: serviceById?.bookingSlots.map((kk: any) => {
                        if (
                          kk.daysOpen.includes(selectedDate.date.format("dddd"))
                        ) {
                          return {
                            ...kk,
                            slotsTime: kk.slotsTime?.map((mm: any) => {
                              if (mm.startTime === ii.startTime) {
                                return { ...mm, isSelected: true };
                              } else {
                                return { ...mm, isSelected: false };
                              }
                            }),
                          };
                        } else {
                          return kk;
                        }
                      }),
                    });
                  }
                }}
              >
                <span>
                  {ii.startTime} - {ii.endTime}
                </span>
                <span className="flex justify-center items-center text-[12px]">
                  <div
                    className={`h-[9px] w-[9px] mx-1 rounded ${
                      ii?.capacity < 5
                        ? ii?.capacity === 0
                          ? "bg-[#9C9C9C]"
                          : "bg-[#FEC84B]"
                        : "bg-[#12B76A]"
                    }`}
                  ></div>
                  {ii?.capacity !== 0
                    ? `${ii?.capacity} ${t("available")}`
                    : t("full")}
                </span>
              </div>
            );
          })
        ) : (
          <span>{t("error:noTimeSlots")}...</span>
        )}
      </div>
    </div>
  );
};

export default TimeSlots;
