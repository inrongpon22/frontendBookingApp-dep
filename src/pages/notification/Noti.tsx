/** @format */

import Header from "./components/Header";
import NotiCard from "./components/NotiCard";
import { useNavigate } from "react-router-dom";
import { Divider } from "@mui/material";
// Assuming you have imported the component

export default function Noti() {
	const navigate = useNavigate();

	return (
		<>
			<div>
				<div className='px-4 pt-6'>
					<Header
						context={"Notification"}
						isClose={false}
						handleClose={() => navigate(-1)}
					/>
				</div>
				<Divider sx={{ marginTop: "16px", width: "100%" }} />
				<div className='flex flex-col p-4'>
					<div>Today</div>
					<NotiCard />
					<NotiCard />
					<NotiCard />
				</div>
			</div>
		</>
	);
}
