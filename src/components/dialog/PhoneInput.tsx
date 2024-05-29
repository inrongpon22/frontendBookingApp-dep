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
            <div className="">
                <p className="text-[25px] font-semibold">
                    {query.get("accessCode")
                        ? t("form:business:auth:login")
                        : t("verifyPhoneNumber")}
                </p>
                <span className="text-[14px]">
                    {t("verifyPhoneNumberDesc")}
                </span>
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
                onClick={() => formik.handleSubmit()}>
                <span className={isLoading ? "text-gray-400" : ""}>
                    {t("button:continueButton")}
                </span>
                <span
                    className={`${
                        isLoading
                            ? "flex items-center justify-center"
                            : "hidden"
                    } ms-3`}></span>
            </button>
            <button
                onClick={handleLoginWithLine}
                className="bg-[#06C755] text-center mt-5 hover:bg-[#06C755]-500 hover-opacity p-4 rounded-lg text-[#FFFFFF]">
                <div className="flex items-center gap-2">
                    <img src="/LINE_logo.png" className="w-10 h-10" />
                    <div className=" font-bold ">Log in with LINE</div>
                </div>
            </button>
        </section>
    );
};

export default PhoneInput;
