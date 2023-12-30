import type { FC } from 'react';
import { MessageInter } from '../interfaces/interfaces';
import Image from 'next/image';

interface MessageComponentRightProps {
	message: MessageInter ;
}

const MessageComponentRight: FC<MessageComponentRightProps> = ({message}) => {

	const picExists = () => {
		// console.log('message == ', message);
		if (message && message.picture !== undefined && message.picture !== null)
			return true;
		return false;
	}
		return (
			<div className={`w-full lg:w-80 h-fit flex flex-row-reverse p-0 items-start gap-0 mb-0 self-end
					${picExists() ? 'mb-2' : ''}`}>
			{
				picExists()  ?  (
					<div className='max-w-[50px] max-h-[50px] min-w-[50px] min-h-[50px] p-2 flex self-end'>
						<img
							src={message.picture as string}
							// width={50}
							// height={50}
							alt='user pic'
							className='w-full h-full rounded-full bg-teal-400 max-w-[50px] max-h-[50px] min-w-[50px] min-h-[50px]'
						/>
					</div>
				) : (
					<div className='max-w-[50px] max-h-[50px] min-w-[50px] min-h-[50px] p-2 flex self-end'>
					</div>
				)
			}
				<div className={`pl-2 whitespace-normal break-words text-wrap bg-slate-200 text-black 
					${picExists() ? 'rounded-br-none' : ''} rounded-2xl flex flex-col w-[75%] lg:w-4/5 h-full p-1 gap-1`}>
						<h1 className='font-bold text-xs'>{message.sender}</h1>
						<p className='text-xs break-all break-words '>{message.message}</p>
						<span className='text-gray-400 self-end text-xs'>{message.time}</span>
				</div>
			</div>
		);
}
export default MessageComponentRight;
