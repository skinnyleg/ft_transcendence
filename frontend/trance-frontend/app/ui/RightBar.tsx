"use client"
import { useEffect, type FC, useContext } from 'react';
import ChannelTab from './ChannelTab';
import PersonalTab from './PersonalTab';
import { useSearchParams } from 'next/navigation';
import { checkOpenChannelId, isBarOpen, isHidden, whichTab } from './ChatUtils';
import { ChatContext, chatSocketContext } from '../context/soketContext';
import { useRouter } from 'next/navigation';
import { DmMessageInter, MessageInter } from '../interfaces/interfaces';

interface RightBarProps {}

const RightBar: FC<RightBarProps> = ({}) => {
	const {channelId, barOpen, personalId, hideTabs, setChannelId} = useContext(ChatContext)
	const chatSocket = useContext(chatSocketContext)
	const router = useRouter()



	useEffect(() => {
		chatSocket.on('messageDoneCH', (data: MessageInter) => {
			chatSocket.emit('getUserChannels');
		})
		chatSocket.on('messageDoneDM', (data: DmMessageInter) => {
			chatSocket.emit('getUserDms');
		})


		return () => {
			chatSocket.off('messageDoneCH')
			chatSocket.off('messageDoneDM')
		}
	}, [chatSocket])
	return (
			<div className={`h-full w-full  md:w-full md:flex lg:flex ${personalId !== '' ? 'lg:w-[36.65%] xl:w-[39.3%]' : 'lg:w-[55%]'} flex justify-between flex-col
				${hideTabs ? 'hidden' : ''} ${barOpen ? 'md:hidden' : ''} transition duration-1000 ease-in-out`}>
				<ChannelTab />
				<PersonalTab />
			</div>
	);
}
export default RightBar;
