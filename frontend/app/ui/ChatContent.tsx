import type { FC } from 'react';
import { ChannelUser, MessageInter } from '../interfaces/interfaces';
import MessageComponentLeft from './MessageComponentLeft';
import MessageComponentRight from './MessageComponentRight';

const Messages: MessageInter[] = [
	{
		id: '1',
		senderPic: '/GroupChat.png',
		senderNick: 'Jav',
		content: 'I\'m down! Any ideas??',
		timeStamp: '11:35 AM'
	},
	{
		id: '2',
		senderPic: '/GroupChat.png',
		senderNick: 'skinnyleg',
		content: 'hello',
		timeStamp: '11:35 AM'
	},
	{
		id: '3',
		senderPic: '/GroupChat.png',
		senderNick: 'skinnyleg',
		content: 'hello',
		timeStamp: '11:35 AM'
	},
	{
		id: '4',
		senderPic: '/GroupChat.png',
		senderNick: 'med-doba',
		content: 'hello',
		timeStamp: '11:35 AM'
	},
	{
		id: '5',
		senderPic: '/GroupChat.png',
		senderNick: 'med-doba',
		content: 'hello',
		timeStamp: '11:35 AM'
	},
	{
		id: '5',
		senderPic: '/GroupChat.png',
		senderNick: 'daifi',
		content: 'hello',
		timeStamp: '11:35 AM'
	},
	{
		id: '5',
		senderPic: '/GroupChat.png',
		senderNick: 'daifi',
		content: 'hello',
		timeStamp: '11:35 AM'
	},
	{
		id: '5',
		senderPic: '/GroupChat.png',
		senderNick: 'skinnyleg',
		content: 'hello',
		timeStamp: '11:35 AM'
	},
]

const user: ChannelUser = {
	id: '1',
	userPic: '',
	userNick: 'skinnyleg',
	userRole: '',
}

interface ChatContentProps {}

const ChatContent: FC<ChatContentProps> = ({}) => {
		return (
			<div className='w-full flex-grow p-2 gap-2 flex flex-col mt-3 mb-3 overflow-y-auto'>
				{
					Messages.map((message) => {
						if (message.senderNick === user.userNick)
							return (
								<MessageComponentRight
									key={message.id}
									message={message}
								/>
							);
						else
							return (
								<MessageComponentLeft
									key={message.id}
									message={message}
								/>
							);
				})
				}
			</div>
	);
}
export default ChatContent;
