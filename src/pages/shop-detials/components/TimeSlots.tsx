interface PropTypes {
  avaiTimes: any;
  setAvaiTimes: any;
  setIsShowDialog: any;
}

const TimeSlots = ({ avaiTimes, setAvaiTimes, setIsShowDialog }: PropTypes) => {
  return (
    <div id="times" className="mt-5 p-5 col-span-2">
      <h2 className="text-[17px] font-semibold">
        {/* {moment(selectedDate.date).format("ll")} */}
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
        {avaiTimes?.map((item: any, index: number) => {
          return (
            <div
              key={index}
              className={`border rounded-lg text-center p-3 ${
                item.isAvailiable
                  ? "border-[#000000] cursor-pointer"
                  : "text-[#8C8C8C]"
              } ${
                item.isSelected
                  ? "bg-[#006CE31A] border-[#003B95] text-[#003B95]"
                  : ""
              }`}
              onClick={() => {
                setAvaiTimes(
                  avaiTimes.map((ii: any) => {
                    if (ii.isAvailiable && ii.id === item.id) {
                      return { ...ii, isSelected: true };
                    } else {
                      return { ...ii, isSelected: false };
                    }
                  })
                );
                setIsShowDialog(true);
              }}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlots;
