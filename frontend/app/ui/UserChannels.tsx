
import type { FC } from 'react';
import { ChannelInter } from '../interfaces/interfaces';
import ChannelComponent from './channelComponent';

// const channels: ChannelInter[] = []
const channels: ChannelInter[] = [
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
    channelName: 'Ran',
    channelPic: '/GroupChat.png',
    isJoined: false,
  },
  {
    id: '4',
    channelName: 'Raom',
    channelPic: '/GroupChat.png',
    isJoined: false,
  },
  {
    id: '5',
    channelName: 'dom',
    channelPic: '/GroupChat.png',
    isJoined: false,
  },
  {
    id: '6',
    channelName: 'opi',
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
