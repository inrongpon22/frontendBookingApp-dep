/** @format */

import * as React from "react";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

export default function NoticCard() {
	return (
		<div className='flex items-center py-2 px-4 bg-gray-100 rounded-lg'>
			<div className='mr-2'>
				<FiberManualRecordIcon sx={{ fontSize: "15px", color: "#2E7CF6" }} />
			</div>
			<div className='flex items-center'>
				<div className='icon-container rounded-full bg-gray-200 p-2 mr-4'>
					<EventAvailableRoundedIcon
						sx={{
							color: "#35398F",
							fontSize: "24px",
						}}
					/>
				</div>
				<div>
					<div className='flex items-center'>
						<div className='text-sm font-medium'>New Booking:</div>
						<div className='text-sm font-bold ml-1'>Premium style</div>
					</div>
					<div className='flex items-center'>
						<div className='text-sm font-bold'>Today 17:00 - 18:30 </div>{" "}
						<FiberManualRecordIcon sx={{ fontSize: "5px" }} />{" "}
						<div className='text-sm font-normal ml-1'>Thanapol</div>
					</div>
				</div>
			</div>
			<div className='ml-auto'>
				<div className='text-sm font-normal'>Just now</div>
			</div>
		</div>
	);
}
