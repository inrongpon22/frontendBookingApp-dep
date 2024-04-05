import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function OTP() {
    const navigate = useNavigate();
    return (
        <div className="pr-4 pl-4 pt-4">
            <div className="flex flex-col">
                <IconButton
                    onClick={() => navigate("/userLogin")}
                    sx={{ width: "20px", height: "20px" }}>
                    <ArrowBackIosNewOutlinedIcon
                        sx={{ fontSize: "20px", color: "#000000" }}
                    />
                </IconButton>
                <p className="mt-4 font-medium" style={{ fontSize: "17px" }}>
                    Enter the 6-digit security code we send to you at ******1234
                </p>
                <input
                    className="mt-6 border border-black rounded-lg p-4 no-hover focus:outline-none"
                    placeholder="OTP code here."
                    style={{ width: "343px", height: "51px" }}
                />
                <div
                    className="pr-2 pl-2 pt-1 pb-1 mt-6 rounded-lg"
                    style={{
                        background: "#D9D9D9",
                        width: "163px",
                        height: "27px",
                        fontSize: "14px",
                    }}>
                    I didn’t receive a code
                </div>
                <button
                    className="bg-black text-white mt-6 rounded-lg font-semibold"
                    style={{
                        width: "343px",
                        height: "51px",
                        cursor: "pointer",
                    }}>
                    Log in
                </button>
            </div>
        </div>
    );
}
