'use client'
import { useEffect, type FC, useContext, useState } from 'react';
import ChatTopBar from './ChatTopBar';
import ChatContent from './ChatContent';
import ChatTypeBar from './ChatTypeBar';
import { ChannelInter } from '../interfaces/interfaces';
import { channels } from './ChatConstants';
import { chatSocketContext } from '../context/soketContext';
import { checkOpenChannelId, getChannelName } from './ChatUtils';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChatContext } from '../context/soketContext';
import ChannelName from './ChangeChannelName';



interface ChatTabProps {}


const ChatTabChannel: FC<ChatTabProps> = () => {
	const searchParams = useSearchParams();
	const chatSocket = useContext(chatSocketContext);
	const {channelId, setChannelId, setChannel, channel, setSearchInput} = useContext(ChatContext);
	const router = useRouter()


	const deleteChannelQuery = () => {
		router.replace(`/Chat`);
	}


	useEffect(() => {
		chatSocket.emit('getDataCH', {
			channelName: channelId,
		})
	}, [channelId])



	useEffect(() => {



		chatSocket.on('channelData', (data: ChannelInter) => {
			console.log('channel data2 == ', data);
			setChannel(data);
		})
		
		chatSocket.on('joinDone', () => {
			chatSocket.emit('getUserChannels');
				chatSocket.emit('getDataCH', {
					channelName: channelId,
				})
				setSearchInput('')
		})



		chatSocket.on('changeDone', (data: {channelName: string}) => {
			if (checkOpenChannelId(data.channelName, channelId) == true)
			{
				chatSocket.emit('getDataCH', {
					channelName: channelId,
				})
			}
		})

		chatSocket.on('PicDone', (data: {channelName: string}) => {
			chatSocket.emit('getUserChannels')
			// console.log('chat tab searchParams == ', searchParams.get('channel'))
			// console.log('chat tab sent from on == ', data.channelName)
			// console.log('chat tab sent from state == ', channelId)
			if (checkOpenChannelId(data.channelName, channelId) == true)
			{
				chatSocket.emit('getDataCH', {
					channelName: channelId,
				})
			}
		})


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

		return () => {
			chatSocket.off('newName')
			chatSocket.off('PicDone')
			chatSocket.off('channelData')
			chatSocket.off('joinDone')
			chatSocket.off('changeDone')
			// chatSocket.off('outDone')
		}
	}, [chatSocket, channelId])


	if (channel === undefined)
	{
		return (
			<h1>Start Chatting Now</h1>
		);
	}
		return (
			<div className='w-full h-full bg-teal-600 lg:ml-2 rounded-xl flex flex-col justify-between p-3'>
				<ChatTopBar
					// key={channel.id}
					/>
				<ChatContent
					// key={channel.id}
					/>
				<ChatTypeBar
					key={channel?.channelId}
				/>
			</div>
		);
}
export default ChatTabChannel;
