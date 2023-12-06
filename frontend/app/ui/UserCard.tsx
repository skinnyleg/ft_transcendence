"use client"
import type { FC } from 'react';
import Image from 'next/image'
import { ChannelUser } from '../interfaces/interfaces';
import { IconWithTooltip } from './CustomIcons';
import { HiDotsVertical } from "react-icons/hi";

interface UserCardProps {
	user: ChannelUser;
}

const UserCard: FC<UserCardProps> = ({user}) => {
		return (
		<div className='w-full h-11 mb-1 text-black flex gap-2  items-center'>
			<Image
				src={user.userPic}
				alt='user Image'
				width='45'
				height='45'
				className='rounded-full bg-teal-300'
			/>
			<div className='flex bg-teal-100 rounded-xl items-center gap-2 p-2 w-full h-full justify-between'>
				<h1 className='font-bold text-xl'>{user.userNick}</h1>
				<IconWithTooltip
					icon={HiDotsVertical}
					tooltipId='User setting'
					tooltipContent='User Setting'
					styles='w-8 h-8'
				/>
			</div>
		</div>
	);
}
export default UserCard;
