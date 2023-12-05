import type { FC } from 'react';

interface ChatSideBarProps {}

const ChatSideBar: FC<ChatSideBarProps> = ({}) => {
		return (
		<div className='w-full bg-teal-600 lg:ml-2 rounded-xl flex flex-col justify-between p-2'>
			<div className='flex flex-row items-end bg-red-400 gap-2'>
				<h1 className='text-teal-800 font-bold bg-yellow-600 text-lg'>Owners</h1>
				<div className="w-[90%] h-1 bg-teal-800 rounded-full"></div>
			</div>
		</div>
	);
}
export default ChatSideBar;
