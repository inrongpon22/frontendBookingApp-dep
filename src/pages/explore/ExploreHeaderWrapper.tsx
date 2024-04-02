// asset
import FilledGlobe from "../../assets/filled-globe.svg";
import Calendar from "../../assets/calendar-days.svg";
import Avatar from "../../assets/avatar.svg";

const ExploreHeaderWrapper = () => {
  return (
    <div className="flex justify-between">
      <div className="left flex">
        <div className="flex">
          <img src={FilledGlobe} />
          <label htmlFor="" className="ms-1">Explore</label>
        </div>
        <div className="flex ms-2">
          <img src={Calendar} />
          <label htmlFor=""className="ms-1">Booked</label>
        </div>
      </div>
      <div className="right">
        <img src={Avatar} />
      </div>
    </div>
  );
};

export default ExploreHeaderWrapper;
