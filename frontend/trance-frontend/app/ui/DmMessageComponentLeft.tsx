import type { FC } from 'react';
import { DmMessageInter, MessageInter } from '../interfaces/interfaces';
import Image from 'next/image';

interface DmMessageComponentLeftProps {
	message: DmMessageInter;
}

const DmMessageComponentLeft: FC<DmMessageComponentLeftProps> = ({message}) => {

		return (
			<div className={`w-full lg:w-80 h-fit flex flex-row p-0 items-start gap-0 mb-0`}>
				<div className={`pl-2 whitespace-normal break-words text-wrap bg-slate-200 text-black rounded-2xl flex flex-col w-[75%] lg:w-4/5 h-full p-1 gap-1`}>
						<h1 className='font-bold text-xs'>{message.sender}</h1>
						<p className='text-xs break-all break-words'>{message.message}</p>
						<span className='text-gray-400 self-end text-xs'>{message.time}</span>
				</div>
			</div>
		);
}
export default DmMessageComponentLeft;
