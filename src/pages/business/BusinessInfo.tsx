// import AddIcon from "@mui/icons-material/Add";
import * as Yup from "yup";
import { ILocation } from "./interfaces/business";
import { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import { alpha } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

import { useNavigate } from "react-router-dom";
// import { supabase } from "../../helper/createSupabase";
import SearchMap from "./SearchMap";
import { dayOfWeek } from "../../helper/daysOfWeek"; // dataOfWeekEng, dataOfWeekThai,
import { insertBusiness, updateBusiness } from "../../api/business";
import { useTranslation } from "react-i18next";
import moment from "moment";
import useSWR from "swr";
import { app_api, fetcher } from "../../helper/url";
import { GlobalContext } from "../../contexts/BusinessContext";
import { getUserIdByAccessToken } from "../../api/user";
import toast from "react-hot-toast";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export default function BusinessInfo() {
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const businessId = queryParams.get("businessId");
    // const userId = localStorage.getItem("userId");

    const { setShowDialog } = useContext(GlobalContext);
    const {
        t,
        i18n: { language },
    } = useTranslation();

    const token = localStorage.getItem("token");
    const accessToken = localStorage.getItem("accessToken");
    const [userId, setUserId] = useState<number | null>(0);
    if (accessToken && token) {
        (async () => {
            const res = await getUserIdByAccessToken(accessToken, token);
            setUserId(res);
        })();
    }

    // const [file, setFile] = useState<File[]>([]);
    // const [previewImages, setPreviewImages] = useState<string[]>([]);
    // const { data: businessData } = useSWR<any>(
    //     businessId && `${app_api}/business/${businessId ?? ""}`,
    //     fetcher
    // );
    // const businessInfo: IBusinessInfo = {
    //     title: businessData.title || "",
    //     daysOpen: businessData.daysOpen || [],
    //     openTime: businessData.openTime || "",
    //     closeTime: businessData.closeTime || "",
    //     location: businessData.address || "",
    //     description: businessData.description || "",
    //     phoneNumber: businessData.phoneNumber || "",
    // };
    // const [locationData, setLocationData] = useState<ILocation>({
    //     lat: businessData.latitude || 0,
    //     lng: businessData.longitude || 0,
    //     address: businessData.address || "",
    // });
    // const [daysOpen, setDaysOpen] = useState<string[]>(
    //     businessData.daysOpen || []
    // );

    const { data: businessData } = useSWR(
        businessId && `${app_api}/business/${businessId ?? ""}`,
        fetcher
    );

    const [locationData, setLocationData] = useState<ILocation>({
        lat: 0,
        lng: 0,
        address: "",
    });

    const [daysOpen, setDaysOpen] = useState<string[]>([]);
    const schema = Yup.object().shape({
        title: Yup.string()
            .min(2, t("formValidation:business:create:shopName:shopNameMin"))
            .max(50, t("formValidation:business:create:shopName:shopNameMax"))
            .required(t("formValidation:business:create:shopName:shopNameReq")),
        daysOpen: Yup.array()
            .of(
                Yup.string().required(
                    t("formValidation:business:create:daysOpen:req")
                )
            )
            .min(1, t("formValidation:business:create:daysOpen:req"))
            .required(t("formValidation:business:create:daysOpen:req")),
        openTime: Yup.string().required(
            t("formValidation:business:create:openTime:req")
        ),
        closeTime: Yup.string()
            .required(t("formValidation:business:create:closeTime:req"))
            .test(
                "is-greater",
                t("formValidation:business:create:closeTime:moreThanOpenTime"),
                function (value) {
                    const { openTime } = this.parent;
                    return moment(value, "HH:mm").isAfter(
                        moment(openTime, "HH:mm")
                    );
                }
            ),
        phoneNumber: Yup.string()
            .matches(
                /^[0-9]+$/,
                t("formValidation:business:create:phoneNumber:phoneNumberMatch")
            )
            .min(
                10,
                t("formValidation:business:create:phoneNumber:phoneNumberMin")
            )
            .max(
                10,
                t("formValidation:business:create:phoneNumber:phoneNumberMax")
            )
            .required(
                t("formValidation:business:create:phoneNumber:phoneNumberReq")
            ),
        location: Yup.string().required(
            t("formValidation:business:create:location:locationReq")
        ),
        description: Yup.string().max(
            200,
            t("formValidation:business:create:description:descriptionMax")
        ),
    });

    useEffect(() => {
        if (businessData) {
            setLocationData({
                lat: businessData.latitude || 0,
                lng: businessData.longitude || 0,
                address: businessData.address || "",
            });

            setDaysOpen(businessData.daysOpen || []);
            formik.setFieldValue("title", businessData.title);
            formik.setFieldValue("openTime", businessData.openTime);
            formik.setFieldValue("closeTime", businessData.closeTime);
            formik.setFieldValue("phoneNumber", businessData.phoneNumber);
            formik.setFieldValue("description", businessData.description);
            formik.setFieldValue("location", businessData.address);
            formik.setFieldValue("daysOpen", businessData.daysOpen);
            handleChangeLocation({
                lat: businessData.latitude,
                lng: businessData.longitude,
                address: businessData.address,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [businessData]);

    const handleChangeLocation = (inputData: ILocation) => {
        formik.setFieldValue("location", inputData.address);
        setLocationData(inputData);
    };

    const formik = useFormik({
        initialValues: {
            title: "",
            daysOpen: [],
            openTime: "",
            closeTime: "",
            phoneNumber: "",
            location: "",
            description: "",
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            const imagesURL: string[] = [];
            // const uniqueRandomNumber = generateUniqueRandomNumber();
            // if (file.length > 0) {
            //     for (const element of file) {
            //         const { data, error } = await supabase.storage
            //             .from("BookingSystem/images")
            //             .upload(
            //                 file !== null
            //                     ? element.name + `${uniqueRandomNumber}`
            //                     : "",
            //                 element
            //             );
            //         if (error) {
            //             console.error(error);
            //         } else {
            //             console.log(data.path);
            //             imagesURL.push(data.path);
            //         }
            //     }

            //     const insertData = {
            //         title: values.title,
            //         imagesURL: imagesURL,
            //         description: values.description,
            //         phoneNumber: values.phoneNumber,
            //         address: locationData.address,
            //         latitude: locationData.lat,
            //         longitude: locationData.lng,
            //         daysOpen: daysOpen,
            //         openTime: values.openTime,
            //         closeTime: values.closeTime,
            //         userId: userId ? Number(userId) : 0,
            //     };

            //     if (token === null) {
            //         throw new Error("Token is not found");
            //     }

            //     const business = await insertBusiness(insertData, token);

            //     localStorage.setItem(
            //         "businessId",
            //         String(business.data.businessId)
            //     );
            //     navigate(`/service-info/${business.data.businessId}?step=1`);
            // } else {
            //     const insertData = {
            //         title: values.title,
            //         imagesURL: imagesURL,
            //         description: values.description,
            //         phoneNumber: values.phoneNumber,
            //         address: locationData.address,
            //         latitude: locationData.lat,
            //         longitude: locationData.lng,
            //         daysOpen: daysOpen,
            //         openTime: values.openTime,
            //         closeTime: values.closeTime,
            //         userId: userId ? Number(userId) : 0,
            //     };
            //     console.log(insertData);

            //     if (token === null) {
            //         throw new Error("Token is not found");
            //     }

            //     const business = await insertBusiness(insertData, token);

            //     localStorage.setItem(
            //         "businessId",
            //         String(business.data.businessId)
            //     );
            //     navigate(`/service-info/${business.data.businessId}?step=1`);
            // }
            const insertData = {
                title: values.title,
                imagesURL: imagesURL,
                description: values.description,
                phoneNumber: values.phoneNumber,
                address: locationData.address,
                latitude: locationData.lat,
                longitude: locationData.lng,
                daysOpen: daysOpen,
                openTime: values.openTime,
                closeTime: values.closeTime,
                userId: userId ? Number(userId) : 0,
            };

            if (token === null) {
                throw new Error("Token is not found");
            }

            if (businessId) {
                const business = await updateBusiness(
                    insertData,
                    Number(businessId),
                    token
                );
                localStorage.setItem(
                    "businessId",
                    String(business.data.businessId)
                );
                setShowDialog(false);
                toast(t("addBusiness"), {
                    icon: <CheckCircleOutlineIcon sx={{ color: "green" }} />,
                });
                navigate(`/service-info/${business.data.businessId}?step=1`);
            } else {
                const business = await insertBusiness(insertData, token);
                localStorage.setItem(
                    "businessId",
                    String(business.data.businessId)
                );
                setShowDialog(false);
                toast(t("addBusiness"), {
                    icon: <CheckCircleOutlineIcon sx={{ color: "green" }} />,
                });
                navigate(`/service-info/${business.data.businessId}?step=1`);
            }
        },
    });

    // function generateUniqueRandomNumber() {
    //     let randomNumber;
    //     const generatedNumbers = new Set();

    //     do {
    //         randomNumber = Math.floor(10000 + Math.random() * 90000); // Generate a random 5-digit number
    //     } while (generatedNumbers.has(randomNumber)); // Check if the number has been generated before

    //     generatedNumbers.add(randomNumber); // Add the generated number to the set of generated numbers
    //     return randomNumber;
    // }

    // const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    //   if (e.target.files && e.target.files.length > 0) {
    //     const fileReader = new FileReader();
    //     const newFile = e.target.files ? e.target.files[0] : null;
    //     if (newFile) {
    //       fileReader.onload = () => {
    //         const previewURL = fileReader.result as string;
    //         setPreviewImages((pre) => {
    //           return [...pre, previewURL];
    //         });
    //       };

    //       fileReader.readAsDataURL(newFile);
    //     }

    //     setFile((prevFiles) => {
    //       if (newFile) {
    //         return [...prevFiles, newFile];
    //       } else {
    //         return prevFiles;
    //       }
    //     });
    //   }
    // };

    // const handleClearImages = (index: number) => {
    //   setPreviewImages((prevImages) => {
    //     const newImages = [...prevImages];
    //     newImages.splice(index, 1);
    //     return newImages;
    //   });
    //   setFile((prevFiles) => {
    //     const newImages = [...prevFiles];
    //     newImages.splice(index, 1);
    //     return newImages;
    //   });
    // };

    const isDaySelected = (dayValue: string) => {
        return daysOpen.includes(dayValue);
    };

    const toggleDay = (dayValue: string) => {
        if (isDaySelected(dayValue)) {
            setDaysOpen(daysOpen.filter((day) => day !== dayValue));
            formik.setFieldValue(
                "daysOpen",
                formik.values.daysOpen.filter((day) => day !== dayValue)
            );
        } else {
            setDaysOpen([...daysOpen, dayValue]);
            formik.setFieldValue("daysOpen", [
                ...formik.values.daysOpen,
                dayValue,
            ]);
        }
    };

    return (
        <>
            <div className="flex flex-col">
                <form onSubmit={formik.handleSubmit}>
                    <p
                        style={{ fontSize: "14px" }}
                        className="mt-4 font-semibold">
                        {t("form:business:create:shopName")}
                    </p>
                    <input
                        {...formik.getFieldProps("title")}
                        onBlur={formik.handleBlur}
                        type="text"
                        name="title"
                        style={{
                            borderColor: `${alpha("#000000", 0.2)}`,
                        }}
                        placeholder={t("placeholder:shopName")}
                        className={`mt-1 w-full p-4 border-black-50 text-sm border rounded-lg focus:outline-none ${
                            formik.errors?.title
                                ? "border-2 border-rose-500"
                                : "border border-black-50"
                        }`}
                    />
                    {formik.touched.title && formik.errors.title ? (
                        <div className="text-red-500 mt-1">
                            {formik.errors.title}
                        </div>
                    ) : null}
                    <p
                        style={{ fontSize: "14px" }}
                        className="mt-4 font-semibold">
                        {t("form:business:create:location")}
                    </p>
                    <SearchMap
                        handleChangeLocation={handleChangeLocation}
                        oldAddress={locationData.address}
                    />
                    {formik.touched.location && formik.errors.location ? (
                        <div className="text-red-500 mt-1">
                            {formik.errors.location}
                        </div>
                    ) : null}
                    <p
                        style={{ fontSize: "14px" }}
                        className="mt-4 font-semibold">
                        {t("form:business:create:openTime")}
                    </p>
                    <div className="flex justify-between mt-1">
                        {dayOfWeek(language)?.map((day, index) => (
                            <div
                                onClick={() => toggleDay(day.value)}
                                key={index}
                                style={{
                                    width: "45px",
                                    height: "47px",
                                    borderColor: isDaySelected(day.value)
                                        ? "#020873"
                                        : `${alpha("#000000", 0.2)}`,
                                    backgroundColor: isDaySelected(day.value)
                                        ? "rgb(2, 8, 115,0.2)"
                                        : "white",
                                }}
                                className={`
                            ${
                                isDaySelected(day.value)
                                    ? "border-custom-color border-2"
                                    : "border-black-50 border"
                            }
                            flex items-center justify-center rounded-lg`}>
                                {day.name}
                            </div>
                        ))}
                    </div>
                    {formik.touched.daysOpen && formik.errors.daysOpen ? (
                        <div className="text-red-500 mt-1">
                            {formik.errors.daysOpen}
                        </div>
                    ) : null}
                    <div className="flex justify-between mt-2">
                        <div
                            style={{
                                width: "156px",
                                height: "51px",
                                borderColor: `${alpha("#000000", 0.2)}`,
                            }}
                            className="rounded-lg focus:outline-none flex gap-1 border-black-50 border justify-between items-center p-4">
                            <div
                                style={{
                                    fontSize: "14px",
                                    marginRight: "15px",
                                }}>
                                {t("from")}
                            </div>
                            <div className="flex">
                                <input
                                    className="font-black-500 focus:outline-none"
                                    {...formik.getFieldProps("openTime")}
                                    type="time"
                                    style={{
                                        border: "none",
                                    }}
                                    value={formik.values.openTime}
                                />
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                            -
                        </div>
                        <div
                            style={{
                                width: "156px",
                                height: "51px",
                                borderColor: `${alpha("#000000", 0.2)}`,
                            }}
                            className="rounded-lg focus:outline-none flex gap-1 border-black-50 border justify-between items-center p-4">
                            <div style={{ fontSize: "14px" }}>{t("to")}</div>
                            <div className="flex">
                                <input
                                    className="focus:outline-none"
                                    {...formik.getFieldProps("closeTime")}
                                    type="time"
                                    style={{ border: "none" }}
                                    value={formik.values.closeTime}
                                />
                            </div>
                        </div>
                    </div>
                    {formik.touched.closeTime && formik.errors.closeTime ? (
                        <div className="text-red-500 mt-1">
                            {formik.errors.closeTime}
                        </div>
                    ) : null}
                    <p
                        style={{ fontSize: "14px" }}
                        className="mt-3 font-semibold">
                        {t("form:business:create:businessNumber")}
                    </p>
                    <input
                        name="phoneNumber"
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        type="text"
                        style={{
                            borderColor: `${alpha("#000000", 0.2)}`,
                        }}
                        placeholder={t("placeholder:businessNumber")}
                        className={`mt-1 w-full p-4 text-sm border rounded-lg focus:outline-none ${
                            formik.errors?.phoneNumber
                                ? "border-2 border-rose-500"
                                : "border border-black-50"
                        }`}
                    />
                    {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                        <div className="text-red-500 mt-1">
                            {formik.errors.phoneNumber}
                        </div>
                    ) : null}
                    <div className="flex mt-3 items-center gap-1">
                        <div
                            style={{ fontSize: "14px" }}
                            className="font-semibold">
                            {t("form:business:create:shortDescribe")}
                        </div>
                        <div style={{ fontSize: "14px" }}>
                            ({t("fragment:optional")})
                        </div>
                    </div>
                    <div
                        className="mt-1 w-full p-4 border-black-50 text-sm border rounded-lg focus:outline-none"
                        style={{
                            height: "124px",
                            borderColor: `${alpha("#000000", 0.2)}`,
                        }}>
                        <textarea
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            placeholder={t("placeholder:shortDescribe")}
                            className="w-full focus:outline-none resize-none"
                            rows={3}
                            maxLength={150}
                        />
                    </div>
                    {/* <div className="mt-4 flex">
            <div className="font-semibold mr-1">
              {t("form:business:create:images")}
            </div>
            <div style={{ color: "gray" }}>({t("fragment:optional")})</div>
          </div>
          <div className="flex gap-4 flex-wrap">
            {previewImages.map((image, index) => (
              <div key={index} className="mt-3">
                <Badge
                  onClick={() => handleClearImages(index)}
                  badgeContent={
                    <IconButton
                      size="small"
                      sx={{
                        background: "black",
                        ":hover": {
                          background: "black",
                        },
                      }}
                    >
                      <CloseIcon
                        sx={{
                          fontSize: "12px",
                          color: "white",
                        }}
                      />
                    </IconButton>
                  }
                >
                  <img
                    src={image}
                    className="rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                </Badge>
              </div>
            ))}

            <div
              className="outline-dashed outline-1 outline-offset-1 flex items-center justify-center rounded-lg mt-3"
              style={{ width: "100px", height: "100px" }}
            >
              <label htmlFor={`fileInput`} style={{ cursor: "pointer" }}>
                <input
                  id={`fileInput`}
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <AddIcon />
              </label>
            </div>
          </div> */}

                    <div className="w-full flex justify-center  inset-x-0 gap-2">
                        <button
                            type="button"
                            // disabled={!!Object.keys(formik.errors).length}
                            className={`w-full p-3 my-5 text-white text-[14px] bg-deep-blue rounded-lg font-semibold`}
                            onClick={() => {
                                formik.handleSubmit();
                            }}>
                            {t("button:next")}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
