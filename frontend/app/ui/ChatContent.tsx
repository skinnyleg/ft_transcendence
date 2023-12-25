"use client"
import { useEffect, type FC, useRef, useContext, useState, useLayoutEffect } from 'react';
import { ChannelInter, ChannelUser, MessageInter, responseData } from '../interfaces/interfaces';
import MessageComponentLeft from './MessageComponentLeft';
import MessageComponentRight from './MessageComponentRight';
import { user } from './ChatConstants';
import { chatSocket, chatSocketContext } from '../context/soketContext';
import { ChatContext } from '../context/soketContext';



interface ChatContentProps {}

const ChatContent: FC<ChatContentProps> = () => {

		const scrollableRef = useRef(null);
		const {channelId, setChannelId, user, channel} = useContext(ChatContext);
		const [messages, setMessages] = useState<MessageInter[]>([])
		const isJoined = channel?.userRole;
		const channelType = channel?.channelType;
		const addBlur = (isJoined === 'none') && (channelType === 'PROTECTED' || channelType === 'PRIVATE');
		const chatSocket = useContext(chatSocketContext);

		useEffect(() => {
			console.log("ref obj == ", scrollableRef.current)
			if (scrollableRef.current) {
				// Scroll to the bottom when Messages or addBlur change
				scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
				// scrollableRef.current?.scrollIntoView({ behavior: "smooth" })
			}
			// return () => {
			// 	// console.log("cleanup")
			// 	scrollableRef.current = null;
			// }
		}, [messages]);


		useEffect(() => {
			let isMounted = true;
			chatSocket.on('messagesCH', (data: MessageInter[]) => {
				// console.log("message Data == ", data);
					setMessages(data);
			})
			chatSocket.emit('getMessagesCH', {
				channelName: channelId,
			})
			return () => {
				chatSocket.off('messagesCH')
				isMounted = false;
			}
		}, [channelId])


		useEffect(() => {
			let isMounted = true;
				chatSocket.on('messageDoneCH', (data: MessageInter) => {
					// console.log('got new message == ', data);
					chatSocket.emit('getUserChannels');
					setMessages((prevMessages) => {
						return [...prevMessages, data]
					})

				})
			return () => {
				chatSocket.off('messageDoneCH')
			}
		},[chatSocket])



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
