import { useNavigate } from "react-router-dom";
// icons
import LinkIcon from "@mui/icons-material/Link";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import StoreIcon from "@mui/icons-material/Store";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { Toast } from "../../helper/alerts";

const moreOptions = {
  share: [
    {
      icon: <LinkIcon />,
      label: "Share booking link",
      url: undefined,
    },
  ],
  setting: [
    {
      icon: <CalendarMonthIcon />,
      label: "Overview Schedule",
      url: undefined,
    },
    {
      icon: <StoreIcon />,
      label: "Business setting",
      url: undefined,
    },
    {
      icon: <SettingsIcon />,
      label: "Service setting",
      url: "/serviceInfo",
    },
  ],
  logut: [
    {
      icon: <LogoutIcon />,
      label: "Log out",
      url: undefined,
    },
  ],
};

const BusinessProfileMoreOptions = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-5">
      {Object.values(moreOptions).map((options: any, index: number) => (
        <div key={index} className="rounded-lg bg-white">
          {options.map((item: any, index: number) => (
            <button
              key={index}
              type="button"
              className="text-start p-3 w-full"
              onClick={() => {
                if (item.url) {
                  navigate(item.url);
                } else {
                  Toast.fire({
                    icon: "info",
                    title: "Coming Soon",
                  });
                }
              }}
            >
              {item.icon}
              <span className="mx-2">{item.label}</span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default BusinessProfileMoreOptions;
