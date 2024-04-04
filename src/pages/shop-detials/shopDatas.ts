import moment from "moment";

export const peopleQuantities = [
  {
    id: 1,
    title: "Guest",
    desc: "Number of guest",
    quantities: 0,
    max: 10,
    min: 0,
  },
];

export const serviceOptions = [
  {
    id: 1,
    label: "Regular Cut",
    desc: "Start at 200 THB",
    availability: 8,
    isAvailiable: true,
    isSelected: true,
  },
  {
    id: 2,
    label: "Premium",
    desc: "Start at 500 THB",
    availability: 3,
    isAvailiable: true,
    isSelected: false,
  },
];

export const getTimeIntervals = (startTime: string, endTime: string, minutes:number) => {
  const timeIntervals = [];
  const start = moment(startTime, "HH:mm");
  const end = moment(endTime, "HH:mm");

  while (start <= end) {
    // timeIntervals.push(start.format("HH:mm"));
    timeIntervals.push({
      label: `${start.format("HH:mm")} - ${start.add(minutes, "minutes").format("HH:mm")}`,
      isAvailiable: true,
      isSelected: false,
    });
    start.add(minutes, "minutes");
  }

  return timeIntervals;
};
