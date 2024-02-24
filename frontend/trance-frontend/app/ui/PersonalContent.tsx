"use client"
import { useEffect, type FC, useRef, useContext, useState, useLayoutEffect } from 'react';
import { ChannelInter, ChannelUser, DmMessageInter, MessageInter, responseData } from '../interfaces/interfaces';
import MessageComponentLeft from './MessageComponentLeft';
import MessageComponentRight from './MessageComponentRight';
import { chatSocket, chatSocketContext } from '../context/soketContext';
import { ChatContext } from '../context/soketContext';
import { checkOpenChannelId, checkOpenPersonalId } from './ChatUtils';
import { useSearchParams } from 'next/navigation';
import DmMessageComponentRight from './DmMessageComponentRight';
import DmMessageComponentLeft from './DmMessageComponentLeft';



interface PersonalContentProps {}

const PersonalContent: FC<PersonalContentProps> = () => {

		const scrollableRef = useRef<any>(null);
		const {personalId, setPersonalId, user, personal} = useContext(ChatContext);
		const [messages, setMessages] = useState<DmMessageInter[]>([])
		const chatSocket = useContext(chatSocketContext);

		useEffect(() => {
			if (scrollableRef.current) {
				scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
			}
		}, [messages]);


		useEffect(() => {
			chatSocket.emit('getMessagesDM', {
				dmId: personalId,
			})
		}, [personalId, chatSocket])


		useEffect(() => {
			chatSocket.on('messagesDM', (data: DmMessageInter[]) => {
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

			chatSocket.on('messageDoneCH', (data: MessageInter) => {
				chatSocket.emit('getUserChannels');
			})

				
			return () => {
				chatSocket.off('messageDoneDM')
				chatSocket.off('messageDoneCH')
				chatSocket.off('messagesDM')
			}
		},[personalId, chatSocket])



		return (
			<div ref={scrollableRef} className={`w-full flex-grow p-2 gap-1 flex flex-col mt-3 mb-3 overflow-y-auto styled-scrollbar overflow-x-hidden`}>
				{
					messages.length > 0 && messages.map((message) => {
						if ((message.sender === message.self) && (message.sender === user?.nickname))
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
