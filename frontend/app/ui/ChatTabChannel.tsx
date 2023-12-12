import type { FC } from 'react';
import ChatTopBar from './ChatTopBar';
import ChatContent from './ChatContent';
import ChatTypeBar from './ChatTypeBar';
import { ChannelInter } from '../interfaces/interfaces';
import { channels } from './ChatConstants';



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
					channel={channel as ChannelInter}
				/>
				<ChatTypeBar
					channel={channel as ChannelInter}
				/>
			</div>
		);
}
export default ChatTabChannel;
