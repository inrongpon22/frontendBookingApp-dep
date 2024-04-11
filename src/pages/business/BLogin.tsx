import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { insertUser } from "../../api/user";
import { useNavigate } from "react-router-dom";

export default function BLogin() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const navigate = useNavigate();

    const handleContinue = async () => {
        if (phoneNumber !== "") {
            const res = await insertUser({ phoneNumber: phoneNumber });
            if (res.status == 200 || res.status == 201) {
                navigate("/OTP");
            } else {
                console.error("Error");
            }
        }
    };
    return (
        <div className="pr-4 pl-4 pt-4 flex justify-center">
            <div className="flex flex-col">
                <IconButton sx={{ width: "20px", height: "20px" }}>
                    <ClearOutlinedIcon
                        sx={{ fontSize: "20px", color: "#000000" }}
                    />
                </IconButton>
                <p className="mt-4 font-bold" style={{ fontSize: "17px" }}>
                    Phone number to continue
                </p>
                <p className="text-xs" style={{ color: "#5C5C5C" }}>
                    We use phone numbers to verify user identity.
                </p>
                <div className="flex gap-2">
                    <input
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="mt-6 border border-black rounded-lg p-4 focus:outline-none"
                        placeholder="Phone number"
                        style={{ width: "343px", height: "51px" }}
                    />
                </div>
                <button
                    onClick={handleContinue}
                    className="bg-black text-white mt-6 rounded-lg font-semibold"
                    style={{
                        width: "343px",
                        height: "51px",
                        cursor: "pointer",
                    }}>
                    Continue
                </button>
            </div>
        </div>
    );
}
