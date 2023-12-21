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
		<div className='h-screenflex flex-col overflow-y-hidden'>
			<TopBar />
			<div className='h-[100vh] min-[1024px]:h-[89vh]  xl:h-[91vh] xl:pb-0 w-full md:justify-between flex flex-row  md:gap-2 min-[1024px]:gap-0 pt-[85px] pr-1 pl-1 lg:pb-0 lg:pt-1'>
				<RightBar />
				<Content />
				<LeftBar />
			</div>
		</div>
	)


}

export default chat;
