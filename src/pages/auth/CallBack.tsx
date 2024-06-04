import {  useEffect, useState } from "react";
import { getLineProfile } from "../../api/user";
import Loading from "../../components/dialog/Loading";
import { useNavigate } from "react-router-dom";
import { getBusinessByUserId } from "../../api/business";

export default function CallBack() {
    const queryParams = new URLSearchParams(location.search);
    const accessToken = queryParams.get("accessToken");
    const requestBy = queryParams.get("requestBy");
    const businessId = localStorage.getItem("businessId");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        let userId: string;
        const fetchData = async () => {
            await getLineProfile(accessToken ?? "")
                .then((res) => {
                    localStorage.setItem("token", res.token);
                    localStorage.setItem("accessToken", res.sessionToken);
                    userId = res.userId;
                })
                .catch((err) => {
                    console.log(err);
                });

            if (requestBy == "business") {
                console.log("business", requestBy);
                const business = await getBusinessByUserId(userId);
                if (business) {
                    setTimeout(() => {
                        setIsLoading(false);
                        navigate(
                            `/business-profile/${business.businessData?.id}`
                        );
                    }, 5000);
                } else {
                    setTimeout(() => {
                        setIsLoading(false);
                        navigate("/create-business");
                    }, 5000);
                }
            } else if (requestBy === "customer") {
                console.log("customer", requestBy, businessId);
                setIsLoading(false);
                navigate(`/details/${businessId}`);
            }
        };
        if (accessToken) {
            fetchData();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <Loading openLoading={isLoading} />
        </div>
    );
}
