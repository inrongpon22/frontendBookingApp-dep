const monthsOfYearEngFullName = [
    {
        value: "January",
        name: "January",
    },
    {
        value: "February",
        name: "February",
    },
    {
        value: "March",
        name: "March",
    },
    {
        value: "April",
        name: "April",
    },
    {
        value: "May",
        name: "May",
    },
    {
        value: "June",
        name: "June",
    },
    {
        value: "July",
        name: "July",
    },
    {
        value: "August",
        name: "August",
    },
    {
        value: "September",
        name: "September",
    },
    {
        value: "October",
        name: "October",
    },
    {
        value: "November",
        name: "November",
    },
    {
        value: "December",
        name: "December",
    },
];
const monthsOfYearThaiFullName = [
    { name: "มกราคม", value: "January" },
    { name: "กุมภาพันธ์", value: "February" },
    { name: "มีนาคม", value: "March" },
    { name: "เมษายน", value: "April" },
    { name: "พฤษภาคม", value: "May" },
    { name: "มิถุนายน", value: "June" },
    { name: "กรกฎาคม", value: "July" },
    { name: "สิงหาคม", value: "August" },
    { name: "กันยายน", value: "September" },
    { name: "ตุลาคม", value: "October" },
    { name: "พฤศจิกายน", value: "November" },
    { name: "ธันวาคม", value: "December" },
];

export const monthsOfYearFullName = (language: string) => {
    if (language.includes("th")) {
        return monthsOfYearThaiFullName;
    } else if (language.includes("en")) {
        return monthsOfYearEngFullName;
    }
};
