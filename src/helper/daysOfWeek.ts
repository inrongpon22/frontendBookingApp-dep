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
        thaiName: "จันทร์",
    },
    {
        name: "อ",
        value: "Tuesday",
        thaiName: "อังคาร",
    },
    {
        name: "พ",
        value: "Wednesday",
        thaiName: "พุธ",
    },
    {
        name: "พฤ",
        value: "Thursday",
        thaiName: "พฤหัสบดี",
    },
    {
        name: "ศ",
        value: "Friday",
        thaiName: "ศุกร์",
    },
    {
        name: "ส",
        value: "Saturday",
        thaiName: "เสาร์",
    },
    {
        name: "อา",
        value: "Sunday",
        thaiName: "อาทิตย์",
    },
];

export const dayOfWeek = (language: string) => {
    if(language.includes("th")){
        return dataOfWeekThai;
    }else if(language.includes("en")){
        return dataOfWeekEng;
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
        thaiName: "อาทิตย์",
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
    if (language.includes("th")) {
        return dataOfWeekThaiFullDayName;
    } else if (language.includes("en")) {
        return dataOfWeekEngFullDayName;
    }
};
