
import type { FC } from 'react';
import { ChannelInter } from '../interfaces/interfaces';
import ChannelComponent from './channelComponent';
import { channels } from './ChatConstants';

interface UserChannelsProps {}

const UserChannels: FC<UserChannelsProps> = ({}) => {
		return (
			<div className='flex gap-0 flex-col overflow-y-auto'>
				{
				  channels.length > 0 && (
					channels.map((channel) => (
					  <ChannelComponent
						key={channel.id} // Add a unique key for each child component
						channel={channel}
					  />
					))
				  )
				}
			</div>
	);
}
export default UserChannels;
