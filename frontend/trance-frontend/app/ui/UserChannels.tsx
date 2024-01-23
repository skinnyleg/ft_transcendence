
import type { FC } from 'react';
import ChannelComponent from './channelComponent';
import { ChannelInter } from '../interfaces/interfaces';

interface UserChannelsProps {
	channels: ChannelInter[] | undefined;
	info: string;
}

const UserChannels: FC<UserChannelsProps> = ({channels, info}) => {
		return (
			<>
				{
				  (channels && channels.length > 0) && (
					channels.map((channel) => (
					  <ChannelComponent
						key={channel.channelId} // Add a unique key for each child component
						channel={channel}
					  />
					))
				  )
				}
				{
					(channels && channels.length === 0) && (
						<div className='flex w-full h-full flex-crol justify-center items-center'>
							<p className='text-center text-lg font-bold text-teal-200'>{info}</p>
						</div>
					)
				}
			</>
	);
}
export default UserChannels;
