import LocationCard from "./components/LocationCard";
import AddIcon from "@mui/icons-material/Add";

export default function BusinessInfo() {
    const locationData = JSON.parse(localStorage.getItem("locationData") ?? "");

    return (
        <>
            <div className="flex flex-col">
                <LocationCard address={locationData.address} />
                <p className="mt-4 font-semibold">Business Info</p>
                <input
                    type="text"
                    style={{ color: "#8B8B8B" }}
                    placeholder="Name"
                    className="mt-1 w-full p-4 border-black-50 text-sm border rounded-lg focus:outline-none"
                />
                <input
                    type="text"
                    style={{ color: "#8B8B8B" }}
                    placeholder="Categories (optional)"
                    className="mt-2 w-full p-4 border-black-50 text-sm border rounded-lg focus:outline-none"
                />
                <input
                    type="text"
                    style={{ color: "#8B8B8B" }}
                    placeholder="Short describe (optional)"
                    className="mt-2 w-full p-4 border-black-50 text-sm border rounded-lg focus:outline-none"
                />
                <div className="mt-4 flex">
                    <div className="font-semibold mr-1">Image</div>
                    <div style={{ color: "gray" }}>(optional)</div>
                </div>
                <div className="flex justify-between">
                    <div
                        className="outline-dashed outline-1 outline-offset-1 flex items-center justify-center rounded-lg mt-2"
                        style={{ width: "100px", height: "100px" }}>
                        <label
                            htmlFor="fileInput"
                            style={{ cursor: "pointer" }}>
                            <input
                                id="fileInput"
                                type="file"
                                style={{ display: "none" }}
                                // onChange={(e) =>
                                //     handleFileChange(e.target.files[0])
                                // }
                            />
                            <AddIcon />
                        </label>
                    </div>
                    <div
                        className="outline-dashed outline-1 outline-offset-1 flex items-center justify-center rounded-lg mt-2"
                        style={{ width: "100px", height: "100px" }}>
                        <label
                            htmlFor="fileInput"
                            style={{ cursor: "pointer" }}>
                            <input
                                id="fileInput"
                                type="file"
                                style={{ display: "none" }}
                                // onChange={(e) =>
                                //     handleFileChange(e.target.files[0])
                                // }
                            />
                            <AddIcon />
                        </label>
                    </div>
                    <div
                        className="outline-dashed outline-1 outline-offset-1 flex items-center justify-center rounded-lg mt-2"
                        style={{ width: "100px", height: "100px" }}>
                        <label
                            htmlFor="fileInput"
                            style={{ cursor: "pointer" }}>
                            <input
                                id="fileInput"
                                type="file"
                                style={{ display: "none" }}
                                // onChange={(e) =>
                                //     handleFileChange(e.target.files[0])
                                // }
                            />
                            <AddIcon />
                        </label>
                    </div>
                </div>
                <div className="w-full flex justify-center mt-8">
                    <button
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
            </div>
        </>
    );
}
