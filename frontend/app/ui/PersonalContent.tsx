"use client"
import { useEffect, type FC, useRef, useContext, useState, useLayoutEffect } from 'react';
import { ChannelInter, ChannelUser, DmMessageInter, MessageInter, responseData } from '../interfaces/interfaces';
import MessageComponentLeft from './MessageComponentLeft';
import MessageComponentRight from './MessageComponentRight';
import { user } from './ChatConstants';
import { chatSocket, chatSocketContext } from '../context/soketContext';
import { ChatContext } from '../context/soketContext';
import { checkOpenChannelId, checkOpenPersonalId } from './ChatUtils';
import { useSearchParams } from 'next/navigation';
import DmMessageComponentRight from './DmMessageComponentRight';
import DmMessageComponentLeft from './DmMessageComponentLeft';



interface PersonalContentProps {}

const PersonalContent: FC<PersonalContentProps> = () => {

		const scrollableRef = useRef(null);
		const {personalId, setPersonalId, user, personal} = useContext(ChatContext);
		const [messages, setMessages] = useState<DmMessageInter[]>([])
		// const isJoined = channel?.userRole;
		// const channelType = channel?.channelType;
		// const addBlur = (isJoined === 'none') && (channelType === 'PROTECTED' || channelType === 'PRIVATE');
		const chatSocket = useContext(chatSocketContext);
		const searchParams = useSearchParams()

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
			console.log('emitting getting msg dm == ', personalId)
			chatSocket.emit('getMessagesDM', {
				dmId: personalId,
			})
		}, [personalId])


		useEffect(() => {
			chatSocket.on('messagesDM', (data: DmMessageInter[]) => {
				// console.log("messages Data personal == ", data);
					setMessages(data);
				})
				chatSocket.on('messageDoneDM', (data: DmMessageInter) => {
					chatSocket.emit('getUserDms');
					if (checkOpenPersonalId(data.dmId, personalId) == true)
					{
						setMessages((prevMessages) => {
							return [...prevMessages, data]
						})
					}
				})

				

				
			return () => {
				chatSocket.off('messageDoneDM')
				chatSocket.off('messagesDM')
				// chatSocket.off('newName')
				// chatSocket.off('changeDone')
			}
		},[chatSocket, personalId])



		return (
			<div ref={scrollableRef} className={`w-full flex-grow p-2 gap-1 flex flex-col mt-3 mb-3 overflow-y-auto overflow-x-hidden`}>
				{
					messages.length > 0 && messages.map((message) => {
						if (message.sender === user?.nickname)
							return (
								<DmMessageComponentRight
									key={message.messageId}
									message={message}
								/>
							);
						else
							return (
								<DmMessageComponentLeft
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
export default PersonalContent;
