// styled
import { Chip } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useContext } from "react";
import { ShopContext } from "../ShopDetailsPageWrapper";

// interface ServiceOptionTypes{
//     services: any;
//     setServices: any;
//     quantities: any;
// }

const ServiceOptions = () => {
  const { services, setServices, quantities } = useContext(ShopContext);
  return (
    <div id="service-option" className="p-5">
      <h2 className="text-[20px] font-semibold">Service Option</h2>
      <div className="grid grid-cols-1 gap-4 mt-2">
        {services?.map((item: any, index: number) => {
          return (
            <div
              key={index}
              className={`border-2 rounded-lg p-5 ${
                item.isSelected
                  ? "border-[#003B95] bg-[#006CE31A] text-[#003B95]"
                  : ""
              } ${
                quantities.quantities > item.capacity
                  ? "bg-gray-400 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              onClick={() => {
                if (quantities.quantities <= item.capacity) {
                  setServices(
                    services.map((ii: any) => {
                      if (ii.id === item.id) {
                        return { ...ii, isSelected: true };
                      } else {
                        return { ...ii, isSelected: false };
                      }
                    })
                  );
                }
              }}
            >
              <div className="">
                <p className="font-semibold">{item.title} </p>
                <p className="font-thin">{item.description} </p>
                <div className="">
                  <Chip
                    className="mt-1"
                    icon={<AttachMoneyIcon fontSize="small" />}
                    label={`Start at ${item.price} ${item.currency}`}
                  />
                  <Chip
                    className="mt-1 ms-1"
                    icon={<PersonIcon fontSize="small" />}
                    label={`${item.capacity} Available`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceOptions;
