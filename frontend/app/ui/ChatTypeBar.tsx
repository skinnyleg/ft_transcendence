"use client"
import type { FC } from 'react';
import { IconWithTooltip } from './CustomIcons';
import { IoMdSend } from "react-icons/io";

interface ChatTypeBarProps {}

const ChatTypeBar: FC<ChatTypeBarProps> = ({}) => {
		return (
			<div className=' text-black h-16 rounded-xl p-2 flex flex-row justify-between items-center gap-2'>
				<div className='bg-teal-100 w-[97%] rounded-xl h-full'>
					<input
						type='text'
						placeholder='Enter Your Message'
						className='border-none w-full h-full text-center bg-teal-100 focus:ring-0 text-black rounded-xl'
					/>
				</div>
				<div className='bg-teal-100 w-[10%] rounded-xl h-full flex items-center justify-center hover:cursor-pointer'>
					<IconWithTooltip
						icon={IoMdSend}
						styles='w-8 h-8'
						tooltipId="SendToolTip"
						tooltipContent='Send Message'
					/>
				</div>
			</div>

	);
}
export default ChatTypeBar;
