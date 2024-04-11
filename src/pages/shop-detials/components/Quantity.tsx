// styled
import { IconButton } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useContext } from "react";
import { ShopContext } from "../ShopDetailsPageWrapper";

const Quantity = () => {
  const { quantities, setQuantities, services } = useContext(ShopContext);

  // handle quantity chage
  const quantityChanges = (type: string) => {
    switch (type) {
      case "increase":
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
    <div id="quantity" className="flex justify-between items-center px-5">
      <h2 className="text-[17px] font-semibold">Number of guest(s)</h2>
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
            services.find((item: any) => item.isSelected === true)?.capacity ===
              quantities.quantities
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
