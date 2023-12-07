import React, { FC } from 'react'
import ChannelTab from '../ui/ChannelTab'
import { Metadata } from 'next'
import PersonalTab from '../ui/PersonalTab'
import ChatTab from '../ui/ChatTab'
import ChatSideBar from '../ui/ChatSideBar'

export const metadata: Metadata = {
  title: 'Chat',
  description: 'Pong Platform Chat Page',
  viewport: 'width=device-width, initial-scale=1',
}

interface ChatProps {
	searchParams?: { [key: string]: string | undefined };
}

const chat: FC<ChatProps> = ({searchParams}) => {
	console.log("searchParams == ", searchParams)

	const checkQuery = () => {
		if (searchParams?.channel === undefined || searchParams?.channel === '')
		{
			if (searchParams?.personal === undefined || searchParams?.personal === '')
				return false;
		}
		else if (searchParams?.personal === undefined || searchParams?.personal === '')
		{
			if (searchParams?.channel === undefined || searchParams?.channel === '')
				return false;
		}
		return true;
	}

	if (checkQuery() === false)
	{
		return (
		<div className='h-screen flex flex-row pt-[70px] pb-1 pr-2 lg:pb-1 lg:pt-2'>
			<div className='h-full w-full lg:w-[26%] flex gap-1 flex-col'>
					<ChannelTab />
					<PersonalTab />
			</div>
			{/* <div className='hidden lg:hidden lg:flex-grow w-full h-full pb-1'> */}
			{/* 	<ChatTab */}
			{/* 		channelId={searchParams?.channel} */}
			{/* 	/> */}
			{/* </div> */}
			{/* <div className='hidden lg:hidden lg:w-[50%] xl:w-[40%] w-full h-full pb-1'> */}
			{/* 	<ChatSideBar /> */}
			{/* </div> */}
		</div>
		);
	}

	return (
		<div className='h-screen flex flex-row pt-[70px] pb-1 pr-2 lg:pb-1 lg:pt-2'>
			<div className='h-full w-full  lg:w-[50%] flex gap-1 flex-col'>
					<ChannelTab />
					<PersonalTab />
			</div>
			<div className='hidden lg:flex lg:flex-grow w-full h-full pb-1'>
				<ChatTab
					channelId={searchParams?.channel}
				/>
			</div>
			<div className='hidden lg:flex lg:w-[50%] xl:w-[40%] w-full h-full pb-1'>
				<ChatSideBar
					channelId={searchParams?.channel}
				/>
			</div>
		</div>
	)
}

export default chat;
