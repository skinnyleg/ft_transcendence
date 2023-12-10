import type { FC } from 'react';
import ChatTopBar from './ChatTopBar';
import ChatContent from './ChatContent';
import ChatTypeBar from './ChatTypeBar';
import { ChannelInter } from '../interfaces/interfaces';


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

interface ChatTabProps {
	channelId: string | null;
}
const ChatTabChannel: FC<ChatTabProps> = ({channelId}) => {
	const channel = channels.find((c) => c.id === channelId);

	if (channel === undefined)
	{
		return (
			<h1>Start Chatting Now</h1>
		);
	}
		return (
			<div className='w-full h-full bg-teal-600 lg:ml-2 rounded-xl flex flex-col justify-between p-3'>
				<ChatTopBar
					channel={channel as ChannelInter}
				/>
				<ChatContent
					// channel={channel as ChannelInter}
				/>
				<ChatTypeBar
					channel={channel as ChannelInter}
				/>
			</div>
		);
}
export default ChatTabChannel;
