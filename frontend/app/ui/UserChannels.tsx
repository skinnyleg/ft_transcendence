
import type { FC } from 'react';
import { ChannelInter } from '../interfaces/interfaces';
import ChannelComponent from './channelComponent';

const Channels: ChannelInter[] = [
  {
    id: '1',
    channelName: 'General',
    channelPic: '/GroupChat.png',
    isJoined: true,
  },
  {
    id: '2',
    channelName: 'Random',
    channelPic: '/GroupChat.png',
    isJoined: false,
  },
  {
    id: '3',
    channelName: 'Random',
    channelPic: '/GroupChat.png',
    isJoined: false,
  },
  {
    id: '4',
    channelName: 'Random',
    channelPic: '/GroupChat.png',
    isJoined: false,
  },
  {
    id: '5',
    channelName: 'Random',
    channelPic: '/GroupChat.png',
    isJoined: false,
  },
  {
    id: '6',
    channelName: 'Random',
    channelPic: '/GroupChat.png',
    isJoined: false,
  },
  // Add more objects as needed...
];

interface UserChannelsProps {}

const UserChannels: FC<UserChannelsProps> = ({}) => {
		return (
			<div className='overflow-y-auto'>
				{
					Channels.map((channel) => (
						<ChannelComponent
							key={channel.id} // Add a unique key for each child component
							channel={channel}
						/>
					))
				}
			</div>
	);
}
export default UserChannels;
