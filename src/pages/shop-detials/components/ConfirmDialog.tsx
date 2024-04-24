import React, { useContext, useState } from "react";
import axios from "axios";
import { app_api } from "../../../helper/url";
// context
import { ShopContext } from "../ShopDetailsPageWrapper";
// validation
import { useFormik } from "formik";
import {
  CircularProgress,
  Dialog,
  DialogContent,
  Slide,
  Toolbar,
} from "@mui/material";
// icons
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { TransitionProps } from "@mui/material/transitions";
import { useNavigate } from "react-router-dom";
import { Toast } from "../../../helper/alerts";
import { confirmationDialogSchemas } from "../detailTypes";

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
    serviceById,
    quantities,
    isShowDialog,
    setIsShowDialog,
    modalState,
    setModalState,
  } = useContext(ShopContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const token = localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token")!)
    : null;

  const formik = useFormik({
    initialValues: {
      userId: 0,
      username: "",
      phoneNumbers: "",
      otp: "",
      additionalNotes: "",
    },
    validationSchema:
      confirmationDialogSchemas[
        modalState as keyof typeof confirmationDialogSchemas
      ],
    onSubmit: async (values) => {
      switch (modalState) {
        case "phone-input":
          setIsLoading(true);
          await axios
            .post(`${app_api}/requestOTP/${values.phoneNumbers}`)
            .then(async (res) => {
              if (res.status === 200) {
                setIsLoading(false);
                setModalState("otp-verify");
              }
            })
            .catch((err) => {
              if (err.response.status === 429) {
                formik.setFieldError(
                  "phoneNumbers",
                  `${err.response.data}, please try again in 60 seconds`
                );
              }
              setIsLoading(false);
            });
          break;

        case "otp-verify":
          setIsLoading(true);
          await axios
            .post(`${app_api}/checkOTP`, {
              phoneNumber: values.phoneNumbers,
              otpCode: values.otp,
            })
            .then(async (res) => {
              if (res.status === 200) {
                localStorage.setItem("token", JSON.stringify(res.data.token));
                formik.setFieldValue("userId", res.data.userId);
                formik.setFieldValue("username", res.data.userName);
                setIsLoading(false);
                setModalState("booking-detail-preview");
              }
            })
            .catch((err) => {
              formik.setFieldError(
                "otp",
                `${err.response.data.message} ${err.message}`
              );
              setIsLoading(false);
            });
          break;

        default:
          break;
      }
    },
  });

  const createReservation = async () => {
    const body = {
      userId: formik.values.userId,
      serviceId: Number(services.find((item: any) => item.isSelected)?.id),
      phoneNumber: formik.values.phoneNumbers,
      remark: formik.values.additionalNotes,
      startTime: serviceById?.bookingSlots.find((item: any) => item.isSelected)
        ?.startTime,
      endTime: serviceById?.bookingSlots.find((item: any) => item.isSelected)
        ?.endTime,
      status: "pending",
      by: "customer",
      userName: formik.values.username,
      bookingDate: selectedDate.date.format("YYYY-MM-DD"),
      guestNumber: quantities.quantities,
    };

    axios
      .post(`${app_api}/reservation`, body, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((res) => {
        navigate("/booking-success", {
          state: {
            lists: {
              what: services.find((item: any) => item.isSelected)?.title,
              when: `${selectedDate.date.format("dddd, MMMM D, YYYY")} ${
                serviceById?.bookingSlots.find((item: any) => item.isSelected)
                  ?.startTime
              } - ${
                serviceById?.bookingSlots.find((item: any) => item.isSelected)
                  ?.endTime
              }`,
              where: `${shopDetail?.address}`,
              who: `${formik.values.username} (${quantities?.quantities} person)`,
              price: `${services.find((item: any) => item.isSelected)?.price} ${
                services.find((item: any) => item.isSelected)?.currency
              }`,
              note: formik.values.additionalNotes,
            },
            data: {
              reservationId: res.data.reservationId,
              serviceId: Number(
                services.find((item: any) => item.isSelected)?.id
              ),
            },
          },
        });
      })
      .catch((err) => {
        Toast.fire({
          icon: "error",
          title: err.response.data.message,
        });
      });
  };

  const SwitchState = (): React.ReactNode => {
    switch (modalState) {
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
              maxLength={10}
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
            <p>
              Enter the 6-digit security code we send to you at ******
              {formik.values.phoneNumbers.slice(-4)}
            </p>
            <input
              type="text"
              className={`w-full px-3 py-2 mt-5 rounded-lg ${
                formik.errors?.phoneNumbers
                  ? "border-2 border-rose-500"
                  : "border border-black"
              }`}
              placeholder="X-X-X-X-X-X"
              value={formik.values.otp}
              maxLength={6}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d+$/.test(value) || value === "") {
                  formik.setFieldValue("otp", value);
                }
              }}
            />
            {formik.touched.otp && formik.errors.otp && (
              <p className="text-[14px] text-rose-500">
                {formik.errors?.otp}
              </p>
            )}
            <button
              type="button"
              className="bg-gray-200 rounded-lg text-[14px] px-2 py-1 mt-5"
              onClick={async () => {
                await axios
                  .post(`${app_api}/requestOTP/${formik.values.phoneNumbers}`)
                  .catch((err) => {
                    if (err.response.status === 429) {
                      formik.setFieldError(
                        "otp",
                        `${err.response.data}, please try again in 60 seconds`
                      );
                    }
                    setIsLoading(false);
                  });
              }}
            >
              I didn’t receive a code
            </button>

            <button
              type="button"
              className="bg-[#020873] w-full text-white p-2 mt-5 rounded-lg"
              onClick={() => formik.handleSubmit()}
            >
              Continue
            </button>
          </>
        );

      case "booking-detail-preview":
        return (
          <>
            <div className="">
              <p className="text-[14px] font-semibold">Booking Detail</p>
              <div className="border rounded-md mt-1">
                <p className="flex justify-between p-3">
                  <span>Services:</span>
                  <span className="text-[14px] font-bold">
                    {shopDetail.title}{" "}
                    {services?.find((item: any) => item.isSelected)?.title}
                  </span>
                </p>
                <p className="flex justify-between p-3">
                  <span>Date:</span>
                  <span className="text-[14px] font-bold">
                    {selectedDate?.date.format("MMMM DD, YYYY")}
                  </span>
                </p>
                <p className="flex justify-between p-3">
                  <span>Time:</span>
                  <span className="text-[14px] font-bold">
                    {
                      serviceById?.bookingSlots.find(
                        (item: any) => item.isSelected
                      )?.startTime
                    }{" "}
                    -{" "}
                    {
                      serviceById?.bookingSlots.find(
                        (item: any) => item.isSelected
                      )?.endTime
                    }
                  </span>
                </p>
                <p className="flex justify-between p-3">
                  <span>Guest:</span>
                  <span className="text-[14px] font-bold">
                    {quantities.quantities}
                  </span>
                </p>
                <p className="flex justify-between p-3">
                  <span>Price:</span>
                  <span className="text-[14px] font-bold">
                    {services?.find((item: any) => item.isSelected)?.price}{" "}
                    {serviceById?.currency}
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-[14px] font-semibold">Booking Name</p>
              <input
                type="text"
                {...formik.getFieldProps("username")}
                className={`w-full py-2 px-3 mt-1 border rounded-lg ${
                  formik.errors?.username
                    ? "border-2 border-rose-500"
                    : "border"
                }`}
                placeholder="meetsoftware123"
              />
              {formik.touched.username && formik.errors.username && (
                <span className="text-[14px] text-rose-500">
                  {formik.errors?.username}
                </span>
              )}
            </div>
            <div className="mt-3">
              <p className="text-[14px] font-semibold">Booking Number</p>
              <input
                type="text"
                {...formik.getFieldProps("phoneNumbers")}
                className={`w-full py-2 px-3 mt-1 border rounded-lg ${
                  formik.errors?.phoneNumbers
                    ? "border-2 border-rose-500"
                    : "border"
                }`}
                placeholder="+66 12 345 6789"
              />
              {formik.touched.phoneNumbers && formik.errors.phoneNumbers && (
                <span className="text-[14px] text-rose-500">
                  {formik.errors?.phoneNumbers}
                </span>
              )}
            </div>
            <div className="mt-3">
              <p className="text-[14px] font-semibold">Note (Optional)</p>
              <textarea
                rows={3}
                {...formik.getFieldProps("additionalNotes")}
                className="w-full py-2 px-3 mt-1 border rounded-lg"
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
              onClick={createReservation}
            >
              Confirm & Booking
            </button>
          </>
        );

      default:
        break;
    }
  };

  const handleBackButton = () => {
    switch (modalState) {
      case "phone-input":
        setIsShowDialog(false);
        break;

      case "otp-verify":
        setModalState("phone-input");
        break;

      case "booking-detail-preview":
        formik.resetForm();
        setModalState("phone-input");
        setIsShowDialog(false);
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
      <Toolbar className="grid grid-cols-4">
        <span className="w-[24px] h-[24px]" onClick={handleBackButton}>
          {modalState === "phone-input" ? <CloseIcon /> : <ArrowBackIosIcon />}
        </span>
        <span className="w-full font-semibold col-span-3 text-center">
          Confirm Booking
        </span>
      </Toolbar>

      <DialogContent>{SwitchState()}</DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
