import moment from "moment";

export const scheduleLists = {
  currMonth: {},
  weekLists: [
    {
      id: 1,
      label: "Sun",
      date: 31,
      isAvailiable: false,
      isSelected: false,
    },
    {
      id: 2,
      label: "Mon",
      date: 1,
      isAvailiable: false,
      isSelected: false,
    },
    {
      id: 3,
      label: "Tue",
      date: 2,
      isAvailiable: true,
      isSelected: false,
    },
    {
      id: 4,
      label: "Wed",
      date: 3,
      isAvailiable: true,
      isSelected: false,
    },
    {
      id: 5,
      label: "Thu",
      date: 4,
      isAvailiable: true,
      isSelected: false,
    },
    {
      id: 6,
      label: "Fri",
      date: 5,
      isAvailiable: true,
      isSelected: true,
    },
    {
      id: 7,
      label: "Sat",
      date: 6,
      isAvailiable: false,
      isSelected: false,
    },
  ],
};

export const times = [
  { id: 1, label: "9:30", isAvailiable: false, isSelected: false },
  {
    id: 2,
    label: "10:00",
    isAvailiable: true,
    isSelected: false,
  },
  {
    id: 3,
    label: "10:30",
    isAvailiable: true,
    isSelected: false,
  },
  {
    id: 4,
    label: "11:00",
    isAvailiable: true,
    isSelected: false,
  },
  {
    id: 5,
    label: "11:30",
    isAvailiable: true,
    isSelected: false,
  },
  {
    id: 6,
    label: "12:00",
    isAvailiable: true,
    isSelected: false,
  },
  {
    id: 7,
    label: "12:30",
    isAvailiable: false,
    isSelected: false,
  },
  {
    id: 8,
    label: "13:00",
    isAvailiable: false,
    isSelected: false,
  },
  {
    id: 9,
    label: "13:30",
    isAvailiable: false,
    isSelected: false,
  },
  {
    id: 10,
    label: "14:00",
    isAvailiable: true,
    isSelected: false,
  },
];

export const peopleQuantities = [
  {
    id: 1,
    title: "Adults",
    desc: "Ages 13 or above",
    quantities: 0,
    max: 10,
    min: 0,
  },
  {
    id: 2,
    title: "Children",
    desc: "Ages 2-12",
    quantities: 0,
    max: 10,
    min: 0,
  },
  {
    id: 3,
    title: "Infants",
    desc: "Under 2",
    quantities: 0,
    max: 2,
    min: 0,
  },
  {
    id: 4,
    title: "Pets",
    additionalNotes: "Bringing a service animal?",
    quantities: 0,
    max: 10,
    min: 0,
  },
];

export const getTimeIntervals = (startTime: string, endTime: string) => {
  const timeIntervals = [];
  const start = moment(startTime, "HH:mm");
  const end = moment(endTime, "HH:mm");

  while (start <= end) {
    // timeIntervals.push(start.format("HH:mm"));
    timeIntervals.push({
      label: start.format("HH:mm"),
      isAvailiable: true,
      isSelected: false,
    });
    start.add(30, "minutes");
  }

  return timeIntervals;
};
