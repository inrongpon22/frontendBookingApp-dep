import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { DialogContext } from "./DialogWrapper";
import { useQuery } from "../../helper/url";

const PhoneInput = () => {
  const { t } = useTranslation();
  const query = useQuery();

  const { formik, isLoading } = useContext<any>(DialogContext);

  return (
    <section>
      <div className="">
        <p className="text-[25px] font-semibold">{query.get("accessCode") ? t("form:business:auth:login") :t("verifyPhoneNumber")}</p>
        <span className="text-[14px]">{t("verifyPhoneNumberDesc")}</span>
      </div>
      <input
        type="text"
        className={`w-full px-3 py-2 mt-5 rounded-lg ${
          formik.touched.phoneNumbers && formik.errors.phoneNumbers
            ? "border-2 border-rose-500"
            : "border border-black"
        }`}
        placeholder="061 234 567"
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
        <span className={isLoading ? "text-gray-400" : ""}>
          {t("button:continueButton")}
        </span>
        <span
          className={`${
            isLoading ? "flex items-center justify-center" : "hidden"
          } ms-3`}
        ></span>
      </button>
    </section>
  );
};

export default PhoneInput;
