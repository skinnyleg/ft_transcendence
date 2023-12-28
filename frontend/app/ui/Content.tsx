"use client"
import { useState, type FC } from 'react';
import { useSearchParams } from 'next/navigation';
import ChatTabChannel from './ChatTabChannel';
import { isBarOpen, whichTab } from './ChatUtils';
import ChatTabPersonal from './ChatTabPersonal';

interface ContentProps {}


const Content: FC<ContentProps> = ({}) => {
	const searchParams = useSearchParams();

	const renderTab = whichTab(searchParams);
	const barOpen = isBarOpen(searchParams)
	return (
		<>
			{renderTab === 'none' &&  (
					<div className='w-full h-full hidden lg:block pb-0'>
					</div>
			)}
			{renderTab === 'channel' &&  (
					<div className={`lg:flex lg:flex-grow w-full pb-0 ${barOpen ? 'hidden md:flex' : ''} transition ease-in-out duration-700`}>
						<ChatTabChannel />
					</div>
			)}
			{renderTab === 'personal' &&  (
					<div className={`lg:flex lg:flex-grow w-full pb-0 transition ease-in-out duration-700`}>
						<ChatTabPersonal />
					</div>
			 )}
		</>
	);
}

export default Content;
