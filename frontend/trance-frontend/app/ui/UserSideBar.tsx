"use client"
import Image from 'next/image';
import type { FC } from 'react';
import { CgProfile } from "react-icons/cg";
import { IconWithTooltip } from './CustomIcons';
import { IoMdPersonAdd } from "react-icons/io";
import { LuSwords } from "react-icons/lu";

const UserData = {
	id: '1',
	userNick: 'skinnyleg',
	userPic: '/GroupChat.png',
	userRole: 'ADMIN'
}

interface UserSideBarProps {}
const UserSideBar: FC<UserSideBarProps> = ({}) => {

		return (
		<div className='w-full bg-teal-600 lg:ml-2 rounded-xl items-center justify-center gap-5 flex flex-col p-2'>
			<div className='flex flex-col  items-center gap-3 rounded-xl border-4 border-teal-500 w-fit p-2'>
				<Image
					src={UserData.userPic}
					alt='User Profile Pic'
					width={100}
					height={100}
					className='rounded-full bg-teal-300'
				/>
				<h1 className='text-lg font-bold'>{UserData.userNick}</h1>
			</div>
			<div className='flex flex-row flex-wrap gap-3 items-center'>
				<IconWithTooltip
					icon={CgProfile}
					tooltipId='PicToolTip'
					tooltipContent='View Profile'
					styles='w-8 h-8'
				/>
				<IconWithTooltip
					icon={IoMdPersonAdd}
					tooltipId='AddToolTip'
					tooltipContent='add friend'
					styles='w-7 h-7'
				/>
				<IconWithTooltip
					icon={LuSwords}
					tooltipId='ChallengeToolTip'
					tooltipContent='Challenge User'
					styles='w-8 h-8'
				/>
			</div>
		</div>
	);
}
export default UserSideBar;
