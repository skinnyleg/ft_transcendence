'use client'
import { useEffect, type FC, useContext, useState } from 'react';
import ChatTopBar from './ChatTopBar';
import ChatContent from './ChatContent';
import ChatTypeBar from './ChatTypeBar';
import { ChannelInter, NotificationsData } from '../interfaces/interfaces';
import { chatSocketContext } from '../context/soketContext';
import { checkOpenChannelId, getChannelName } from './ChatUtils';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChatContext } from '../context/soketContext';
import ChannelName from './ChangeChannelName';



interface ChatTabProps {}


const ChatTabChannel: FC<ChatTabProps> = () => {
	const chatSocket = useContext(chatSocketContext);
	const {channelIdRef,channelId, setChannelId, setChannel, channel, setSearchInputCh} = useContext(ChatContext);
	const router = useRouter()


	useEffect(() => {
		chatSocket.emit('getDataCH', {
			channelName: channelId,
		})
	}, [channelId, chatSocket])



	useEffect(() => {
		chatSocket.on('channelData', (data: ChannelInter) => {
			setChannel(data);
		})
		
		chatSocket.on('joinDone', () => {
			chatSocket.emit('getUserChannels');
			chatSocket.emit('getDataCH', {
				channelName: channelId,
			})
			chatSocket.emit('getMessagesCH', {
				channelName: channelId,
			})
			setSearchInputCh('')
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
			if (checkOpenChannelId(data.channelName, channelId) == true)
			{
				chatSocket.emit('getDataCH', {
					channelName: channelId,
				})
			}
		})


		return () => {
			chatSocket.off('PicDone')
			chatSocket.off('channelData')
			chatSocket.off('joinDone')
			chatSocket.off('changeDone')
		}
	}, [channelId, chatSocket, setChannel, setSearchInputCh])



	if (channel === undefined)
	{
		return (
			<></>
		);
	}
		return (
			<div className='w-full h-full bg-teal-600 lg:ml-2 rounded-xl flex flex-col justify-between p-3'>
				<ChatTopBar
					/>
				<ChatContent
					/>
				<ChatTypeBar
					key={channel?.channelId}
				/>
			</div>
		);
}
export default ChatTabChannel;
