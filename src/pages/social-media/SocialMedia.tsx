import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/social-media/Header";
import { t } from "i18next";
import { Divider, alpha } from "@mui/material";
import { useEffect, useState } from "react";
import Loading from "../../components/dialog/Loading";
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import { connectToLine, connectToPhone, getUserIdByAccessToken, getUserPhoneLine } from "../../api/user";

export default function SocialMedia() {
	const navigate = useNavigate();
	const { businessId } = useParams();
	const [isLoadding, setIsLoading] = useState<boolean>(false);
	const queryParams = new URLSearchParams(location.search);
	const [userPhoneLine, setUserPhoneLine] = useState<{ phoneNumber: string; line_userId: string; }>();
	const connectTo = queryParams.get("connectTo");

	useEffect(() => {
		const fetch = async () => {
			const token = localStorage.getItem("token");
			const accessToken = localStorage.getItem("accessToken");
			const userId = await getUserIdByAccessToken(accessToken ?? "", token ?? "");
			const userPhoneLine = await getUserPhoneLine(userId);
			setUserPhoneLine(userPhoneLine);

		};
		if (businessId) fetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleConnectToLine = async () => {
		const token = localStorage.getItem("token");
		const accessToken = localStorage.getItem("accessToken");
		const userId = await getUserIdByAccessToken(accessToken ?? "", token ?? "");
		setIsLoading(true);
		await connectToLine(userId, businessId ?? "");
		setIsLoading(false);
	};

	const handleConnectToPhone = async () => {
		const token = localStorage.getItem("token");
		const accessToken = localStorage.getItem("accessToken");
		const userId = await getUserIdByAccessToken(accessToken ?? "", token ?? "");
		setIsLoading(true);
		await connectToPhone(userId);
		setIsLoading(false);
	};

	return (
		<div className="flex flex-col">
			<Loading openLoading={isLoadding} />
			<div className="px-4 pt-6">
				<Header
					context={t("title:socialmediaaccounts")}
					handleClose={() => navigate(-1)}
				/>
			</div>
			<Divider sx={{ marginTop: "16px", width: "100%" }} />
			<div>
				{
					connectTo === "phone" ?
						<div className="flex justify-between px-4 py-4">
							<div className="flex items-center">
								<PhoneAndroidIcon sx={{ width: "32px", height: "32px" }} />
								<div className="flex-col ml-3">
									<div className="font-bold" style={{ fontFamily: "Jakarta Sans, sans-serif" }}>PHONE</div>
									<div className="text-[12px] text-[#A1A1A1]">
										{
											userPhoneLine && userPhoneLine?.phoneNumber == "" ? t("desc:unconnected") : t("desc:connected")
										}
									</div>
								</div>
							</div>

							<div className="flex items-center">
								<button
									style={{ fontFamily: "Jakarta Sans, sans-serif", backgroundColor: alpha("#35398F", 0.1) }}
									className="text-[#35398F] font-bold text-sm p-[8px] rounded-md ">
									{
										userPhoneLine && userPhoneLine?.phoneNumber == "" ? t("button:connect") : t("button:disconnect")
									}
								</button>
							</div>
						</div>
						:
						<div className="flex justify-between px-4 py-4">
							<div className="flex items-center">
								<img src="/LINE_logo.png" className="w-8 h-8 " />
								<div className="flex-col ml-3">
									<div className="font-bold" style={{ fontFamily: "Jakarta Sans, sans-serif" }}>LINE</div>
									<div className="text-[12px] text-[#A1A1A1]">
										{
											userPhoneLine && userPhoneLine?.line_userId == "" ? t("desc:unconnected") : t("desc:connected")
										}
									</div>
								</div>
							</div>
							<div className="flex items-center">
								<button
									onClick={handleConnectToLine}
									style={{ fontFamily: "Jakarta Sans, sans-serif", backgroundColor: alpha("#35398F", 0.1) }}
									className="text-[#35398F] font-bold text-sm p-[8px] rounded-md ">
									{
										userPhoneLine && userPhoneLine?.line_userId == "" ? t("button:connect") : t("button:disconnect")
									}
								</button>
							</div>
						</div>
				}
				<Divider sx={{ width: "100%" }} />
				<p className="text-xs p-2 flex justify-center">{t("desc:coneectLine")}</p>
			</div>
		</div>
	);
}
