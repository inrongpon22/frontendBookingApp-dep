export const dataOfWeekEng = [
  {
    name: "Mon",
    value: "Monday",
  },
  {
    name: "Tue",
    value: "Tuesday",
  },
  {
    name: "Wed",
    value: "Wednesday",
  },
  {
    name: "Thu",
    value: "Thursday",
  },
  {
    name: "Fri",
    value: "Friday",
  },
  {
    name: "Sat",
    value: "Saturday",
  },
  {
    name: "Sun",
    value: "Sunday",
  },
];
export const dataOfWeekThai = [
  {
    name: "จ",
    value: "Monday",
  },
  {
    name: "อ",
    value: "Tuesday",
  },
  {
    name: "พ",
    value: "Wednesday",
  },
  {
    name: "พฤ",
    value: "Thursday",
  },
  {
    name: "ศ",
    value: "Friday",
  },
  {
    name: "ส",
    value: "Saturday",
  },
  {
    name: "อา",
    value: "Sunday",
  },
];

export const dayOfWeek = (language: string) => {
  switch (language) {
    case "th":
      return dataOfWeekThai;

    case "en":
      return dataOfWeekEng;

    default:
      return dataOfWeekThai;
  }
};

const dataOfWeekEngFullDayName = [
  {
    name: "Monday",
    value: "Monday",
  },
  {
    name: "Tuesday",
    value: "Tuesday",
  },
  {
    name: "Wednesday",
    value: "Wednesday",
  },
  {
    name: "Thursday",
    value: "Thursday",
  },
  {
    name: "Friday",
    value: "Friday",
  },
  {
    name: "Saturday",
    value: "Saturday",
  },
  {
    name: "Sunday",
    value: "Sunday",
  },
];
const dataOfWeekThaiFullDayName = [
  {
    name: "จันทร์",
    value: "Monday",
  },
  {
    name: "อังคาร",
    value: "Tuesday",
  },
  {
    name: "พุธ",
    value: "Wednesday",
  },
  {
    name: "พฤหัส",
    value: "Thursday",
  },
  {
    name: "ศุกร์",
    value: "Friday",
  },
  {
    name: "เสาร์",
    value: "Saturday",
  },
  {
    name: "อาทิตย์",
    value: "Sunday",
  },
];

export const dayOfWeekFullName = (language: string) => {
  switch (language) {
    case "th":
      return dataOfWeekThaiFullDayName;

    case "en":
      return dataOfWeekEngFullDayName;

    default:
      return dataOfWeekThaiFullDayName;
  }
};
