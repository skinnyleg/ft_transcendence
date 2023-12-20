import React, { FC } from 'react'
import { Metadata } from 'next'
import RightBar from '../ui/RightBar'
import LeftBar from '../ui/LeftBar'
import Content from '../ui/Content'
import TopBar from '../ui/top'

export const metadata: Metadata = {
  title: 'Chat',
  description: 'Pong Platform Chat Page',
  viewport: 'width=device-width, initial-scale=1',
}

interface ChatProps {}

const chat: FC<ChatProps> = () => {
	
	return (
		<div className='h-screen flex flex-col'>
			<TopBar />
			<div className='h-[100%] lg:h-[87%] xl:h-[90%] xl:pb-3 w-full flex flex-row  pt-[70px] pb-1 pr-2 pl-4 lg:pb-2 lg:pt-2'>
				<RightBar />
				<Content />
				<LeftBar />
			</div>
		</div>
	)


}

export default chat;
