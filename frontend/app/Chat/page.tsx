import React from 'react'
import ChannelTab from '../ui/ChannelTab'
import { Metadata } from 'next'
import PersonalTab from '../ui/PersonalTab'
import ChatTab from '../ui/ChatTab'

export const metadata: Metadata = {
  title: 'Chat',
  description: 'Pong Platform Chat Page',
  viewport: 'width=device-width, initial-scale=1',
}

const chat = () => {
	return (
		<div className='h-screen flex flex-row pt-[70px] pb-1 pr-2 lg:pb-1 lg:pt-2'>
			<div className='h-full w-full lg:flex-shrink lg:w-fit flex gap-1 flex-col'>
					<ChannelTab />
					<PersonalTab />
			</div>
			<div className='hidden lg:flex lg:flex-grow w-full h-full pb-1'>
				<ChatTab />
			</div>
		</div>
	)
}

export default chat;
