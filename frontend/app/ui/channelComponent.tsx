import type { FC } from 'react';
import { ChannelInter } from '../interfaces/interfaces';
import Image from 'next/image';

interface channelComponentProps {
	channel : ChannelInter
}

const ChannelComponent: FC<channelComponentProps> = ({channel}) => {
	return (
		<div className='rounded-xl w-full h-14 mb-0 text-black p-2 flex justify-between items-center'>
			<div className='flex gap-2 w-full'>
				<Image
					src={channel.channelPic}
					alt='channel Image'
					width='45'
					height='45'
					className='rounded-full bg-teal-300'
				/>
				<div className='flex flex-col bg-teal-100 w-full pl-2 rounded-xl'>
					<h1 className='font-bold text-xl'>{channel.channelName}</h1>
					<p className='text-gray-500'>last message</p>
				</div>
			</div>
		</div>
	);
}
export default ChannelComponent;
