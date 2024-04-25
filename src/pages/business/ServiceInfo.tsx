import { currencyList } from "../../helper/currency";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { IServiceInfo } from "./interfaces/business";

const validationSchema = Yup.object().shape({
    serviceName: Yup.string().required("Service name is required"),
    serviceDescription: Yup.string().required(
        "Service description is required"
    ),
    price: Yup.number()
        .required("Price is required")
        .min(0, "Price must be greater than or equal to 0"),
});

export default function ServiceInfo() {
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const editValue = Boolean(urlParams.get("edit"));
    const serviceInfo = JSON.parse(
        localStorage.getItem("serviceInfo") || "{}"
    ) as IServiceInfo;
    const formik = useFormik({
        initialValues: {
            serviceName: serviceInfo.serviceName,
            serviceDescription: serviceInfo.serviceDescription,
            currency: serviceInfo.currency,
            price: serviceInfo.price,
        },
        validationSchema: validationSchema,
        onSubmit: (values: IServiceInfo) => {
            // Handle form submission here
            const valueInString = JSON.stringify(values);
            localStorage.setItem("serviceInfo", valueInString);
            if (editValue) navigate("/createBusiness/5");
            else navigate("/createBusiness/4");
        },
    });

    return (
        <div className="flex flex-col">
            <form onSubmit={formik.handleSubmit}>
                <p style={{ fontSize: "14px" }} className="mt-4 font-semibold">
                    Service name
                </p>
                <input
                    value={formik.values.serviceName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type="text"
                    name="serviceName"
                    style={{ color: "#8B8B8B" }}
                    placeholder="fill the name of the service"
                    className={`mt-1 w-full p-4 border-black-50 text-sm border rounded-lg focus:outline-none`}
                />
                {formik.touched.serviceName && formik.errors.serviceName ? (
                    <div className="text-red-500 text-sm mt-1">
                        {formik.errors.serviceName}
                    </div>
                ) : null}

                <p style={{ fontSize: "14px" }} className="mt-3 font-semibold">
                    Service describe
                </p>
                <input
                    type="text"
                    name="serviceDescription"
                    style={{ color: "#8B8B8B" }}
                    placeholder="introduce this service to the customer"
                    className={`mt-1 w-full p-4 border-black-50 text-sm border rounded-lg focus:outline-none ${
                        formik.touched.serviceDescription &&
                        formik.errors.serviceDescription
                            ? "border-red-500"
                            : ""
                    }`}
                    value={formik.values.serviceDescription}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.serviceDescription &&
                formik.errors.serviceDescription ? (
                    <div className="text-red-500 text-sm mt-1">
                        {formik.errors.serviceDescription}
                    </div>
                ) : null}

                <p style={{ fontSize: "14px" }} className="mt-3 font-semibold">
                    Price
                </p>
                <div className="flex items-center">
                    <select
                        name="currency"
                        className="border-r-0 h-12 border border-gray-300 rounded-l-lg px-2 focus:outline-none"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.currency}>
                        {currencyList.map((item, index) => (
                            <option key={index} value={item.code}>
                                {item.code}
                            </option>
                        ))}
                    </select>
                    <input
                        style={{ textAlign: "right" }}
                        name="price"
                        type="number"
                        className={`h-12 w-full px-4 border border-gray-300 rounded-r-lg focus:outline-none ${
                            formik.touched.price && formik.errors.price
                                ? "border-red-500"
                                : ""
                        }`}
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
                {formik.touched.price && formik.errors.price ? (
                    <div className="text-red-500 text-sm mt-1">
                        {formik.errors.price}
                    </div>
                ) : null}

                <div className="w-full flex justify-center fixed bottom-0 inset-x-0 mt-8">
                    <button
                        type="submit"
                        className="text-white mt-4 rounded-lg font-semibold mb-6"
                        style={{
                            width: "343px",
                            height: "51px",
                            cursor: "pointer",
                            backgroundColor: "#020873",
                            fontSize: "14px",
                        }}>
                        Next
                    </button>
                </div>
            </form>
        </div>
    );
}
