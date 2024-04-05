import Map from "./Map";

export default function FindLocation() {
    return (
        <div className="pr-4 pl-4 pt-6">
            <div className="flex flex-col">
                <p className="font-bold" style={{ fontSize: "17px" }}>
                    Where people can find you?
                </p>
                <p className="text-sm mt-2" style={{ color: "#5C5C5C" }}>
                    We use address to tell people what and where your business
                    is.
                </p>
                <Map />

                <button
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
