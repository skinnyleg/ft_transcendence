"use client"
import React, { useContext, useEffect, useState } from 'react'
import UserChannels from './UserChannels';
import { CiSearch } from "react-icons/ci";
import { IoMdAddCircleOutline } from "react-icons/io";
import { CreateChannelIcon } from './CustomIcons';
import CreateChannelComponent from './CreateChannelComponent';
import { ChatContext, chatSocketContext } from '../context/soketContext';
import { ChannelInter, DmMessageInter } from '../interfaces/interfaces';
import { useDebouncedCallback } from 'use-debounce';
import { useRouter, useSearchParams } from 'next/navigation';
import { checkOpenChannelId, isHidden, whichTab } from './ChatUtils';


const ChannelTab = () => {

	const chatSocket = useContext(chatSocketContext)
	// const searchParams = useSearchParams();
	const router = useRouter()
	const {channelIdRef, channelId, setChannelId, searchInputCh, setSearchInputCh} = useContext(ChatContext);
	const [userChannels, setUserChannels] = useState<ChannelInter[]>([]);
	const [info, setInfo] = useState<string>('Join Or Create Your Own Channel');
	// const hidden = whichTab(searchParams)



	const deleteChannelQuery = () => {
		router.replace(`/Chat`);
	}


	useEffect(() => {
		chatSocket.emit('getUserChannels');
		chatSocket.on("ready", () => {
			chatSocket.emit('getUserChannels');
		   });
		   chatSocket.on('queryChannels', (data: ChannelInter[]) => {
			   // // console.log('query channels == ', data)
			   setUserChannels(data);
		   })
		   chatSocket.on('channelDone', (data: ChannelInter) => {
			   // // console.log('inside channel Done append')
			   setUserChannels((prevuserChannels) => {
				   return [...prevuserChannels, data]
			   })
		   })
		   chatSocket.on('UserChannels', (data: ChannelInter[]) => {
			// // console.log("channels == ", data);
			setUserChannels(data);
		})


		return () => {
			chatSocket.off('ready');
			chatSocket.off('queryChannels');
			chatSocket.off('channelDone');
			chatSocket.off('UserChannels');
		}
	}, [chatSocket])
	
	useEffect(() => {
		

		// Old method 
		// chatSocket.on('PicDone', (data: {channelName: string}) => {
		// 	// // console.log('change pic')
		// 	// // console.log('searchParams == ', searchParams.get('channel'))
		// 	// // console.log('sent from on == ', data.channelName)
		// 	// // console.log('sent from state == ', channelId)
		// 	chatSocket.emit('getUserChannels')
		// 	if (checkOpenChannelId(data.channelName, channelId) === true)
		// 	{
		// 		chatSocket.emit('getDataCH', {
		// 			channelName: channelId,
		// 		})
		// 	}
		// })

		// chatSocket.on('muteDone', (data: {channelName: string}) => {
		// 	if (checkOpenChannelId(data.channelName, channelId) === true)
		// 	{
		// 		chatSocket.emit('getDataCH', {
		// 			channelName: channelId,
		// 		})
		// 	}
		// })

		//new Method
		chatSocket.on('PicDone', (data: {channelName: string}) => {
			// // console.log('change pic')
			// // console.log('searchParams == ', searchParams.get('channel'))
			// // console.log('sent from on == ', data.channelName)
			// // console.log('sent from state == ', channelId)
			chatSocket.emit('getUserChannels')
			// if (checkOpenChannelId(data.channelName, channelId) === true)
			// {
			// 	chatSocket.emit('getDataCH', {
			// 		channelName: channelId,
			// 	})
			// }
		})

		// maybe here TODO
		chatSocket.on('muteDone', (data: {channelName: string}) => {
			// if (checkOpenChannelId(data.channelName, channelId) === true)
			// {
			// 	chatSocket.emit('getDataCH', {
			// 		channelName: channelId,
			// 	})
			// }
		})


		// chatSocket.on('outDone', (data: {channelName: string}) => {
		// 	// console.log('searchParams == ', searchParams.get('channel'))
		// 	// console.log('sent from on == ', data.channelName)
		// 	// console.log('sent from state == ', channelId)
		// 	if (checkOpenChannelId(data.channelName, channelId) == true)
		// 	{
		// 		deleteChannelQuery();
		// 		setChannelId('');
		// 	}
		// 	chatSocket.emit('getUserChannels');
		// })

		// chatSocket.on('messageDoneDM', (data: DmMessageInter) => {
		// 	// console.log("messages Data personal doneasdasdas == ", data);
		// 	chatSocket.emit('getUserDms');
		// })
	
		return () => {
			chatSocket.off('UserChannels').off()
			chatSocket.off('queryChannels').off()
			chatSocket.off('channelDone').off()
			chatSocket.off('PicDone')
			chatSocket.off('muteDone')
			chatSocket.off('messageDoneDM')
			// chatSocket.off('outDone')
		}
	}, [chatSocket])



	const debouncedSearchWebSocket = useDebouncedCallback((searchInput) => {
		if (searchInput !== '')
		{
			chatSocket.emit('searchChannel', {
				channelName: searchInput
			})
		}
	}, 30); // 500 milliseconds debounce time

	useEffect(() => {
	  if (searchInputCh && searchInputCh !== '') {
		debouncedSearchWebSocket(searchInputCh);
		setInfo('No Channel Found!!')
	  }
	  else
	  {
		chatSocket.emit('getUserChannels');
		setInfo('Join Or Create Your Own Channel')
	  }
	}, [searchInputCh, chatSocket, debouncedSearchWebSocket]);


	return (
		<div className={`bg-teal-600 rounded-[15px] p-3 shadow-lg w-full h-[49%] flex flex-col`}>
			<h1 className='text-teal-300 font-bold text-lg mb-1'>CHANNELS</h1>
			<div className='flex flex-row justify-around rounded-2xl w-full mb-2'>
				<div className='flex flex-row rounded-s-2xl bg-cyan-100 w-4/5'>
					<CiSearch
						className='w-8  h-10 stroke-1 bg-cyan-100 rounded-s-2xl pl-2 text-black'
					/>
					<input type='text'
						placeholder='Search Channels...'
						className='w-4/5 h-10 bg-cyan-100 border-none focus:ring-0 text-black'
						value={searchInputCh}
						onChange={(e) => setSearchInputCh(e.target.value)}
					/>
				</div>
				<CreateChannelComponent />
			</div>
			<div className='flex gap-0 flex-col w-full h-full overflow-y-auto styled-scrollbar'>
				<UserChannels
					channels={userChannels}
					info={info}
				/>
			</div>
		</div>
	)
}


export default ChannelTab;