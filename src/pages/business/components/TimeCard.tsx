import { alpha, Box } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { IServiceTime } from "../interfaces/service";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export default function TimeCard() {
  const navigate = useNavigate();
  const { businessId } = useParams();
  const [timeDetails, setTimeDetails] = useState<IServiceTime[]>([]);
  const [refresh, setRefresh] = useState(0);

  const { t } = useTranslation();

  const handleDeleteSlot = (index: number) => {
    timeDetails.splice(index, 1);
    localStorage.setItem("serviceTime", JSON.stringify(timeDetails.splice(index, 1)));
    if (timeDetails.length == 0) {
      localStorage.removeItem("serviceTime");
      navigate(`/serviceTime/${businessId}`);
    }
    setRefresh(pre => pre + 1);
  };

  useEffect(() => {
    const serviceTime = JSON.parse(
      localStorage.getItem("serviceTime") || "[{}]"
    ) as IServiceTime[];
    setTimeDetails(serviceTime);
  }, [refresh]);


  return (
    <>
      {timeDetails.map((item, index) => (
        <div
          key={index}
          style={{ borderColor: `${alpha("#000000", 0.2)}` }}
          className="flex flex-col p-3 text-sm border rounded-lg focus:outline-none"
        >
          <div className="flex justify-between">
            <div style={{ fontSize: "14px" }}>
              {item.availableFromDate} -{" "}
              {item.availableToDate == "" ? t("present") : item.availableToDate}
            </div>
            <div className="flex gap-1">
              <Box
                sx={{
                  display: "flex",
                  height: "32px",
                  padding: "8px",
                  borderRadius: "8px",
                  background: `${alpha("#020873", 0.1)}`,
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <DeleteOutlineOutlinedIcon
                  onClick={() => handleDeleteSlot(index)}
                  sx={{
                    cursor: "pointer",
                    color: "#020873",
                    width: "20px",
                    height: "20px",
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  height: "32px",
                  padding: "8px",
                  borderRadius: "8px",
                  background: `${alpha("#020873", 0.1)}`,
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <EditOutlinedIcon
                  onClick={() => navigate(`/serviceTime/${businessId}?edit=${index}`)}
                  sx={{
                    cursor: "pointer",
                    color: "#020873",
                    width: "20px",
                    height: "20px",
                  }}
                />
              </Box>

            </div>


          </div>
          <div style={{ fontSize: "14px", marginTop: "-10px" }}>
            {item?.daysOpen?.map((day) => day + ", ")}
          </div>
          {item?.manualCapacity.map((element, index) => (
            <div key={index}>
              <div className="flex justify-between">
                <li className="p-2 list-disc">
                  {element.startTime} - {element.endTime}
                </li>
                <div
                  style={{ color: alpha("#000000", 0.5) }}
                  className="flex justify-between gap-3 items-center p-3"
                >
                  {`(${element.capacity} guest)`}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
