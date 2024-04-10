import { useEffect, useState } from "react";
import moment from "moment";
// icons
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const Calendar = () => {
  const [calendar, setCalendar] = useState({
    start: moment(),
    end: moment().add(10, "day"),
  });
  // get calendar date for custom render
  const [dateArr, setDateArr] = useState<object[]>([]);

  // handle select date on calendar
  const [selectedDate, setSelectedDate] = useState<any>({
    date: moment(),
  });

  const handleDateChange = (meth: string) => {
    switch (meth) {
      case "prev":
        setCalendar({
            start: calendar.start.subtract(10, "day"),
            end: calendar.end.subtract(10, "day"),
          });
        break;

      case "next":
        setCalendar({
          start: calendar.start.add(10, "day"),
          end: calendar.end.add(10, "day"),
        });
        break;

      default:
        break;
    }
  };

  // loop date with start and end date
  useEffect(() => {
    let newArr = [];
    for (let i = 0; i < calendar.end.diff(calendar.start, "day"); i++) {
      const element = calendar.start.clone().add(i, "day");
      newArr.push(element);
    }
    setDateArr(newArr);
  }, [calendar]);

  return (
    <div id="calendar" className="relative mt-5 p-5 col-span-2">
      <div className="flex justify-between">
        <button type="button" onClick={() => handleDateChange("prev")}>
          <ArrowBackIosIcon />
        </button>
        <div className="">{`${moment(dateArr[0])?.format("MMMM D")} - ${moment(
          dateArr[dateArr.length - 1]
        )?.format("MMMM D")}`}</div>
        <button type="button" onClick={() => handleDateChange("next")}>
          <ArrowForwardIosIcon />
        </button>
      </div>
      <div className="mt-5 grid grid-cols-5 gap-2">
        {dateArr.map((item: any, index: number) => {
          return (
            <div
              key={index}
              className={`h-[72px] flex flex-col justify-center items-center border rounded-lg cursor-pointer
                  ${
                    moment(selectedDate?.date).isSame(item, "day")
                      ? "border-2 border-[#003B95] bg-[#006CE31A] text-[#003B95]"
                      : ""
                  }`}
              onClick={() => setSelectedDate({ date: item })}
            >
              <p className="text-[14px] font-thin">{item.format("dd")}</p>
              <p className="text-[25px] font-semibold">{item.format("D")}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
