"use client"
import { useEffect, type FC, useRef, useContext, useState, useLayoutEffect } from 'react';
import { ChannelInter, ChannelUser, DmMessageInter, MessageInter, responseData } from '../interfaces/interfaces';
import MessageComponentLeft from './MessageComponentLeft';
import MessageComponentRight from './MessageComponentRight';
import { chatSocket, chatSocketContext } from '../context/soketContext';
import { ChatContext } from '../context/soketContext';
import { checkOpenChannelId, getChannelName } from './ChatUtils';
import { useSearchParams } from 'next/navigation';



interface ChatContentProps {}

const ChatContent: FC<ChatContentProps> = () => {

		const scrollableRef = useRef<any>(null);
		const {channelIdRef,channelId, setChannelId, user, channel} = useContext(ChatContext);
		const [messages, setMessages] = useState<MessageInter[]>([])
		const isJoined = channel?.userRole;
		const channelType = channel?.channelType;
		const addBlur = (isJoined === 'none') && (channelType === 'PROTECTED' || channelType === 'PRIVATE');
		const chatSocket = useContext(chatSocketContext);
		// const searchParams = useSearchParams()

		useEffect(() => {
			// console.log("ref obj == ", scrollableRef.current)
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
			
			// getChannelName(searchParams)
			// chatSocket.emit('getMessagesCH', {
			// 	channelName: channelId,
			// })
			

			// Old Method
			// chatSocket.emit('getMessagesCH', {
			// 	channelName: channelId,
			// })


			chatSocket.emit('getMessagesCH', {
				channelName: channelId,
			})
		}, [channelId])


		useEffect(() => {

			// chatSocket.on('joinDone', () => {
			// 	console.log("getmessafee lplwlww == ");
			// 	chatSocket.emit('getMessagesCH', {
			// 		channelName: channelId,
			// 	})
			// })



			chatSocket.on('messagesCH', (data: MessageInter[]) => {
			// console.log("message Data == ", data);
				setMessages(data);
			})


			//Old Methi=od
			// chatSocket.on('messageDoneCH', (data: MessageInter) => {
			// 	// console.log('got new message == ', data);
			// 	chatSocket.emit('getUserChannels');
			// 	if (checkOpenChannelId(data.channelId, channelId) == true)
			// 	{
			// 		setMessages((prevMessages) => {
			// 			console.log('prevmessages == ', prevMessages);
			// 			const index = prevMessages.length - 1;
			// 			if (index >= 0 && prevMessages[index].sender === data.sender)
			// 			{
			// 				prevMessages[index].picture = '';
			// 			}
			// 			console.log('data == ', data);
			// 			return [...prevMessages, data]
			// 		})
			// 	}
			// })



			// New Method
			chatSocket.on('messageDoneCH', (data: MessageInter) => {
				// console.log('got new message == ', data);
				chatSocket.emit('getUserChannels');
				if (checkOpenChannelId(data.channelId, channelId) == true)
				{
					setMessages((prevMessages) => {
						console.log('prevmessages == ', prevMessages);
						const index = prevMessages.length - 1;
						if (index >= 0 && prevMessages[index].sender === data.sender)
						{
							prevMessages[index].picture = '';
						}
						console.log('data == ', data);
						return [...prevMessages, data]
					})
				}
			})


			//TODO weird behavior
			// chatSocket.on('newName', (data: {newName: string, oldName: string}) => {
			// 	console.log('am\'I here')
			// 	chatSocket.emit('getUserChannels');
			// 	if (checkOpenChannelId(data.oldName, channelId) == true)
			// 	{
			// 		chatSocket.emit('getDataCH', {
			// 			channelName: data.newName
			// 		})
			// 		setChannelId(data.newName);
			// 	}
			// })

				
			return () => {
				chatSocket.off('messageDoneCH')
				chatSocket.off('messagesCH')
				chatSocket.off('newName')
				// chatSocket.off('changeDone')
			}
		},[channelId])



		return (
			<div ref={scrollableRef} className={`w-full flex-grow p-2 gap-1 flex flex-col mt-3 mb-3 overflow-y-auto styled-scrollbar overflow-x-hidden ${addBlur ? 'blur overflow-y-hidden' : ''}`}>
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
