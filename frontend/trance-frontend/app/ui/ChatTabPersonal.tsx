'use client'
import { useEffect, type FC, useContext, useState } from 'react';
import ChatTopBar from './ChatTopBar';
import ChatContent from './ChatContent';
import ChatTypeBar from './ChatTypeBar';
import { ChannelInter, DmsInter, NotificationsData } from '../interfaces/interfaces';
import { chatSocketContext, socketContext } from '../context/soketContext';
import { checkOpenChannelId, getChannelName } from './ChatUtils';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChatContext } from '../context/soketContext';
import ChannelName from './ChangeChannelName';
import PersonalTopBar from './PersonalTopBar';
import PersonalTypeBar from './PersonalTypeBar';
import PersonalContent from './PersonalContent';



interface ChatTabProps {}


const ChatTabPersonal: FC<ChatTabProps> = () => {
	const chatSocket = useContext(chatSocketContext);
	const {personalId, setPersonalId, setPersonal, personal, setSearchInputDm} = useContext(ChatContext);
	const router = useRouter()
	const socket = useContext(socketContext);


	const deleteChannelQuery = () => {
		router.replace(`/Chat`);
	}


	useEffect(() => {
		chatSocket.emit('getDataDm', {
			dmId: personalId,
		})
		socket.on('refreshBlockDm', (data: string) => {
			chatSocket.emit('getDataDm', {
				dmId: personalId
			})
		})
	}, [personalId, chatSocket, socket])



	useEffect(() => {



		chatSocket.on('DmData', (data: DmsInter) => {
			setPersonal(data);
		})
		return () => {
			chatSocket.off('DmData')
		}
	}, [chatSocket, setPersonal])


	if (personal === undefined)
	{
		return (
			<></>
		);
	}
		return (
			<div className='w-full h-full bg-teal-600 lg:ml-2 rounded-xl flex flex-col justify-between p-3'>
				<PersonalTopBar
					/>
				<PersonalContent
					/>
				<PersonalTypeBar
					key={personal?.dmId}
				/>
			</div>
		);
}
export default ChatTabPersonal;
