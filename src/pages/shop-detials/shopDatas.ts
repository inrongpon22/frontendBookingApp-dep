import moment from "moment";

export const getTimeIntervals = (
  startTime: string | undefined,
  endTime: string | undefined,
  minutes: number | undefined
) => {
  const timeIntervals = [];
  const start = moment(startTime, "HH:mm");
  const end = moment(endTime, "HH:mm");

  while (start <= end) {
    // timeIntervals.push(start.format("HH:mm"));
    timeIntervals.push({
      label: `${start.format("HH:mm")} - ${start
        .add(minutes, "minutes")
        .format("HH:mm")}`,
      isSelected: false,
      capacity: Math.floor(Math.random() * 11),
    });
  }

  return timeIntervals;
};
