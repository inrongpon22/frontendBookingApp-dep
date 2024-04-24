// i18n
import { useTranslation } from "react-i18next";
// context
import { useContext } from "react";
import { ShopContext } from "../../pages/shop-detials/ShopDetailsPageWrapper";

const ServiceOptions = () => {
  const { services, setServices } = useContext(ShopContext);

  // i18n
  const { t } = useTranslation();

  return (
    <div id="service-option" className="p-5">
      <h2 className="text-[20px] font-semibold">{t("serviceOptions")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {services?.map((item: any, index: number) => {
          return (
            <div
              key={index}
              className={`border-2 rounded-lg p-5 ${
                item.isSelected
                  ? "border-[#003B95] bg-[#006CE31A] text-[#003B95]"
                  : ""
              }`}
              onClick={() => {
                setServices(
                  services.map((ii: any) => {
                    if (ii.id === item.id) {
                      return { ...ii, isSelected: true };
                    } else {
                      return { ...ii, isSelected: false };
                    }
                  })
                );
              }}
            >
              <div className="">
                <p className="flex justify-between">
                  <span className="font-bold text-[14px]">{item.title}</span>
                  <span>
                    <span className="font-bold text-[14px]">{item.price}</span>
                    <span className="font-normal"> / person</span>
                  </span>
                </p>
                <div className="">
                  <p className="font-normal text-[14px]">{item.description} </p>
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
