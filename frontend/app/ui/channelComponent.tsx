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
		router.replace(`/Chat?channel=${channel.channelName}`);
	}
	return (
		<div onClick={setChannelQuery} className='gap-2 rounded-[15px] w-full h-12 mb-1 text-black p-0 flex justify-between items-center hover:cursor-pointer'>
				<Image
					src={channel.channelPicture as string}
					alt='channel Image'
					width={45}
					height={45}
					className='rounded-full bg-teal-300 max-w-[40px] max-h-[40px] min-w-[40px] min-h-[40px]'
				/>
				<div className='flex flex-col bg-teal-100 w-full h-full pl-2 rounded-xl'>
					<h1 className='font-bold text-base '>{channel.channelName}</h1>
					<p className='text-gray-500 text-sm'>{channel.lastMsg === '' ? 'No New Messages' : channel.lastMsg}</p>
				</div>
		</div>
	);
}
export default ChannelComponent;
