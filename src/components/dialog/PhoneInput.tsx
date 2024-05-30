import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { DialogContext } from "./DialogWrapper";
import { useQuery } from "../../helper/url";
import axios from "axios";

const PhoneInput = () => {
    const { t } = useTranslation();
    const query = useQuery();

    const { formik, isLoading } = useContext<any>(DialogContext);

  const handleLoginWithLine = async () => {
    console.log("login with line");
    await axios
        .get(`${import.meta.env.VITE_APP_API}/line-request-code`)
        .then((res) => {
            console.log(res);
            window.location.replace(res.data.loginUrl);
        });
};

  return (
    <section>
      <div className="flex-auto">
        <p className="text-[17px] font-semibold ">{query.get("accessCode") ? t("form:business:auth:login") :t("verifyPhoneNumber")}</p>
        <span className="text-[14px]">{t("verifyPhoneNumberDesc")}</span>
      </div>
      <input
        type="text"
        className={`w-full text-[14px] p-4 rounded-lg my-5 ${
          formik.touched.phoneNumbers && formik.errors.phoneNumbers
            ? "border-2 border-rose-500"
            : "border border-black"
        }`}
        placeholder="หมายเลขโทรศัพท์ของคุณ"
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
        className="w-full items-center justify-center bg-[#35398F] text-white text-[14px] p-4 rounded-lg font-bold"
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
      <div className=" my-3 text-center ">
      <span className="text-[14px]">{t("or")}</span>
      </div>
      <button
                onClick={handleLoginWithLine}
                className="w-full  bg-[#06C755] text-center mb-5 hover:bg-[#06C755]-500 hover-opacity p-0.5 rounded-lg text-[#FFFFFF]">
                <div className="flex items-center gap-2 justify-center text-[14px]">
                    <img src="/LINE_logo.png" className="w-12 h-12 " />
                    <div className=" font-bold text-center">{t("ContinueWithLINEAccount")}</div>
                </div>
            </button>
    </section>
  );
};

export default PhoneInput;
