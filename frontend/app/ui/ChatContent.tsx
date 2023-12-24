"use client"
import { useEffect, type FC, useRef, useContext, useState } from 'react';
import { ChannelInter, ChannelUser, MessageInter, responseData } from '../interfaces/interfaces';
import MessageComponentLeft from './MessageComponentLeft';
import MessageComponentRight from './MessageComponentRight';
import { user } from './ChatConstants';
import { chatSocket, chatSocketContext } from '../context/soketContext';
import { ChatContext } from '../context/soketContext';



interface ChatContentProps {
	channel: ChannelInter;
}

const ChatContent: FC<ChatContentProps> = ({channel}) => {

		const scrollableRef = useRef(null);
		const [messages, setMessages] = useState<MessageInter[]>([])
		const isJoined = channel?.userRole;
		const channelType = channel?.channelType;
		const addBlur = (isJoined === 'none') && (channelType === 'PROTECTED' || channelType === 'PRIVATE');
		const chatSocket = useContext(chatSocketContext);
		const {channelId, setChannelId, user} = useContext(ChatContext);

		useEffect(() => {
			// console.log("ref obj == ", scrollableRef.current)
			if (scrollableRef.current) {
				// Scroll to the bottom when Messages or addBlur change
				scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
			}
			return () => {
				// console.log("cleanup")
				scrollableRef.current = null;
			}
		}, [messages]);

		// useEffect(() => {
		// 		socket.on('messagesCH', (data: MessageInter[]) => {
		// 				setMessages(data);
		// 		})
		// 		socket.emit('getMessagesCH', {
		// 			channelName: channel?.channelName,
		// 		})
		// }, [chatSocket])

		useEffect(() => {
			chatSocket.on('messagesCH', (data: MessageInter[]) => {
				// console.log("message Data == ", data);
				setMessages(data);
			})
			chatSocket.emit('getMessagesCH', {
				channelName: channelId,
			})
		}, [channelId])



		return (
			<div ref={scrollableRef} className={`w-full flex-grow p-2 gap-1 flex flex-col mt-3 mb-3 overflow-y-auto ${addBlur ? 'blur overflow-y-hidden' : ''}`}>
				{
					messages.length > 0 && messages.map((message) => {
						if (message.sender === user?.nickname)
							return (
								<MessageComponentRight
									key={message.messageId}
									message={message}
								/>
							);
						else
							return (
								<MessageComponentLeft
									key={message.messageId}
									message={message}
								/>
							);
					})
				}
				{
					messages.length == 0 && (
						<div className='flex justify-center items-center h-full'>
							<p className='text-lg font-extrabold text-teal-200'>No Messages In Channel</p>
						</div>
					)
				}
			</div>
	);
}
export default ChatContent;
