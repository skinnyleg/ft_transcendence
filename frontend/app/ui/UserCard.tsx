"use client"
import type { FC } from 'react';
import Image from 'next/image'
import { ChannelUser } from '../interfaces/interfaces';
import { IconWithTooltip } from './CustomIcons';
import { HiDotsVertical } from "react-icons/hi";
import UserDropDown from './UserDropDown';

interface UserCardProps {
	user: ChannelUser;
	userRole: string | undefined;
}

const UserCard: FC<UserCardProps> = ({user, userRole}) => {
		return (
		<div className='w-full h-11 mb-1 text-black flex gap-2 justify-between items-center'>
			<Image
				src={user.userPic}
				alt='user Image'
				width='45'
				height='45'
				className='rounded-full bg-teal-300'
			/>
			<div className='flex bg-teal-100 rounded-xl items-center p-2 w-full h-full justify-between'>
				<h1 className='font-bold text-xl'>
					{user.userNick}
				</h1>
				<UserDropDown
					userRole={userRole}
					userCardRole={user.userRole}
					userNick={user.userNick}
				/>
			</div>
		</div>
	);
}
export default UserCard;
