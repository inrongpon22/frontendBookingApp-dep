import { useContext } from "react";
import { DialogContext } from "./DialogWrapper";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { app_api } from "../../helper/url";

const OtpVerify = () => {
  const { formik, setIsLoading } = useContext(DialogContext);

  const { t, i18n: {language} } = useTranslation();

  return (
    <section>
      <p className="text-[1.5rem] font-semibold mb-1">
        {t("otpVerification")}
        {formik.values.phoneNumbers.slice(-4)}
      </p>
      <input
        type="text"
        className={`w-full p-4 rounded-lg ${
          formik.errors?.phoneNumbers
            ? "border-2 border-rose-500"
            : "border border-black"
        }`}
        placeholder="กรอกรหัส OTP"
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
        <p className="mt-1 text-[1rem] text-rose-500">{formik.errors?.otp}</p>
      )}
      <button
        type="button"
        className="bg-gray-200 rounded-lg text-[1rem] p-2 my-5"
        onClick={async () => {
          await axios
            .post(`${app_api}/requestOTP/${formik.values.phoneNumbers}/${language}`)
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
        {t("dontReceiveCode")}
      </button>

      <button
        type="button"
        className="bg-[#35398F] w-full text-white p-4 rounded-lg"
        onClick={() => formik.handleSubmit()}
      >
        {t("button:continueButton")}
      </button>
    </section>
  );
};

export default OtpVerify;
