'use client'
import { useEffect, type FC, useContext, useState } from 'react';
import ChatTopBar from './ChatTopBar';
import ChatContent from './ChatContent';
import ChatTypeBar from './ChatTypeBar';
import { ChannelInter } from '../interfaces/interfaces';
import { channels } from './ChatConstants';
import { chatSocketContext } from '../context/soketContext';
import { getChannelName } from './ChatUtils';
import { useSearchParams } from 'next/navigation';
import { ChatContext } from '../context/soketContext';



interface ChatTabProps {}


const ChatTabChannel: FC<ChatTabProps> = () => {
	const searchParams = useSearchParams();
	const chatSocket = useContext(chatSocketContext);
	const {channelId, setChannelId, setChannel, channel} = useContext(ChatContext);



	useEffect(() => {
		chatSocket.emit('getDataCH', {
			channelName: channelId,
		})
		chatSocket.on('channelData', (data: ChannelInter) => {
			// console.log('channel data == ', data);
			setChannel(data);
			// setChannelId(data.channelName);
		})

		return () => {
			chatSocket.off('channelData')
		}
	}, [channelId])



	useEffect(() => {
		chatSocket.on('newName', (data: {newName: string}) => {
			// console.log('herere, ' , channelId);
			chatSocket.emit('getUserChannels');
			chatSocket.emit('getDataCH', {
				channelName: data.newName
			})
			setChannelId(data.newName);
		})
		
		chatSocket.on('PicDone', (data: {channelName: string}) => {
			// console.log('herere newname pic ');
			// console.log('channelName == ', channelId)
			chatSocket.emit('getUserChannels')
			chatSocket.emit('getDataCH', {
				channelName: data.channelName,
			})
			// setChannelId(data.channelName);
		})

		// chatSocket.on('joinDone', () => {
		// 	chatSocket.emit('getUserChannels');
		// 	chatSocket.emit('getDataCH', {
		// 		channelName: channelId,
		// 	})
		// })

		return () => {
			chatSocket.off('newName')
			chatSocket.off('PicDone')
			// chatSocket.off('joinDone')
		}
	}, [chatSocket])


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
