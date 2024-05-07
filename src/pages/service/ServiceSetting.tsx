import { useTranslation } from "react-i18next";
import Header from "./components/Header";
import { alpha } from "@mui/material";
import ListServiceCard from "./components/ListServiceCard";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getServiceByBusinessId } from "../../api/service";
import { IService } from "../business/interfaces/service";

export default function ServiceSetting() {
    const navigate = useNavigate();
    const { businessId } = useParams();
    const token = localStorage.getItem("token") ?? "";
    const { t } = useTranslation();
    const [services, setServices] = useState<IService[]>([]);
    const [isDeleteBoxVisible, setIsDeleteBoxVisible] = useState(false);
    const [reFresh, setReFresh] = useState(false);

    useEffect(() => {
        const fetchService = async () => {
            const services: IService[] = await getServiceByBusinessId(
                Number(businessId),
                token
            );
            setServices(services);
        };
        if (token) fetchService();
        else navigate("/");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [businessId, reFresh]);

    const toggleDeleteBox = () => {
        setIsDeleteBoxVisible(!isDeleteBoxVisible);
    };

    return (
        <div className=" overflow-y-hidden">
            <div className="pr-4 pl-4 pt-6">
                <Header
                    context={t("title:serviceInformation")}
                    toggleDeleteBox={toggleDeleteBox}
                />
            </div>
            <div className="flex pr-4 pl-4 pt-3 pb-3 mb-4 justify-center">
                <button
                    onClick={() => navigate(`/serviceInfo/${businessId}`)}
                    style={{
                        width: "343px",
                        height: "43px",
                        background: `${alpha("#020873", 0.1)}`,
                    }}
                    className="bg-primary rounded-lg p-2 mt-4">
                    {t("button:createNewService")}
                </button>
            </div>
            <div style={{ background: "#F7F7F7", height: "100vh" }}>
                <p className="pr-4 pl-4 pt-3 pb-3">
                    {t("services")} {`(${services.length})`}{" "}
                </p>
                {services.map((service, index) => (
                    <div
                        key={index}
                        className="mb-2"
                        onClick={() =>
                            navigate(
                                `/serviceDetail/${businessId}/${service.id}`
                            )
                        }>
                        <ListServiceCard
                            serviceId={service.id}
                            serviceName={service.title}
                            price={service.price}
                            description={service.description}
                            currency={service.currency}
                            openTime={service.openTime}
                            closeTime={service.closeTime}
                            daysOpen={service.daysOpen}
                            isDeleteBoxVisible={isDeleteBoxVisible}
                            handleRefresh={() => setReFresh(!reFresh)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
