"use client"
import type { FC } from 'react';
import { useSearchParams } from 'next/navigation';
import ChatTabChannel from './ChatTabChannel';

interface ContentProps {}

const Content: FC<ContentProps> = ({}) => {
	const searchParams = useSearchParams();

	const isHidden = () => {
		if (searchParams.has('channel') && searchParams.has('personal'))
			return false;
		if (searchParams.has('channel') && searchParams.get('channel') !== '')
			return true
		if (searchParams.has('personal') && searchParams.get('personal') !== '')
			return true
		return (false);
	}

	const whichTab = () =>  {
		if (isHidden() === false)
			return 'none';
		if (searchParams.has('channel'))
			return 'channel';
		if (searchParams.has('personal'))
			return 'personal';
		return 'none';
	}

	const isBarOpen = () => {
		if (searchParams.has('bar') && searchParams.get('bar') === 'open')
			return true;
		return false;
	}

	return (
		<>
			{whichTab() === 'none' &&  (
					<div className='w-full h-full hidden lg:block pb-1'>
					</div>
			)}
			{whichTab() === 'channel' &&  (
					<div className={`lg:flex lg:flex-grow w-full pb-1 ${isBarOpen() ? 'hidden' : ''}`}>
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
