import React, { useContext, useState } from "react";
// import moment from "moment";
import {
  Dialog,
  DialogContent,
  Divider,
  Slide,
  // Snackbar,
  Toolbar,
} from "@mui/material";
// icons
import DateRangeIcon from "@mui/icons-material/DateRange";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
// import CheckIcon from "@mui/icons-material/Check";
import { TransitionProps } from "@mui/material/transitions";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../ShopDetailsPageWrapper";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ConfirmDialog = () => {
  const navigate = useNavigate();
  const {
    shopDetail,
    services,
    selectedDate,
    quantities,
    isShowDialog,
    setIsShowDialog,
  } = useContext(ShopContext);
  const [state, setState] = useState<string>("phone-input");

  const [username, setUsername] = useState<string>("meet123");
  const [phoneNumbers, setPhoneNumbers] = useState<string>("+66 12 345 6789");
  const [note, setNote] = useState<string>("Hair cut with spa and treatment");

  // handle error
  const [errors] = useState<any>({}); //setErrors

  const lists = [
    {
      label: "What",
      text: services.find((item: any) => item.isSelected)?.title,
    },
    {
      label: "When",
      text: `${selectedDate.date.format("dddd, MMMM D, YYYY")} ${
        services
          ?.find((item: any) => item.isSelected)
          ?.bookingSlots.find((ii: any) => ii.isSelected)?.startTime
      } - ${
        services
          ?.find((item: any) => item.isSelected)
          ?.bookingSlots.find((ii: any) => ii.isSelected)?.endTime
      }`,
    },
    {
      label: "Where",
      text: `${shopDetail?.address}`,
    },
    {
      label: "Who",
      text: `${username} (${quantities?.quantities} person)`,
    },
    {
      label: "Price",
      text: `${services.find((item: any) => item.isSelected)?.price} ${
        services.find((item: any) => item.isSelected)?.currency
      }`,
    },
    {
      label: "Note",
      text: `${note}`,
    },
  ];

  const SwitchState = (): React.ReactNode => {
    switch (state) {
      case "phone-input":
        return (
          <>
            <div className="">
              <p className="text-[25px] font-semibold">
                Verify your phone number with a code
              </p>
              <span className="text-[14px]">
                We will send a code - it help us keep yours account secure.
              </span>
            </div>
            <input
              type="text"
              className={`w-full px-3 py-2 mt-5 rounded-lg ${
                errors?.phoneNumbers
                  ? "border-2 border-rose-500"
                  : "border border-black"
              }`}
              placeholder="+66 12 345 6789"
              value={phoneNumbers}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d+$/.test(value) || value === "") {
                  setPhoneNumbers(value);
                }
              }}
            />
            {errors?.phoneNumber && (
              <span className="text-[14px] text-rose-500">
                {errors?.phoneNumber}
              </span>
            )}
            <button
              type="button"
              className="bg-[#020873] w-full text-white p-2 mt-5 rounded-lg"
              onClick={() => {
                // if (phoneNumbers.length < 9) {
                //   setErrors({
                //     phoneNumber: "Please insert phone numbers correctly",
                //   });
                // } else {
                setState("otp-verify");
                // }
              }}
            >
              Continue
            </button>
          </>
        );

      case "otp-verify":
        return (
          <>
            <p>Enter the 6-digit security code we send to you at ******1234</p>
            <input
              type="text"
              className={`w-full px-3 py-2 mt-5 rounded-lg ${
                errors?.phoneNumbers
                  ? "border-2 border-rose-500"
                  : "border border-black"
              }`}
              placeholder="X-X-X-X-X-X"
              value="******"
              onChange={(e) => console.log(e)}
            />
            <button
              type="button"
              className="bg-gray-200 rounded-lg text-[14px] px-2 py-1 mt-5"
            >
              I didn’t receive a code
            </button>
            <button
              type="button"
              className="bg-[#020873] w-full text-white p-2 mt-5 rounded-lg"
              onClick={() => setState("sign-up")}
            >
              Continue
            </button>
          </>
        );

      case "sign-up":
        return (
          <>
            <div className="flex">
              <div className=" bg-[#E6F1FD] p-1 rounded-lg">
                <span className="flex items-center text-[14px]">
                  <DateRangeIcon fontSize="small" />
                  {selectedDate.date.format("MMMM DD, YYYY")}
                </span>
              </div>
              <div className=" bg-[#E6F1FD] p-1 rounded-lg ms-1">
                <span className="flex items-center text-[14px]">
                  <PersonIcon fontSize="small" />
                  {quantities.quantities}
                </span>
              </div>
            </div>
            <div className="flex flex-col py-2">
              <label htmlFor="" className="required">
                Username
              </label>
              <input
                type="text"
                value={username}
                className="py-2 px-3 border rounded-lg"
                placeholder="username"
                onChange={(e: any) => setUsername(e.target.value)}
              />
              <span className="text-[12px] font-thin mt-2">
                Username is for user identification, personalization, privacy,
                and account security.
              </span>
            </div>
            <div className="flex flex-col py-2">
              <label htmlFor="" className="required">
                Phone Number
              </label>
              <input
                type="text"
                value={phoneNumbers}
                className="py-2 px-3 border rounded-lg"
                placeholder="+66 12 345 6789"
                onChange={(e: any) => setPhoneNumbers(e.target.value)}
              />
            </div>
            <div className="flex flex-col py-2">
              <label htmlFor="" className="required">
                Additional Notes (optional)
              </label>
              <textarea
                rows={3}
                value={note}
                className="py-2 px-3 border rounded-lg"
                placeholder="ex. Hair cut with spa and treatment"
                onChange={(e: any) => setNote(e.target.value)}
              />
            </div>
            <div className="flex flex-col py-2">
              <label htmlFor="" className="text-[12px] text-[#5C5C5C]">
                By clicking 'Confirm booking,' you agree to our Terms of Service
                and Privacy Policy, granting us permission to use your personal
                information in accordance with our policies.
              </label>
            </div>
            <button
              type="button"
              className="bg-[#020873] w-full text-white p-2 rounded-lg"
              onClick={() => setState("booking-success")}
            >
              Confirm Booking
            </button>
          </>
        );

      case "booking-success":
        return (
          <>
            <p className="text-[25px] font-semibold mt-14">
              This meeting is scheldule
            </p>
            <p className="my-3">
              We sent an email with a calendar invitation with the details to
              everyone.
            </p>
            <Divider />
            <div className="py-4">
              {lists.map((item: any, index: number) => {
                return (
                  <div key={index} className="grid grid-cols-4 py-1">
                    <div className="font-semibold">{item.label}:</div>
                    <span className="col-span-3">{item.text}</span>
                  </div>
                );
              })}
            </div>
            <Divider />
            <div className="flex justify-center">
              <span className="py-5 w-2/3 text-center">
                Need to make a change?{" "}
                <button
                  type="button"
                  className="underline"
                  onClick={() => setIsShowDialog(false)}
                >
                  Reschedule
                </button>{" "}
                or{" "}
                <button
                  type="button"
                  className="underline"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </button>
              </span>
            </div>
            <Divider />
            <button
              type="button"
              className="bg-[#020873] w-full text-white p-2 mt-5 rounded-lg"
              onClick={() => navigate("/")}
            >
              Continue
            </button>
          </>
        );

      default:
        break;
    }
  };

  const handleBackButton = () => {
    switch (state) {
      case "phone-input":
        setIsShowDialog(false);
        break;

      case "otp-verify":
        setState("phone-input");
        break;

      case "sign-up":
        setState("otp-verify");
        break;

      case "booking-success":
        setState("otp-verify");
        break;

      default:
        break;
    }
  };

  return (
    <>
      <Dialog
        maxWidth="xl"
        fullWidth={true}
        fullScreen
        open={isShowDialog}
        TransitionComponent={Transition}
      >
        {state !== "booking-success" && (
          <Toolbar className="grid grid-cols-4">
            <span className="w-[24px] h-[24px]" onClick={handleBackButton}>
              {state === "phone-input" ? <CloseIcon /> : <ArrowBackIosIcon />}
            </span>
            <span className="w-full font-semibold col-span-3 text-center ">
              Confirm Booking
            </span>
          </Toolbar>
        )}
        <DialogContent>{SwitchState()}</DialogContent>
      </Dialog>
    </>
  );
};

export default ConfirmDialog;
