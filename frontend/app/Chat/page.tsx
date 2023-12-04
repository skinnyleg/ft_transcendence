import React from 'react'
import ChannelTab from '../ui/ChannelTab'
import { Metadata } from 'next'
import PersonalTab from '../ui/PersonalTab'

export const metadata: Metadata = {
  title: 'Chat',
  description: 'Pong Platform Chat Page',
  viewport: 'width=device-width, initial-scale=1',
}

const chat = () => {
	return (
		<div className='h-screen pt-16 pb-1 pr-2 lg:pb-3 lg:pt-2'>
			<div className='h-full space-y-1'>
					<ChannelTab />
					<PersonalTab />
				{/* <h1>hello </h1> */}
			</div>
		</div>
	)
}

export default chat;
