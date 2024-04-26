import { Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { InsertService } from "./interfaces/service";
import { getServiceByBusinessId } from "../../api/service";
import Header from "./components/Header";
import BusinessCard from "./components/BusinessCard";
import ListServiceCard from "./components/ListServiceCard";
import { IService } from "./interfaces/service";
import { getBusinessId } from "../../api/business";
import { IBusinessInfoList } from "./interfaces/business";

export default function ServiceList() {
    const { businessId } = useParams();
    const navigate = useNavigate();
    const [services, setService] = useState<IService[]>([]);
    const [business, setBusiness] = useState<IBusinessInfoList>();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetch = async () => {
            localStorage.setItem("businessId", businessId ?? "");
            if (token !== null) {
                const services = await getServiceByBusinessId(
                    Number(businessId),
                    token
                );
                if (services !== null) {
                    setService(services);
                }
            }
        };
        const fetchBusiness = async () => {
            const businessId = localStorage.getItem("businessId");
            if (token !== null && businessId !== null) {
                const business = await getBusinessId(Number(businessId), token);
                setBusiness(business);
            }
        };
        try {
            fetch();
            fetchBusiness();
        } catch (error) {
            console.error(error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [businessId]);

    return (
        <>
            <div className="pr-4 pl-4 pt-6">
                <Header context={"Service List"} />
            </div>
            <Divider sx={{ marginTop: "16px", width: "100%" }} />
            <div className="flex flex-col gap-5 mt-3">
                {business !== undefined && (
                    <BusinessCard
                        name={business.title}
                        address={business.address}
                        daysOpen={business.daysOpen}
                        phoneNumber={business.phoneNumber}
                    />
                )}

                {services.length > 0 ? (
                    <>
                        <p style={{ background: "#F7F7F7", padding: "16px" }}>
                            All service
                        </p>
                        {services.map((item, index) => (
                            <div key={index}>
                                <ListServiceCard
                                    serviceName={item.title}
                                    price={item.price}
                                    description={item.description}
                                    currency={item.currency}
                                    openTime={item.openTime}
                                    closeTime={item.closeTime}
                                    daysOpen={item.daysOpen}
                                />
                            </div>
                        ))}
                    </>
                ) : (
                    <p style={{ background: "#F7F7F7", padding: "16px" }}>
                        There is no service to shows. Please add new service.
                    </p>
                )}
                <button
                    onClick={() => navigate("/serviceInfo")}
                    style={{ background: "#F7F7F7", padding: "16px" }}>
                    + Add new
                </button>
            </div>
        </>
    );
}
