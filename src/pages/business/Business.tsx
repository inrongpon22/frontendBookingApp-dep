// import { useNavigate } from "react-router-dom";

export default function Business() {
    // const navigate = useNavigate();
    return (
        <div style={{ background: "#D9D9D9", height: "100vh" }}>
            <div
                className="pt-8"
                style={{
                    paddingRight: "53px",
                    paddingLeft: "53px",
                    background: "#F7F7F7",
                }}>
                <div className="flex flex-col w-full">
                    <p
                        className="font-semibold"
                        style={{ textAlign: "center", fontSize: "25px" }}>
                        Book. Build. Thrive.
                    </p>
                    <p style={{ color: "#4C4C4C", textAlign: "center" }}>
                        Elevate your booking experience quickly and
                        conveniently.
                    </p>
                    <div className="w-full flex justify-center">
                        <button
                            // onClick={() => navigate()}
                            className="text-white mt-4 rounded-lg font-semibold mb-6"
                            style={{
                                width: "180px",
                                height: "43px",
                                cursor: "pointer",
                                backgroundColor: "#020873",
                                fontSize: "14px",
                            }}>
                            Get started
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
