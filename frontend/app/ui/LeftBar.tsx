"use client"
import type { FC } from 'react';
import UserSideBar from './UserSideBar';
import { useSearchParams } from 'next/navigation';
import ChatSideBar from './ChatSideBar';
import { isBarOpen, whichTab } from './ChatUtils';

interface LeftBarProps {}

const LeftBar: FC<LeftBarProps> = ({}) => {
	const searchParams = useSearchParams();

	
	const renderTab = whichTab(searchParams);
	const barOpen = isBarOpen(searchParams)
		return (
		<>
			{renderTab === 'none' &&  (
					<div className='hidden lg:flex lg:w-[50%] xl:w-[40%] w-full h-full pb-0'>
					</div>
			)}
			{renderTab === 'channel' &&  (
					<div className={`lg:flex md:w-[50%] lg:w-[50%] xl:w-[40%] w-full h-full pb-0 transition ease-in-out duration-700
					${barOpen ? '' : 'hidden'}`}>
						<ChatSideBar
							channelId={searchParams.get('channel')}
						/>
					</div>
			)}
			{/* {renderTab === 'personal' && isBarOpen() === true &&  ( */}
			{/* 		<div className='hidden lg:flex lg:w-[50%] xl:w-[40%] w-full h-full pb-1'> */}
			{/* 			<UserSideBar /> */}
			{/* 		</div> */}
			{/* )} */}
		</>
	);
}
export default LeftBar;
