"use client"
import type { FC } from 'react';
import { ChannelInter } from '../interfaces/interfaces';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface channelComponentProps {
	channel : ChannelInter
}

const ChannelComponent: FC<channelComponentProps> = ({channel}) => {
	const router = useRouter();

	const setChannelQuery = () => {
		router.replace(`/Chat?channel=${channel.id}`);
	}

	return (
		<div onClick={setChannelQuery} className='gap-2 rounded-[15px] w-full h-fit mb-1 text-black p-0 flex justify-between items-center hover:cursor-pointer'>
				<Image
					src={channel.channelPic}
					alt='channel Image'
					width={45}
					height={45}
					className='rounded-full bg-teal-300'
				/>
				<div className='flex flex-col bg-teal-100 w-full pl-2 rounded-xl'>
					<h1 className='font-bold text-base '>{channel.channelName}</h1>
					<p className='text-gray-500'>last message</p>
				</div>
		</div>
	);
}
export default ChannelComponent;
