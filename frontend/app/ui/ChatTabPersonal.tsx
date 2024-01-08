'use client'
import { useEffect, type FC, useContext, useState } from 'react';
import ChatTopBar from './ChatTopBar';
import ChatContent from './ChatContent';
import ChatTypeBar from './ChatTypeBar';
import { ChannelInter, DmsInter, NotificationsData } from '../interfaces/interfaces';
import { chatSocketContext } from '../context/soketContext';
import { checkOpenChannelId, getChannelName } from './ChatUtils';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChatContext } from '../context/soketContext';
import ChannelName from './ChangeChannelName';
import PersonalTopBar from './PersonalTopBar';
import PersonalTypeBar from './PersonalTypeBar';
import PersonalContent from './PersonalContent';



interface ChatTabProps {}


const ChatTabPersonal: FC<ChatTabProps> = () => {
	const searchParams = useSearchParams();
	const chatSocket = useContext(chatSocketContext);
	const {personalId, setPersonalId, setPersonal, personal, setSearchInputDm} = useContext(ChatContext);
	const router = useRouter()


	const deleteChannelQuery = () => {
		router.replace(`/Chat`);
	}


	useEffect(() => {
		chatSocket.emit('getDataDm', {
			dmId: personalId,
		})
	}, [personalId])



	useEffect(() => {



		chatSocket.on('DmData', (data: DmsInter) => {
			console.log('channel data2 == ', data);
			setPersonal(data);
		})
		
		// chatSocket.on('joinDone', () => {
		// 	chatSocket.emit('getUserChannels');
		// 		chatSocket.emit('getDataCH', {
		// 			channelName: channelId,
		// 		})
		// 		setSearchInput('')
		// })



		// chatSocket.on('changeDone', (data: {channelName: string}) => {
		// 	if (checkOpenChannelId(data.channelName, channelId) == true)
		// 	{
		// 		chatSocket.emit('getDataCH', {
		// 			channelName: channelId,
		// 		})
		// 	}
		// })

		// chatSocket.on('PicDone', (data: {channelName: string}) => {
		// 	chatSocket.emit('getUserChannels')
		// 	// console.log('chat tab searchParams == ', searchParams.get('channel'))
		// 	// console.log('chat tab sent from on == ', data.channelName)
		// 	// console.log('chat tab sent from state == ', channelId)
		// 	if (checkOpenChannelId(data.channelName, channelId) == true)
		// 	{
		// 		chatSocket.emit('getDataCH', {
		// 			channelName: channelId,
		// 		})
		// 	}
		// })


		// chatSocket.on('outDone', (data: {channelName: string}) => {
		// 	console.log('chat tab searchParams == ', searchParams.get('channel'))
		// 	console.log('chat tab sent from on == ', data.channelName)
		// 	console.log('chat tab sent from state == ', channelId)
		// 	if (checkOpenChannelId(data.channelName, channelId) == true)
		// 	{
		// 		deleteChannelQuery();
		// 		setChannelId('');
		// 	}
		// 	chatSocket.emit('getUserChannels');
		// })


		// chatSocket.on("notifHistory", (data: NotificationsData) => {
        //     console.log("data chatSocket == ", data);
        //     setNotifications((prevNotifications) => {
        //         return [...prevNotifications, data];
        //     });
        //     handleNewNotification(data);
        // });


		return () => {
			// chatSocket.off('newName')
			// chatSocket.off('PicDone')
			chatSocket.off('DmData')
			// chatSocket.off('joinDone')
			// chatSocket.off('changeDone')
			// chatSocket.off('outDone')
		}
	}, [chatSocket, personalId])


	if (personal === undefined)
	{
		return (
			// <h1>Start Chatting Now</h1>
			<></>
		);
	}
		return (
			<div className='w-full h-full bg-teal-600 lg:ml-2 rounded-xl flex flex-col justify-between p-3'>
				<PersonalTopBar
					// key={channel.id}
					/>
				<PersonalContent
					// key={channel.id}
					/>
				<PersonalTypeBar
					key={personal?.dmId}
				/>
			</div>
		);
}
export default ChatTabPersonal;
