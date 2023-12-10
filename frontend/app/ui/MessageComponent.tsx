import type { FC } from 'react';
import { MessageInter } from '../interfaces/interfaces';
import Image from 'next/image';

interface MessageComponentProps {
	message: MessageInter;
}

const MessageComponent: FC<MessageComponentProps> = ({message}) => {
		return (
			<div className='w-80 h-[75px] flex flex-row p-1 items-start gap-0 mb-2'>
				<div className='w-fit h-fit p-2 flex items-center justify-center'>
					<Image
						src={message.senderPic}
						width={40}
						height={40}
						alt='user pic'
						className='rounded-full bg-teal-400'
					/>
				</div>
				<div className='bg-slate-200 text-black rounded-tl-none rounded-xl flex flex-col w-full h-full p-1'>
					<h1 className='font-bold text-base'>{message.senderNick}</h1>
					<p className='text-sm'>{message.content}</p>
					<span className='text-gray-400 self-end text-xs'>{message.timeStamp}</span>
				</div>
			</div>
		);
}
export default MessageComponent;
