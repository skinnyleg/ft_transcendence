"use client"
import { useContext, type FC } from 'react';
import UserSideBar from './UserSideBar';
import { useSearchParams } from 'next/navigation';
import ChatSideBar from './ChatSideBar';
import { isBarOpen, whichTab } from './ChatUtils';
import { ChatContext } from '../context/soketContext';

interface LeftBarProps {}

const LeftBar: FC<LeftBarProps> = ({}) => {
	// const searchParams = useSearchParams();
	const {channelId, personalId, barOpen} = useContext(ChatContext);

		return (
		<>
			{(channelId === '' && personalId === '') &&  (
					<div className='hidden lg:flex lg:w-[50%] xl:w-[40%] w-full h-full pb-0'>
					</div>
			)}
			{(channelId !== '' && personalId === '') &&  (
					<div className={`lg:flex md:w-[50%] lg:w-[50%] xl:w-[40%] w-full h-full pb-0 transition ease-in-out duration-700
					${barOpen ? '' : 'hidden'}`}>
					{/* <div className={`lg:flex md:w-[21.69%] w-full h-full pb-0 transition ease-in-out duration-700
					${barOpen ? '' : 'hidden'}`}> */}
						<ChatSideBar />
					</div>
			)}
			{(personalId !== '' && channelId === '') &&  (
				<></>
					// <div className='hidden lg:flex bg-purple-600 lg:w-[50%] xl:w-[40%] w-full h-full pb-0'>
					// </div>
			)}
		</>
	);
}
export default LeftBar;
