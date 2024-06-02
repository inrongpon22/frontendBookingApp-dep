import { useEffect, useState } from "react";
import { getLineProfile } from "../../api/user";
import Loading from "../../components/dialog/Loading";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getBusinessByUserId } from "../../api/business";

export default function CallBack() {
    const queryParams = new URLSearchParams(location.search);
    const accessToken = queryParams.get("accessToken");
    const requestBy = queryParams.get("requestBy");
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
                await getBusinessByUserId(userId).then((res) => {
                    setTimeout(() => {
                        setIsLoading(false);
                        navigate(`/business-profile/${res[0].id}`);
                    }, 5000);
                })
                    .catch((err) => {
                        if (err.response.status === 404) {
                            setTimeout(() => {
                                setIsLoading(false);
                                navigate("/create-business");
                            }, 5000);
                        } else {
                            console.log(err.message);
                            toast.error("มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง");
                        }
                    });
            } else if (requestBy === "customer") {
                setTimeout(() => {
                    setIsLoading(false);
                    navigate("/details/12");
                }, 5000);
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
