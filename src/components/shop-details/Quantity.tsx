import { useTranslation } from "react-i18next";
// styled
import { IconButton } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
// import { useContext } from "react";

interface QuantityProps {
  quantities: any;
  setQuantities: Function;
  serviceById: any;
  selectedDate: any;
  setServiceById: Function;
}

const Quantity = ({
  quantities,
  setQuantities,
  serviceById,
  selectedDate,
  setServiceById,
}: QuantityProps) => {

  // i18n
  const { t } = useTranslation();

  // find available time slots from daysOpen and availableFromDate
  // const slotArrays = serviceById?.bookingSlots.find(
  //   (item: any) =>
  //     item.daysOpen?.includes(selectedDate.date.format("dddd")) &&
  //     selectedDate.date.isAfter(item.availableFromDate)
  // );

  // handle quantity chage
  const quantityChanges = (type: string) => {
    switch (type) {
      case "increase":
        setServiceById({
          ...serviceById,
          bookingSlots: serviceById?.bookingSlots.map((item: any) => {
            if (item.daysOpen.includes(selectedDate.date.format("dddd"))) {
              return {
                ...item,
                slotsTime: item.slotsTime?.map((mm: any) => {
                  return { ...mm, isSelected: false };
                }),
              };
            } else {
              return item;
            }
          }),
        });
        setQuantities({
          ...quantities,
          quantities:
            quantities.max > quantities.quantities
              ? quantities.quantities + 1
              : quantities.quantities,
        });
        break;

      case "decrease":
        setQuantities({
          ...quantities,
          quantities:
            quantities.quantities > quantities.min
              ? quantities.quantities - 1
              : 0,
        });
        break;

      default:
        break;
    }
  };

  return (
    <div id="quantity" className="flex justify-between items-center">
      <h2 className="text-[17px] font-semibold">{t("numberOfGuests")}</h2>
      <div className="w-[140px] flex justify-around items-center p-2 border border-black rounded-lg">
        <IconButton
          disabled={quantities.quantities === quantities.min}
          aria-label="delete"
          size="small"
          onClick={() => quantityChanges("decrease")}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        <span className="px-5 text-[#003B95] text-[20px] font-semibold">
          {quantities.quantities}
        </span>
        <IconButton
          disabled={
            quantities.quantities === quantities.max ||
            serviceById?.bookingSlots.find(
              (item: any) => item.isSelected === true
            )?.capacity === quantities.quantities
          }
          aria-label="delete"
          size="small"
          onClick={() => quantityChanges("increase")}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </div>
    </div>
  );
};

export default Quantity;
