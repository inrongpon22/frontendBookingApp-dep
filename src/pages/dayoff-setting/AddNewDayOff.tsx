import { ReactElement, useMemo, useState } from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import { app_api } from "../../helper/url";
import axios from "axios";
// styled
import { Checkbox, Divider } from "@mui/material";
// icons
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
// components
import Header from "../service/components/Header";

const AddNewDayOff = () => {
  const { businessId } = useParams();
  const { t } = useTranslation();

  const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
  const [services, setServices] = useState<any[]>([]);

  const handleCheckedState = (): ReactElement => {
    switch (services.every((service) => service.isSelected)) {
      case true:
        return (
          <p
            className="flex items-center underline cursor-pointer"
            onClick={() =>
              setServices(
                services.map((item: any) => {
                  return { ...item, isSelected: false };
                })
              )
            }
          >
            <Checkbox
              size="small"
              checked={isSelectAll}
              className="invisible"
            />
            Clear
          </p>
        );

      case false:
        return (
          <p className="flex items-center">
            Select all
            <Checkbox
              size="small"
              checked={isSelectAll}
              onChange={(e) => {
                setIsSelectAll(e.target.checked);
                setServices(
                  services.map((item: any) => {
                    return { ...item, isSelected: e.target.checked };
                  })
                );
              }}
            />
          </p>
        );
    }
  };

  const { error: serviceError } = useSWR(
    `${app_api}/serviceByBusinessId/${businessId}`,
    (url: string) =>
      axios
        .get(url, {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        })
        .then((res) =>
          setServices(
            res.data.map((item: any) => {
              return { ...item, isSelected: true };
            })
          )
        ),
    {
      revalidateOnFocus: false,
    }
  );

  useMemo(() => {
    const allSelected = services.every((service) => service.isSelected);
    setIsSelectAll(allSelected);
  }, [services]);

  if (serviceError) return <span>API error...</span>;

  return (
    <div className="flex flex-col h-dvh">
      {/* headers */}
      <div className="pr-4 pl-4 pt-6">
        <Header context={t("title:addDayOff")} />
      </div>
      <Divider sx={{ marginTop: "16px", width: "100%" }} />
      {/* headers */}

      {/* content */}
      <div className="p-5 bg-white text-[14px]">
        <div className="flex justify-between">
          <p className="flex items-center gap-2 font-semibold">
            Choose service
          </p>
          {handleCheckedState()}
        </div>
        <div className="flex flex-col gap-3 mt-3">
          {services?.map((item: any, index: number) => (
            <div
              key={index}
              className={`flex justify-between items-center border rounded-lg p-4 cursor-pointer ${
                item.isSelected
                  ? "border-2 border-deep-blue bg-deep-blue bg-opacity-10"
                  : ""
              }`}
              onClick={() => {
                setServices(
                  services.map((ii: any) => {
                    if (item.id === ii.id) {
                      return { ...item, isSelected: !item.isSelected };
                    } else {
                      return item;
                    }
                  })
                );
              }}
            >
              <div className="flex flex-col gap-1">
                <p className="font-bold text-deep-blue">{item.title}</p>
                <p className="flex items-center gap-1 text-deep-blue">
                  <CalendarTodayIcon fontSize="small" />
                  {item.openTime.slice(0, -3)} - {item.closeTime.slice(0, -3)}
                </p>
              </div>
              <Checkbox size="small" checked={item.isSelected} />
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col items-center mt-auto inset-x-0 gap-2">
      <Divider sx={{ marginTop: "16px", width: "100%" }} />
        <button
          type="button"
          className="w-11/12 p-3 my-5 text-white text-[14px] bg-deep-blue rounded-lg font-semibold"
        >
          {t("button:next")}
        </button>
      </div>
      {/* content */}
    </div>
  );
};

export default AddNewDayOff;
