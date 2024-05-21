// icon
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { Chip } from "@mui/material";

const ShopInformation = ({shopDetail}:any) => {
  
  return (
    <div className="relative my-auto">
      <h1 className="text-[25px] font-semibold">{shopDetail?.title}</h1>
      <span className="text-[14px] font-normal">
        {shopDetail?.description || "No detail for this shop"}
      </span>
      <div className="flex flex-wrap gap-1 mt-2">
        <Chip
          className="custom-chip-label"
          icon={<LocationOnIcon fontSize="small" />}
          label={shopDetail?.address}
          color="info"
        />
        <Chip
          className="custom-chip-label"
          icon={<LocalPhoneIcon fontSize="small" />}
          label={shopDetail?.phoneNumber}
          color="info"
        />
        {/* <Chip
          className="custom-chip-label"
          // icon={<LocalPhoneIcon fontSize="small" />}
          label="Hair Cut"
          color="info"
        /> */}
      </div>
    </div>
  );
};

export default ShopInformation;
