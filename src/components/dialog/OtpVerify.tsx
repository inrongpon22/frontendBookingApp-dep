import { useContext } from "react";
import { DialogContext } from "./DialogWrapper";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { app_api } from "../../helper/url";

const OtpVerify = () => {
  const { formik, setIsLoading } = useContext(DialogContext);

  const { t } = useTranslation();

  return (
    <section>
      <p>
        {t("otpVerification")}
        {formik.values.phoneNumbers.slice(-4)}
      </p>
      <input
        type="text"
        className={`w-full px-3 py-2 mt-5 rounded-lg ${
          formik.errors?.phoneNumbers
            ? "border-2 border-rose-500"
            : "border border-black"
        }`}
        // placeholder="X-X-X-X-X-X"
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
        <p className="text-[14px] text-rose-500">{formik.errors?.otp}</p>
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
        {t("dontReceiveCode")}
      </button>

      <button
        type="button"
        className="bg-[#020873] w-full text-white p-2 mt-5 rounded-lg"
        onClick={() => formik.handleSubmit()}
      >
        {t("button:continueButton")}
      </button>
    </section>
  );
};

export default OtpVerify;
