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
		<div className='flex flex-col font-white bg-main overflow-y-hidden md:overflow-y-auto mr-0'>
			<TopBar />
			<div className='h-[100vh] md:h-[99vh] min-[1024px]:h-[88vh] mt-0 xl:mt-2 lg:mt-2 xl:h-[90vh] xl:pb-0 w-full md:justify-between flex flex-row  md:gap-2 min-[1024px]:gap-0 pt-[70px] pr-1 pl-1 lg:pb-0 lg:pt-1'>
				<RightBar />
				<Content />
				<LeftBar />
			</div>
		</div>
	)


}

export default chat;
