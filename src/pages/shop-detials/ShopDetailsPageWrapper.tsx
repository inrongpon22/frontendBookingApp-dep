import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// mockup datas
import { getTimeIntervals } from "./shopDatas";
// icon
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import DateRangeIcon from "@mui/icons-material/DateRange";
// styled
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import axios from "axios";
import { app_api } from "../../helper/url";
import { quantityTypes, serviceTypes, shopDetailTypes } from "./detailTypes";
// components
import { Slideshow } from "./components/Slideshow";
import Calendar from "./components/Calendar";
import ServiceOptions from "./components/ServiceOptions";
import Quantity from "./components/Quantity";
import TimeSlots from "./components/TimeSlots";

const theme = createTheme({
  palette: {
    info: {
      main: "#E6F1FD",
    },
  },
});

interface openTimeTypes {
  label: string;
  isAvailiable: boolean;
  isSelected: boolean;
}

const ShopDetailsPageWrapper = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // id from params
  // get shop details by id connected api
  const [shopDetail, setShopDetail] = useState<shopDetailTypes>();

  // mock up quantities
  const [quantities, setQuantities] = useState<quantityTypes>({
    title: "Guest",
    desc: "Number of guest",
    quantities: 1,
    max: 10,
    min: 1,
  });

  // handle services state
  const [services, setServices] = useState<serviceTypes[]>([]);
  // mock up time & handle select time
  const [avaiTimes, setAvaiTimes] = useState<openTimeTypes[]>([]);

  // handle dialog
  const [isShowDialog, setIsShowDialog] = useState<boolean>(false);

  // handle quantity chage
  const quantityChanges = (type: string) => {
    switch (type) {
      case "increase":
        setQuantities({
          ...quantities,
          quantities:
            quantities.max > quantities.quantities
              ? quantities.quantities + 1
              : quantities.quantities,
        });
        break;

      case "decrease":
        setQuantities({
          ...quantities,
          quantities:
            quantities.quantities > quantities.min
              ? quantities.quantities - 1
              : 0,
        });
        break;

      default:
        break;
    }
  };

  // get business by id from params
  useMemo(() => {
    axios.get(`${app_api}/business/${id}`).then((res) => {
      if (res.status === 200) {
        setShopDetail(res.data);
      }
    });
  }, []);

  // get services by business id
  useMemo(() => {
    axios.get(`${app_api}/serviceByBusinessId/${id}`).then((res) => {
      if (res.status === 200) {
        setServices(
          res.data.map((item: any, index: number) => {
            if (index === 0) {
              return { ...item, isSelected: true };
            } else {
              return { ...item, isSelected: false };
            }
          })
        );
      }
    });
  }, []);

  // set availiable time by interval
  useMemo(() => {
    setAvaiTimes(
      getTimeIntervals(
        services.find((item: any) => item.isSelected === true)?.openTime,
        services.find((item: any) => item.isSelected === true)?.closeTime,
        services.find((item: any) => item.isSelected === true)?.duration
      ).map((item: any, index: number) => {
        return { ...item, id: index + 1 };
      })
    );
  }, [services]);

  return (
    <ThemeProvider theme={theme}>
      <div className="relative lg:grid lg:grid-cols-2">
        {/* Starts: back button */}
        <button
          type="button"
          className="absolute top-5 left-5 bg-white py-1 px-3 rounded-lg z-50"
          onClick={() => navigate("/")}
        >
          <KeyboardBackspaceIcon />
          Back
        </button>
        {/* Starts: back button */}

        <Slideshow data={shopDetail?.imagesURL || []} />

        <div id="shop-details" className="relative my-auto p-5">
          <h1 className="text-[25px] font-semibold">{shopDetail?.title}</h1>
          <span className="text-[14px] font-normal">
            {shopDetail?.description || "No detail for this shop"}
          </span>
          <div className="mt-2">
            <Chip
              className="mt-1 custom-chip-label"
              icon={<LocationOnIcon fontSize="small" />}
              label={shopDetail?.address}
              color="info"
            />
            <Chip
              className="mt-1 custom-chip-label"
              icon={<LocalPhoneIcon fontSize="small" />}
              label={shopDetail?.phoneNumber}
              color="info"
            />
            <Chip
              className="mt-1 ms-1 custom-chip-label"
              // icon={<LocalPhoneIcon fontSize="small" />}
              label="Hair Cut"
              color="info"
            />
          </div>
        </div>

        <Quantity quantities={quantities} quantityChanges={quantityChanges} />

        <Calendar />

        <ServiceOptions
          services={services}
          setServices={setServices}
          quantities={quantities}
        />

        <TimeSlots
          avaiTimes={avaiTimes}
          setAvaiTimes={setAvaiTimes}
          setIsShowDialog={setIsShowDialog}
        />

        {/* Starts:: dialog */}
        <Dialog
          open={isShowDialog}
          onClose={() => setIsShowDialog(false)}
          PaperProps={{
            component: "form",
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries((formData as any).entries());
              const email = formJson.email;
              console.log(email);
              // handleClose();
            },
          }}
        >
          <DialogTitle>Confirm your details</DialogTitle>
          <DialogContent>
            {/* <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText> */}
            <Chip
              icon={
                <span>
                  <DateRangeIcon fontSize="small" />
                  {/* {selectedDate.date?.format("MMMM DD, YYYY HH:mm")} */}
                </span>
              }
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="email"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsShowDialog(false)}>Cancel</Button>
            <Button type="submit">Subscribe</Button>
          </DialogActions>
        </Dialog>
        {/* Ends:: dialog */}
      </div>
    </ThemeProvider>
  );
};

export default ShopDetailsPageWrapper;
