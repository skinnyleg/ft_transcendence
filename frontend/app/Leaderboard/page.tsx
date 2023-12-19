import React, { FC } from 'react'
import { Metadata } from 'next'
import RightBar from '../ui/RightBar'
import LeftBar from '../ui/LeftBar'
import Content from '../ui/Content'
import TopBar from '../ui/top'
import Leaderboard from '../ui/Leaderboard'

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
			<div className='h-[100%] lg:h-[88%] xl:h-[89%] min-[1024px]:h-[90%] w-full flex flex-row  pt-[70px] pb-1 pr-2 pl-4 lg:pb-1 lg:pt-2'>
				<Leaderboard />
			</div>
		</div>
	)


}

export default chat;
