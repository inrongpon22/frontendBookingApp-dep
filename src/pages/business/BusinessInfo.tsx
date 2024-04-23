import LocationCard from "./components/LocationCard";
import AddIcon from "@mui/icons-material/Add";
import * as Yup from "yup";
import { IBusinessInfo, ILocation, IaddBusiness } from "./interfaces/business";
import { ChangeEvent, useState } from "react";
import { useFormik } from 'formik';
import { Badge, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { supabase } from "../../helper/createSupabase";


interface IParameter {
    locationData: ILocation;
    businessInfo: IBusinessInfo;
    handleBusinessChange: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void;
    businessData: (inputData: IaddBusiness) => void;
}

export default function BusinessInfo(props: IParameter) {
    const [file, setFile] = useState<File[]>([]);
    const [imagesURL, setImagesURL] = useState<string[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);

    const schema = Yup.object().shape({
        title: Yup.string()
            .min(2, 'Title must be at least 2 characters')
            .max(50, 'Title must be at most 50 characters')
            .required('Title is required'),
        phoneNumber: Yup.string()
            .matches(/^[0-9]+$/, 'Phone number must contain only digits')
            .min(10, 'Phone number must be at least 10 digits')
            .max(10, 'Phone number must be at most 10 digits')
            .required('Phone number is required'),
        description: Yup.string()
            .max(200, 'Description must be at most 200 characters')
    });

    function generateUniqueRandomNumber() {
        let randomNumber;
        const generatedNumbers = new Set();

        do {
            randomNumber = Math.floor(10000 + Math.random() * 90000); // Generate a random 5-digit number
        } while (generatedNumbers.has(randomNumber)); // Check if the number has been generated before

        generatedNumbers.add(randomNumber); // Add the generated number to the set of generated numbers
        return randomNumber;
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const fileReader = new FileReader();
            const newFile = e.target.files ? e.target.files[0] : null;
            if (newFile) {
                fileReader.onload = () => {
                    const previewURL = fileReader.result as string;
                    setPreviewImages(pre => {
                        return [...pre, previewURL];
                    });
                };

                fileReader.readAsDataURL(newFile);
            }

            setFile(prevFiles => {
                if (newFile) {
                    return [...prevFiles, newFile];
                } else {
                    return prevFiles;
                }
            });
        }
    };

    const handleFormSubmit = async () => {
        const uniqueRandomNumber = generateUniqueRandomNumber();
        if (file) {
            file.forEach(async element => {
                const { data, error } = await supabase.storage
                    .from("BookingSystem/images")
                    .upload(file !== null ? element.name + `${uniqueRandomNumber}` : "", element);
                if (error) {
                    console.error(error);
                } else {
                    console.log(data.path);
                    if (imagesURL.length > 1) {
                        setImagesURL(prevImagesURL => {
                            return [...prevImagesURL, data.path];
                        });
                    } else {
                        setImagesURL([data.path]);
                    }
                }
            });
        } else {
            return;
        }
    };

    const formik = useFormik({
        initialValues: {
            title: props.businessInfo.title || '',
            phoneNumber: props.businessInfo.phoneNumber || '',
            description: props.businessInfo.description || ''
        },
        validationSchema: schema,
        onSubmit: (values) => {
            handleFormSubmit();
            const insertData = {
                title: values.title,
                imagesURL: imagesURL,
                description: values.description,
                phoneNumber: values.phoneNumber,
                address: props.locationData.address,
                latitude: props.locationData.lat,
                longitude: props.locationData.lng,
                userId: 13,
            };
            props.businessData(insertData);
            // insertBusiness(insertData);
        }
    });

    const handleClearImages = (index: number) => {
        setPreviewImages((prevImages) => {
            const newImages = [...prevImages];
            newImages.splice(index, 1);
            return newImages;
        });
        setFile(prevFiles => {
            const newImages = [...prevFiles];
            newImages.splice(index, 1);
            return newImages;
        });
    };

    return (
        <>
            <div className="flex flex-col">
                <LocationCard address={props.locationData.address} />
                <p className="mt-4 font-semibold">Business Info</p>
                <form onSubmit={formik.handleSubmit}>
                    <input
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        type="text"
                        name="title"
                        style={{ color: "#8B8B8B" }}
                        placeholder="Name"
                        className={`mt-1 w-full p-4 border-black-50 text-sm border rounded-lg focus:outline-none ${formik.errors?.title
                            ? "border-2 border-rose-500"
                            : "border border-black-50"
                            }`}
                    />
                    {formik.touched.title && formik.errors.title ? (
                        <div className="text-red-500">{formik.errors.title}</div>
                    ) : null}
                    <input
                        name="phoneNumber"
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        type="text"
                        style={{ color: "#8B8B8B" }}
                        placeholder="Phone number"
                        className={`mt-2 w-full p-4 text-sm border rounded-lg focus:outline-none ${formik.errors?.phoneNumber
                            ? "border-2 border-rose-500"
                            : "border border-black-50"
                            }`}
                    />
                    {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                        <div className="text-red-500">{formik.errors.phoneNumber}</div>
                    ) : null}
                    <input
                        type="text"
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        style={{ color: "#8B8B8B" }}
                        placeholder="Short describe (optional)"
                        className="mt-2 w-full p-4 border-black-50 text-sm border rounded-lg focus:outline-none"
                    />


                    <div className="mt-4 flex">
                        <div className="font-semibold mr-1">Image</div>
                        <div style={{ color: "gray" }}>(optional)</div>
                    </div>
                    <div className="flex gap-4 flex-wrap">

                        {previewImages.map((image, index) => (
                            <div key={index} className="mt-3">
                                <Badge onClick={() => handleClearImages(index)} badgeContent={<IconButton size="small" sx={{ background: "black", ":hover": { background: "black" } }}>
                                    <CloseIcon sx={{ fontSize: "12px", color: "white" }} />
                                </IconButton>}>
                                    <img src={image}
                                        className="rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out"
                                        style={{ width: "100px", height: "100px", objectFit: "cover" }} />
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

                    </div>
                    <div className="w-full flex justify-center mt-8">
                        <button
                            type="submit"
                            // onClick={() => navigate()}
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
        </>
    );
}
