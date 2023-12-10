import type { FC } from 'react';
import { MessageInter } from '../interfaces/interfaces';
import MessageComponent from './MessageComponent';

const Messages: MessageInter[] = [
	{
		id: '1',
		senderPic: '/GroupChat.png',
		senderNick: 'skinnyleg',
		content: 'hello',
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
		senderNick: 'skinnyleg',
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


interface ChatContentProps {}

const ChatContent: FC<ChatContentProps> = ({}) => {
		return (
			<div className='flex-grow p-2 mt-3 overflow-y-auto'>
				{
					Messages.map((message) => (
						<MessageComponent
							key={message.id}
							message={message}
						/>
					))
				}
			</div>
	);
}
export default ChatContent;
