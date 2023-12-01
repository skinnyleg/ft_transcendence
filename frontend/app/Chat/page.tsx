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
		<div className="h-screen p-2">
		<ChannelTab />
		<PersonalTab />
		</div>
	)
}

export default chat;
