"use client"
import { useState, type FC, useContext } from 'react';
import { useSearchParams } from 'next/navigation';
import ChatTabChannel from './ChatTabChannel';
import { isBarOpen, whichTab } from './ChatUtils';
import ChatTabPersonal from './ChatTabPersonal';
import { ChatContext } from '../context/soketContext';

interface ContentProps {}


const Content: FC<ContentProps> = ({}) => {
	const searchParams = useSearchParams();
	const {channelId, personalId, barOpen, hideTabs} = useContext(ChatContext);

	return (
		<>
			{(channelId === '' && personalId === '') &&  (
					<div className='w-full h-full hidden lg:block pb-0'>
					</div>
			)}
			{(channelId !== '' && personalId === '') &&  (
				<div className={`lg:flex lg:flex-grow w-full pb-0 ${barOpen ? 'hidden md:flex' : ''} ${hideTabs ? '' : 'hidden md:flex'} transition ease-in-out duration-700`}>
						 {/* <div className={`lg:flex lg:w-[46.78%] w-full pb-0 ${barOpen ? 'hidden md:flex' : ''} transition ease-in-out duration-700`}> */}
						<ChatTabChannel />
					</div>
			)}
			{(personalId !== '' && channelId === '') &&  (
					<div className={`lg:flex flex-grow w-full pb-0 ${hideTabs ? '' : 'hidden md:flex'} transition ease-in-out duration-700`}>
						<ChatTabPersonal />
					</div>
			 )}
		</>
	);
}

export default Content;
