
import type { FC } from 'react';
import ChannelComponent from './channelComponent';
import { channels } from './ChatConstants';

interface UserChannelsProps {}

const UserChannels: FC<UserChannelsProps> = ({}) => {
		return (
			<>
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
			</>
	);
}
export default UserChannels;
