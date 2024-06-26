import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { DialogContext } from "./DialogWrapper";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useQuery } from "../../helper/url";

const PhoneInput = () => {
    const { businessId } = useParams();
    const { t } = useTranslation();
    const query = useQuery();
    const connectTo = query.get("connectTo");

    const { formik, isLoading } = useContext(DialogContext);

    const handleLoginWithLine = async () => {
        await axios
            .get(
                `${import.meta.env.VITE_APP_API}/line-request-code/${
                    location.pathname === "/" ? "business" : "customer"
                }`
            )
            .then((res) => {
                localStorage.setItem("businessId", businessId ?? "0");
                window.location.replace(res.data.loginUrl);
            });
    };

    return (
        <section>
            <div className="flex-auto">
                <p className="text-[17px] font-semibold ">
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
                className={`w-full text-[14px] p-4 rounded-lg my-5 ${
                    formik.touched.phoneNumbers && formik.errors.phoneNumbers
                        ? "border-2 border-rose-500"
                        : "border border-black"
                }`}
                placeholder={t("ัyourPhoneNumber")}
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

            {!connectTo && (
                <>
                    <div className=" my-3 text-center ">
                        <span className="text-[14px]">{t("or")}</span>
                    </div>
                    <button
                        onClick={handleLoginWithLine}
                        className="w-full  bg-[#06C755] text-center mb-5 hover:bg-[#06C755]-500 hover-opacity p-0.5 rounded-lg text-[#FFFFFF]">
                        <div className="flex items-center gap-2 justify-center text-[14px]">
                            <img src="/LINE_logo.png" className="w-12 h-12 " />
                            <div className=" font-bold text-center">
                                {t("continueWithLINEAccount")}
                            </div>
                        </div>
                    </button>
                </>
            )}
        </section>
    );
};

export default PhoneInput;
