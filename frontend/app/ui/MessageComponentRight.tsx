import type { FC } from 'react';
import { MessageInter } from '../interfaces/interfaces';
import Image from 'next/image';

interface MessageComponentRightProps {
	message: MessageInter;
}

const MessageComponentRight: FC<MessageComponentRightProps> = ({message}) => {
		return (
			<div className='w-full lg:w-80 h-fit flex flex-row-reverse p-0 items-start gap-0 mb-0 self-end'>
				<div className='w-1/5 p-2 flex items-center justify-center'>
					<Image
						src={message.senderPic}
						width={40}
						height={40}
						alt='user pic'
						className='rounded-full bg-teal-400'
					/>
				</div>
				<div className='whitespace-normal break-words bg-slate-200 text-black rounded-tr-none rounded-xl flex flex-col w-4/5 h-full p-1 gap-1'>
					<h1 className='font-bold text-xs'>{message.senderNick}</h1>
					<p className='text-xs'>{message.content}asddsadasasjdhsajhd  asjdhsaj asdadamndw qwmenw q </p>
					<span className='text-gray-400 self-end text-xs'>{message.timeStamp}</span>
				</div>
			</div>
		);
}
export default MessageComponentRight;
