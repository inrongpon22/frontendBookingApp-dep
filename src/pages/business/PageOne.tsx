import LocationCard from "../../components/business/LocationCard";

export default function PageOne() {
    return (
        <>
            <div className="flex flex-col">
                <p className="font-bold" style={{ fontSize: "22px" }}>
                    Business name
                </p>
                <p style={{ fontSize: "14px" }}>
                    How people should recognize you.
                </p>
                <LocationCard
                    address={
                        "8, 4 Soi Champee, Tambon Su Thep, Mueang Chiang Mai District, Chiang Mai 50200"
                    }
                />
            </div>
        </>
    );
}
