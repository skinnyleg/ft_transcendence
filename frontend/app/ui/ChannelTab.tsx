"use client"
import React, { useContext, useEffect, useState } from 'react'
import UserChannels from './UserChannels';
import { CiSearch } from "react-icons/ci";
import { IoMdAddCircleOutline } from "react-icons/io";
import { CreateChannelIcon } from './CustomIcons';
import CreateChannelComponent from './CreateChannelComponent';
import { chatSocketContext } from '../context/soketContext';
import { ChannelInter } from '../interfaces/interfaces';
import { useDebouncedCallback } from 'use-debounce';


const ChannelTab = () => {

	const chatSocket = useContext(chatSocketContext)
	const [userChannels, setUserChannels] = useState<ChannelInter[]>([]);
	const [searchInput, setSearchInput] = useState<string>('');
	const [info, setInfo] = useState<string>('Join Or Create Your Own Channel');


	useEffect(() => {
		chatSocket.emit('getUserChannels');
		chatSocket.on('UserChannels', (data: ChannelInter[]) => {
			console.log("channels == ", data);
			setUserChannels(data);
		})
		// chatSocket.on('queryChannels', (data: ChannelInter[]) => {
		// 	console.log('query channels == ', data)
		// 	setUserChannels(data);
		// })

		chatSocket.on('channelDone', (data: ChannelInter) => {
			setUserChannels((prevuserChannels) => {
				return [...prevuserChannels, data]
			})
		})
		return () => {
			chatSocket.off('channelDone').off()
			chatSocket.off('UserChannels').off()
		}
	},[chatSocket])



	const debouncedSearchWebSocket = useDebouncedCallback((searchInput) => {
		console.log('asdjhas')
		chatSocket.emit('searchChannel', {
			channelName: searchInput
		})
		chatSocket.on('queryChannels', (data: ChannelInter[]) => {
			console.log('query channels2 == ', data)
			setUserChannels(data);
		})
	}, 500); // 500 milliseconds debounce time

	useEffect(() => {
	  if (searchInput) {
		debouncedSearchWebSocket(searchInput);
		setInfo('No Channel Found!!')
	  }
	  else
	  {
		chatSocket.emit('getUserChannels');
		setInfo('Join Or Create Your Own Channel')
	  }
	}, [searchInput, debouncedSearchWebSocket]);
	return (
		<div className="bg-teal-600 rounded-[15px] p-3 w-full shadow-lg lg:w-full h-[49%] flex flex-col">
			<h1 className='text-teal-300 font-bold text-lg mb-1'>CHANNELS</h1>
			<div className='flex flex-row justify-around rounded-2xl w-full mb-2'>
				<div className='flex flex-row rounded-s-xl bg-cyan-100 w-4/5'>
					<CiSearch
						className='w-8  h-10 stroke-1 bg-cyan-100 rounded-s-lg pl-2 text-black'
					/>
					<input type='text'
						placeholder='Search Channels...'
						className='w-4/5 h-10 bg-cyan-100 border-none focus:ring-0 text-black'
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
					/>
				</div>
				<CreateChannelComponent />
			</div>
			<div className='flex gap-0 flex-col w-full h-full overflow-y-auto'>
				<UserChannels
					channels={userChannels}
					info={info}
				/>
			</div>
		</div>
	)
}


export default ChannelTab;
