"use client"
import type { FC } from 'react';
import UserSideBar from './UserSideBar';
import { useSearchParams } from 'next/navigation';
import ChatSideBar from './ChatSideBar';

interface LeftBarProps {}

const LeftBar: FC<LeftBarProps> = ({}) => {
	const searchParams = useSearchParams();

	const isHidden = () => {
		if (searchParams.has('channel') && searchParams.has('personal'))
			return false;
		if (searchParams.has('channel') && searchParams.get('channel') !== '')
			return true
		if (searchParams.has('personal') && searchParams.get('personal') !== '')
			return true
		return (false);
	}

	const whichTab = () =>  {
		if (isHidden() === false)
			return 'none';
		if (searchParams.has('channel'))
			return 'channel';
		if (searchParams.has('personal'))
			return 'personal';
		return 'none';
	}

	const isBarOpen = () => {
		if (searchParams.has('bar') && searchParams.get('bar') === 'open')
			return true;
		return false;
	}
		return (
		<>
			{whichTab() === 'none' &&  (
					<div className='hidden lg:flex lg:w-[50%] xl:w-[40%] w-full h-full pb-1'>
					</div>
			)}
			{whichTab() === 'channel' &&  (
					<div className={`lg:flex lg:w-[50%] xl:w-[40%] w-full h-full pb-1
					${isBarOpen() ? '' : 'hidden'}`}>
						<ChatSideBar
							channelId={searchParams.get('channel')}
						/>
					</div>
			)}
			{/* {whichTab() === 'personal' && isBarOpen() === true &&  ( */}
			{/* 		<div className='hidden lg:flex lg:w-[50%] xl:w-[40%] w-full h-full pb-1'> */}
			{/* 			<UserSideBar /> */}
			{/* 		</div> */}
			{/* )} */}
		</>
	);
}
export default LeftBar;
