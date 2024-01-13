"use client"
import { useEffect, type FC, useContext } from 'react';
import ChannelTab from './ChannelTab';
import PersonalTab from './PersonalTab';
import { useSearchParams } from 'next/navigation';
import { isBarOpen, isHidden, whichTab } from './ChatUtils';
import { ChatContext, chatSocketContext } from '../context/soketContext';
import { useRouter } from 'next/navigation';
import { DmMessageInter, MessageInter } from '../interfaces/interfaces';

interface RightBarProps {}

const RightBar: FC<RightBarProps> = ({}) => {
	// const searchParams = useSearchParams()

	// const hidden = isHidden(searchParams)
	// const which = whichTab(searchParams)
	// const sideBar = isBarOpen(searchParams)
	const {channelId, barOpen, personalId, hideTabs} = useContext(ChatContext)
	const chatSocket = useContext(chatSocketContext)
	const router = useRouter()



	useEffect(() => {
		chatSocket.on('messageDoneCH', (data: MessageInter) => {
			// console.log('got new message == ', data);
			chatSocket.emit('getUserChannels');
			// if (checkOpenChannelId(data.channelId, channelId) == true)
			// {
			// 	setMessages((prevMessages) => {
			// 		console.log('prevmessages == ', prevMessages);
			// 		const index = prevMessages.length - 1;
			// 		if (index >= 0 && prevMessages[index].sender === data.sender)
			// 		{
			// 			prevMessages[index].picture = '';
			// 		}
			// 		console.log('data == ', data);
			// 		return [...prevMessages, data]
			// 	})
			// }
		})
		chatSocket.on('messageDoneDM', (data: DmMessageInter) => {
			// console.log('got new message == ', data);
			chatSocket.emit('getUserDms');
			// if (checkOpenChannelId(data.channelId, channelId) == true)
			// {
			// 	setMessages((prevMessages) => {
			// 		console.log('prevmessages == ', prevMessages);
			// 		const index = prevMessages.length - 1;
			// 		if (index >= 0 && prevMessages[index].sender === data.sender)
			// 		{
			// 			prevMessages[index].picture = '';
			// 		}
			// 		console.log('data == ', data);
			// 		return [...prevMessages, data]
			// 	})
			// }
		})

	}, [chatSocket])
	// <div className={`h-full w-full  md:w-full md:flex lg:flex  lg:w-[21.74%] flex justify-between flex-col
	// 	${hidden ? 'hidden' : ''} ${sideBar ? 'md:hidden' : ''} transition duration-1000 ease-in-out`}>
	return (
			<div className={`h-full w-full  md:w-full md:flex lg:flex ${personalId !== '' ? 'lg:w-[36.65%] xl:w-[39.3%]' : 'lg:w-[55%]'} flex justify-between flex-col
				${hideTabs ? 'hidden' : ''} ${barOpen ? 'md:hidden' : ''} transition duration-1000 ease-in-out`}>
				<ChannelTab />
				<PersonalTab />
			</div>
	);
}
export default RightBar;
