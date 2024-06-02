import { useEffect, useState } from "react";
import { getLineProfile } from "../../api/user";
import Loading from "../../components/dialog/Loading";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { app_api } from "../../helper/url";

export default function CallBack() {
    const queryParams = new URLSearchParams(location.search);
    const accessToken = queryParams.get("accessToken");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        let userId: string;
        let token: string;
        const fetchData = async () => {
            await getLineProfile(accessToken ?? "")
                .then((res) => {
                    localStorage.setItem("token", res.token);
                    localStorage.setItem("accessToken", res.sessionToken);
                    userId = res.userId;
                    token = res.token;
                })
                .catch((err) => {
                    console.log(err);
                });
            await axios
                .get(`${app_api}/getBusinessByUserId/${userId}`, {
                    headers: {
                        Authorization: token,
                    },
                })
                .then((resp) => {
                    setTimeout(() => {
                        if (resp.status === 200) {
                            setIsLoading(false);
                            navigate(`/business-profile/${resp.data[0].id}`);
                        }
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
