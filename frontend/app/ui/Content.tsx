"use client"
import type { FC } from 'react';
import { useSearchParams } from 'next/navigation';
import ChatTabChannel from './ChatTabChannel';
import { isBarOpen, whichTab } from './ChatUtils';

interface ContentProps {}

const Content: FC<ContentProps> = ({}) => {
	const searchParams = useSearchParams();

	const renderTab = whichTab(searchParams);
	const barOpen = isBarOpen(searchParams)
	return (
		<>
			{renderTab === 'none' &&  (
					<div className='w-full h-full hidden lg:block pb-1'>
					</div>
			)}
			{renderTab === 'channel' &&  (
					<div className={`lg:flex lg:flex-grow w-full pb-1 ${barOpen ? 'hidden' : ''}`}>
						<ChatTabChannel
							channelId={searchParams.get('channel')}
						/>
					</div>
			)}
		</>
	);
}

			// {whichTab() === 'personal' &&  (
			// 		<div className='lg:flex lg:flex-grow w-full h-full pb-1'>
			// 			<ChatTabPersonal
			// 				channelId={searchParams.get('personal')}
			// 			/>
			// 		</div>
			//  )}
export default Content;
