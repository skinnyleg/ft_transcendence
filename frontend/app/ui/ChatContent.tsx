"use client"
import { useEffect, type FC, useRef } from 'react';
import { ChannelInter, ChannelUser, MessageInter } from '../interfaces/interfaces';
import MessageComponentLeft from './MessageComponentLeft';
import MessageComponentRight from './MessageComponentRight';
import { Messages, user } from './ChatConstants';



interface ChatContentProps {
	channel: ChannelInter;
}

const ChatContent: FC<ChatContentProps> = ({channel}) => {
  const scrollableRef = useRef(null);

		const isJoined = channel?.isJoined;
		const channelType = channel?.channelType;
		const addBlur = !isJoined && (channelType === 'PROTECTED' || channelType === 'PRIVATE');


		useEffect(() => {
			if (scrollableRef.current) {
				// Scroll to the bottom when Messages or addBlur change
				scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
			}
		}, [Messages, addBlur]);



		return (
			<div className={`w-full flex-grow p-2 gap-2 flex flex-col mt-3 mb-3 overflow-y-auto ${addBlur ? 'blur' : ''}`}>
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
