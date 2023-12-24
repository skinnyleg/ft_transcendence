'use client'
import React, { FC, useContext, useEffect, useState } from 'react'
import { Metadata } from 'next'
import RightBar from '../ui/RightBar'
import LeftBar from '../ui/LeftBar'
import Content from '../ui/Content'
import TopBar from '../ui/top'
import { createContext } from 'vm'
import { useRouter } from 'next/navigation'
import { chatSocketContext } from '../context/soketContext'
import { ChannelInter, responseData } from '../interfaces/interfaces'


interface ChatProps {}

export const ChatContext = React.createContext<any>({});

const chat: FC<ChatProps> = () => {
	const [channelId, setChannelId] = useState<string>('')
	const [user, setUser] = useState<responseData | null>(null);
	const [channel, setChannel] = useState<ChannelInter | null>(null);
	const router = useRouter();
	const chatSocket = useContext(chatSocketContext);

	const setChannelQuery = (newName: string) => {
		if (newName === '')
		{
			deleteChannelQuery();
			return ;
		}
		console.log('newName == ', newName);
		router.replace(`/Chat?channel=${newName}`);
	}

	const deleteChannelQuery = () => {
		router.replace(`/Chat`);
	}
	useEffect(() => {
		setChannelQuery(channelId);
	}, [channelId])

	useEffect(() => {
		chatSocket.on('outDone', () => {
			deleteChannelQuery();
			chatSocket.emit('getUserChannels');
		})

		return () => {
			chatSocket.off('outDone')
		}
	}, [chatSocket])

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
	}, [])

	return (
		<div className='flex flex-col font-white bg-main overflow-y-hidden md:overflow-y-auto mr-0'>
			<TopBar />
		<ChatContext.Provider value={{channelId, setChannelId, user, setUser, channel, setChannel}}>
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
