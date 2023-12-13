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

		{/* <div className='h-screen bg-green-600 flex flex-row pb-1 pr-2 lg:pb-1 xl:pb-1 lg:pt-0'> */}
			{/* <TopBar /> */}
			{/* <div className='w-full h-full xl:h-96 bg-yellow-600 flex flex-row pt-[70px] pb-1 pr-2 lg:pb-1 lg:pt-0'> */}
			{/* 	<RightBar /> */}
			{/* 	<Content /> */}
			{/* 	<LeftBar /> */}
			{/* </div> */}
		// </div>
interface ChatProps {}

const chat: FC<ChatProps> = () => {
	
	return (
		<div className='h-screen flex flex-col pt-[70px] pb-1 pr-2 lg:pb-1 lg:pt-2'>
			<TopBar />
			<div className='h-[92%] w-full flex flex-row pb-1'>
				<RightBar />
				<Content />
				<LeftBar />
			</div>
		</div>
	)


}

export default chat;
