import type { FC } from 'react';
import { ChannelInter } from '../interfaces/interfaces';
import Image from 'next/image';

interface channelComponentProps {
	channel : ChannelInter
}

const ChannelComponent: FC<channelComponentProps> = ({channel}) => {
	return (
		<div className='bg-teal-100 rounded-xl w-full h-14 mb-1 text-black p-2 flex justify-between items-center'>
			<div className='flex space-x-3'>
				<Image
					src={channel.channelPic}
					alt='channel Image'
					width='45'
					height='45'
					className='rounded-full bg-gray-500'
				/>
			<div className='flex flex-col'>
				<h1 className='font-bold text-xl'>{channel.channelName}</h1>
				<p className='text-gray-500'>last message</p>
			</div>
		</div>
		{!channel.isJoined ? <p>join</p>: null}
		</div>
	);
}
export default ChannelComponent;
