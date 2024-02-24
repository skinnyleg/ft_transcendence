"use client"
import { useState, type FC, useEffect, useContext, KeyboardEventHandler } from 'react';
import { IconWithTooltip } from './CustomIcons';
import { IoMdSend } from "react-icons/io";
import { ChannelInter } from '../interfaces/interfaces';
import ChannelPassword from './SubmitChannelPassword';
import { chatSocketContext } from '../context/soketContext';
import { ChatContext } from '../context/soketContext';

interface PersonalTypeBarProps {}


const PersonalTypeBar: FC<PersonalTypeBarProps> = () => {

	const [barValue, setBarValue] = useState('Join');
	const chatSocket = useContext(chatSocketContext);
	const [isDisabled, setIsDisabled] = useState(false)
	const [message, setMessage] = useState('')
	const {personalId, setPersonalId, setPersonal, personal} = useContext(ChatContext);


		const sendMessage = () => {
			if (message.trim().length)
			{
				chatSocket.emit('sendMsgDM', {
					receiverId: personal.reciverId,
					content: message,
				})
				setMessage('');
			}
		}


		const pressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
			if(e.key == 'Enter'){
				sendMessage();
			  }
		  }


		if (personal && personal.dmStatus !== 'BLOCKED')
		{
			return (
				<div className='text-black h-9 rounded-xl p-0 flex flex-row justify-between items-center gap-2'>
						<div className='bg-teal-100 w-full lg:w-[97%] rounded-xl h-full'>
							<input
								type='text'
								placeholder='Enter Your Message'
								className='border-none w-full h-full text-left bg-teal-100 focus:ring-0 text-black rounded-xl'
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								onKeyDown={pressEnter}
							/>
						</div>
						<div onClick={sendMessage} className='bg-teal-100 w-1/5 lg:w-[15%] rounded-xl h-full flex items-center justify-center hover:cursor-pointer'>
							<IconWithTooltip
								icon={IoMdSend}
								styles='w-8 h-8 focus:ring-0 outline-none'
								tooltipId="SendToolTip"
								tooltipContent='Send Message'
							/>
						</div>
					</div>
			)
		}

		return (
		<div className='text-black h-9 rounded-xl p-0 flex flex-row justify-between items-center gap-2'>
			<div className={`bg-sky-700 w-[100%] rounded-3xl h-full flex items-center justify-center hover:cursor-not-allowed animate-pulse`}>
				<button
					disabled={isDisabled}
					className='w-full h-full text-center text-xl font-bold text-teal-200 hover:cursor-not-allowed focus:outline-none'>
					You Are Blocked
				</button>
			</div>
		</div>

	);
}
export default PersonalTypeBar;
