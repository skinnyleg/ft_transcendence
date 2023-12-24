"use client"
import { useState, type FC, useEffect } from 'react';
import { IconWithTooltip } from './CustomIcons';
import { IoMdSend } from "react-icons/io";
import { ChannelInter } from '../interfaces/interfaces';
import ChannelPassword from './SubmitChannelPassword';

interface ChatTypeBarProps {
	channel: ChannelInter;
}


const ChatTypeBar: FC<ChatTypeBarProps> = ({channel}) => {

	const [barValue, setBarValue] = useState('Join');


		const handleChannelJoin = () => {
			if (channel.channelType === 'PUBLIC')
			{
				setBarValue('Joining');
				// setBarValue('Join');
			}
			else
				setBarValue('Your Request Has Been Sent')
		}

		if (channel && channel.userRole !== 'none')
		{
			return (
				<div className='text-black h-9 rounded-xl p-0 flex flex-row justify-between items-center gap-2'>
						<div className='bg-teal-100 w-full lg:w-[97%] rounded-xl h-full'>
							<input
								type='text'
								placeholder='Enter Your Message'
								className='border-none w-full h-full text-center bg-teal-100 focus:ring-0 text-black rounded-xl'
							/>
						</div>
						<div className='bg-teal-100 w-1/5 lg:w-[15%] rounded-xl h-full flex items-center justify-center hover:cursor-pointer'>
							<IconWithTooltip
								icon={IoMdSend}
								styles='w-8 h-8'
								tooltipId="SendToolTip"
								tooltipContent='Send Message'
							/>
						</div>
					</div>
			)
		}

		if (channel && channel.channelType === 'PROTECTED' && channel.userRole === 'none')
		{
			return (
					<div className='text-black h-9 rounded-xl p-0 flex flex-row justify-between items-center gap-2'>
						<ChannelPassword />
					</div>
			)
		}

		return (
		<div className='text-black h-9 rounded-xl p-0 flex flex-row justify-between items-center gap-2'>
			<div className={`bg-sky-700 w-[100%] rounded-3xl h-full flex items-center justify-center hover:cursor-pointer animate-pulse`}>
				<button
					onClick={handleChannelJoin}
					className='w-full h-full text-center text-xl font-bold text-teal-200 focus:outline-none'>
					{barValue}
				</button>
			</div>
		</div>

	);
}
export default ChatTypeBar;
