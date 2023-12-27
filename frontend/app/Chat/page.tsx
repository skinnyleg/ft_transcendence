'use client'
import React, { FC, useContext, useEffect, useState } from 'react'
import { Metadata } from 'next'
import RightBar from '../ui/RightBar'
import LeftBar from '../ui/LeftBar'
import Content from '../ui/Content'
import TopBar from '../ui/top'
import { createContext } from 'vm'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChatContext, socketContext, socket, chatSocketContext } from '../context/soketContext'
import { ChannelInter, responseData } from '../interfaces/interfaces'
import { checkIsOnDemandRevalidate } from 'next/dist/server/api-utils'
import { checkOpenChannel, checkOpenChannelId } from '../ui/ChatUtils'


interface ChatProps {}



const chat: FC<ChatProps> = () => {
	const searchParams = useSearchParams();
	const extractChannelName = () => {
		let newName = '';
		if (searchParams.has('channel') && searchParams.get('channel') !== '')
		{
			newName = searchParams.get('channel') as string
			// console.log('newName in root == ', newName);
			// setChannelId(newName);
		}
		console.log('newName == ', newName)
		return newName
	}
	// const [channelId, setChannelId] = useState<string>(extractChannelName())
	const [channelId, setChannelId] = useState<string>('')
	const [searchInput, setSearchInput] = useState<string>('');
	const [user, setUser] = useState<responseData>();
	const [channel, setChannel] = useState<ChannelInter | null>(null);
	const router = useRouter();
	const chatSocket = useContext(chatSocketContext);
	const pathname = usePathname();


	const setChannelQuery = (newName: string) => {
		// console.log('newName == ', newName)
		if (newName === '')
		{
			deleteChannelQuery();
			return ;
		}
		router.replace(`/Chat?channel=${newName}`);
	}
	const deleteChannelQuery = () => {
		router.replace(`/Chat`);
	}

	useEffect(() => {
		console.log('entered useEffect channelId == ', channelId)
		// setChannelId(channelId);
		// let newName: string;
		// if (channelId === '')
		// {
		// 	if (searchParams.has('channel') && searchParams.get('channel') !== '')
		// 	{
		// 		newName = searchParams.get('channel') as string
		// 		setChannelId(newName);
		// 		setChannelQuery(channelId);
		// 		return ;
		// 	}
		// }
		setChannelQuery(channelId);
	}, [channelId])

	useEffect(() => {

		chatSocket.on('outDone', (data: {channelName: string}) => {
			console.log('searchParams == ', searchParams.get('channel'))
			console.log('page sent from on == ', data.channelName)
			console.log('page sent from state == ', channelId)
			if (checkOpenChannelId(data.channelName, channelId) == true)
			{
				deleteChannelQuery();
				setChannelId('');
			}
			chatSocket.emit('getUserChannels');
		})
		return () => {
			chatSocket.off('outDone')
		}
	}, [chatSocket, channelId])

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await fetch(`http://localhost:8000/user/Nickname`, {
				  method: "GET",
				  credentials: "include",
				  headers: { "Content-Type": "application/json" },
				});
				if (res.ok) {
					const nickname = await res.json();
					setUser(nickname);
				}
			} catch (error) {
				console.log('error ' , error);
			}
		}
		fetchUser();
		deleteChannelQuery();
	}, [])

	return (
		<div className='flex flex-col font-white bg-main overflow-y-hidden md:overflow-y-auto mr-0'>
				<TopBar />
		<ChatContext.Provider value={{channelId, setChannelId, user, setUser, channel, setChannel, searchInput, setSearchInput}}>
			<div className='h-[100vh] md:h-[99vh] min-[1024px]:h-[88vh] mt-0 xl:mt-2 lg:mt-2 xl:h-[90vh] xl:pb-0 w-full md:justify-between flex flex-row  md:gap-2 min-[1024px]:gap-0 pt-[70px] pr-1 pl-1 lg:pb-0 lg:pt-1'>
				<RightBar />
				<Content />
				<LeftBar />
			</div>
		</ChatContext.Provider>
		</div>
	)


}

export default chat;
