import type { FC } from 'react';
import ChatTopBar from './ChatTopBar';
import ChatContent from './ChatContent';
import ChatTypeBar from './ChatTypeBar';
import { ChannelInter } from '../interfaces/interfaces';

interface ChatTabProps {}

const channel: ChannelInter = {
    id: '1',
    channelName: 'General',
    channelPic: '/GroupChat.png',
    isJoined: true,
  }

const ChatTab: FC<ChatTabProps> = ({}) => {
		return (
			<div className='w-full bg-teal-600 lg:ml-2 rounded-xl flex flex-col justify-between p-2'>
				<ChatTopBar
					channel={channel}
				/>
				<ChatContent />
				<ChatTypeBar />
			</div>
		);
}
export default ChatTab;
