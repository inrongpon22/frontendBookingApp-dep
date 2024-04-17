import React, { useContext, useState } from "react";
import axios from "axios";
import { app_api } from "../../../helper/url";
// validation
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  Slide,
  Toolbar,
} from "@mui/material";
// icons
import DateRangeIcon from "@mui/icons-material/DateRange";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
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

// form validation schema for phone number
const phoneOtpSchema = Yup.object().shape({
  phoneNumbers: Yup.string()
    .min(
      9,
      "Your phone numbers is too short. It must be at least 9 numbers long."
    )
    .required("Phone number is required"),
});
// form validation schema for sign up
const confirmationSchema = Yup.object().shape({
  username: Yup.string()
    .min(
      1,
      "Your username is too short. It must be at least 1 characters long."
    )
    .required("Username is required"),
  phoneNumbers: Yup.string()
    .min(
      9,
      "Your phone numbers is too short. It must be at least 9 numbers long."
    )
    .required("Phone number is required"),
  additionalNotes: Yup.string(),
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

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      phoneNumbers: "",
      additionalNotes: "",
    },
    validationSchema:
      state === "phone-input" ? phoneOtpSchema : confirmationSchema,
    onSubmit: async (values) => {
      switch (state) {
        case "phone-input":
          setIsLoading(true);
          await axios
            .post(`${app_api}/user`, {
              phoneNumber: values.phoneNumbers,
            })
            .then(async (res) => {
              if (res.status === 200) {
                localStorage.setItem("token", JSON.stringify(res.data.token));
                formik.setFieldValue("username", res.data.userName);
                setIsLoading(false);
                setState("sign-up");
              } else {
                setIsLoading(false);
                setState("sign-up");
              }
            })
            .catch((err) => {
              console.log(err);
              setIsLoading(false);
            });
          break;

        case "sign-up":
          setState("booking-success");
          break;

        default:
          break;
      }
    },
  });

  const lists: {
    label: string;
    text: string;
  }[] = [
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
      text: `${formik.values.username} (${quantities?.quantities} person)`,
    },
    {
      label: "Price",
      text: `${services.find((item: any) => item.isSelected)?.price} ${
        services.find((item: any) => item.isSelected)?.currency
      }`,
    },
    {
      label: "Note",
      text: formik.values.additionalNotes
        ? `${formik.values.additionalNotes}`
        : "-",
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
                formik.touched.phoneNumbers && formik.errors.phoneNumbers
                  ? "border-2 border-rose-500"
                  : "border border-black"
              }`}
              placeholder="+66 12 345 6789"
              value={formik.values.phoneNumbers}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d+$/.test(value) || value === "") {
                  formik.setFieldValue("phoneNumbers", value);
                }
              }}
            />
            {formik.touched.phoneNumbers && formik.errors.phoneNumbers && (
              <span className="text-[14px] text-rose-500">
                {formik.errors?.phoneNumbers}
              </span>
            )}
            <button
              type="button"
              disabled={isLoading}
              className="w-full flex items-center justify-center bg-[#020873] text-white p-2 mt-5 rounded-lg"
              onClick={() => formik.handleSubmit()}
            >
              <span className={isLoading ? "text-gray-400" : ""}>Continue</span>
              <span
                className={`${
                  isLoading ? "flex items-center justify-center" : "hidden"
                } ms-3`}
              >
                <CircularProgress size={18} />
              </span>
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
                formik.errors?.phoneNumbers
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
                {...formik.getFieldProps("username")}
                className={`py-2 px-3 border rounded-lg ${
                  formik.errors?.username
                    ? "border-2 border-rose-500"
                    : "border border-black"
                }`}
                placeholder="meetsoftware123"
              />
              {formik.touched.username && formik.errors.username && (
                <span className="text-[14px] text-rose-500">
                  {formik.errors?.username}
                </span>
              )}
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
                {...formik.getFieldProps("phoneNumbers")}
                className={`py-2 px-3 border rounded-lg ${
                  formik.errors?.phoneNumbers
                    ? "border-2 border-rose-500"
                    : "border border-black"
                }`}
                placeholder="+66 12 345 6789"
              />
              {formik.touched.phoneNumbers && formik.errors.phoneNumbers && (
                <span className="text-[14px] text-rose-500">
                  {formik.errors?.phoneNumbers}
                </span>
              )}
            </div>
            <div className="flex flex-col py-2">
              <label htmlFor="" className="required">
                Additional Notes (optional)
              </label>
              <textarea
                rows={3}
                {...formik.getFieldProps("additionalNotes")}
                className="py-2 px-3 border rounded-lg"
                placeholder="ex. Hair cut with spa and treatment"
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
              onClick={() => formik.handleSubmit()}
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
  );
};

export default ConfirmDialog;
