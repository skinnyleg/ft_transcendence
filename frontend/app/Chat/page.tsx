import React, { FC } from 'react'
import { Metadata } from 'next'
import RightBar from '../ui/RightBar'
import LeftBar from '../ui/LeftBar'
import Content from '../ui/Content'

export const metadata: Metadata = {
  title: 'Chat',
  description: 'Pong Platform Chat Page',
  viewport: 'width=device-width, initial-scale=1',
}

interface ChatProps {}

const chat: FC<ChatProps> = () => {
	
	return (
		<div className='h-screen flex flex-row pt-[70px] pb-1 pr-2 lg:pb-1 lg:pt-2'>
			<RightBar />
			<Content />
			<LeftBar />
		</div>
	)


}

export default chat;
