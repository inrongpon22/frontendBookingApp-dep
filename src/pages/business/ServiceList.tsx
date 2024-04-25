import { Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { InsertService } from "./interfaces/service";
import { getServiceByBusinessId } from "../../api/service";
import Header from "./components/Header";
import BusinessCard from "./components/BusinessCard";
import ListServiceCard from "./components/ListServiceCard";
import { IService } from "./interfaces/service";

export default function ServiceList() {
    const { businessId } = useParams();
    const navigate = useNavigate();
    const [services, setService] = useState<IService[]>([]);

    useEffect(() => {
        const fetch = async () => {
            localStorage.setItem('businessId', businessId ?? "");
            const services = await getServiceByBusinessId(Number(businessId));
            setService(services);
        };
        try {
            fetch();
        } catch (error) {
            console.error(error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [businessId]);

    return (
        <div>
            {services.length > 0 && (
                <>
                    <div className="pr-4 pl-4 pt-6">
                        <Header context={"Service List"} />
                    </div>
                    <Divider sx={{ marginTop: "16px", width: "100%" }} />
                    <div className="flex flex-col gap-5 mt-3">
                        <BusinessCard name={services[0].businessName} address={services[0].address} daysOpen={services[0].daysOpen} phoneNumber={services[0].phoneNumber} />
                        <p style={{ background: "#F7F7F7", padding: "16px" }} >All service</p>
                        {
                            services.map((item, index) => (
                                <div key={index}>
                                    <ListServiceCard serviceName={item.title} price={item.price} description={item.description} currency={item.currency} openTime={item.openTime} closeTime={item.closeTime} daysOpen={item.daysOpen} />
                                </div>
                            ))
                        }
                        <button onClick={() => navigate("/serviceInfo")} style={{ background: "#F7F7F7", padding: "16px" }}>
                            + Add new
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
