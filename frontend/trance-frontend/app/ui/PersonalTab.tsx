'use client'
import React, { useContext, useEffect, useState } from 'react'
import { CiSearch } from "react-icons/ci";
import UserDms from './UserDms';
import { ChatContext, chatSocketContext } from '../context/soketContext';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { ChannelInter, DmsInter } from '../interfaces/interfaces';
import { isHidden, whichTab } from './ChatUtils';

const PersonalTab = () => {


	const chatSocket = useContext(chatSocketContext)
	const router = useRouter()
	const {channelId, setChannelId,personalId, searchInputDm, setSearchInputDm} = useContext(ChatContext);
	const [userDms, setUserDms] = useState<DmsInter[]>([]);
	const [info, setInfo] = useState<string>('Add Some Friends');


	useEffect(() => {
		chatSocket.emit('getUserDms');
		chatSocket.on("ready", () => {
			chatSocket.emit('getUserDms');
		   });

		   return () => {
			chatSocket.off('ready');
		   }
	}, [chatSocket])
	
	useEffect(() => {
		
		
		chatSocket.on('userDms', (data: DmsInter[]) => {
			setUserDms(data);
		})

		chatSocket.on('refreshUserDms', () => {
			chatSocket.emit('getUserDms');
		})

		return () => {
			chatSocket.off('userDms').off()
			chatSocket.off('refreshUserDms').off()
		}
	}, [chatSocket])


	return (
		<div className={` rounded-[15px] p-3  shadow-lg bg-teal-600 w-full h-[49%] flex flex-col`}>
		<h1 className='text-teal-300 font-bold text-lg mb-1'>PERSONAL</h1>
		<div className='flex flex-row justify-around rounded-2xl w-full mb-2'>
			<div className='flex flex-row rounded-xl bg-cyan-100 w-full'>
				<CiSearch
					className='w-8  h-10 stroke-1 bg-cyan-100 rounded-2xl pl-2 text-black'
				/>
				<input type='text'
					placeholder='Search Dms...'
					className='w-full h-10 bg-cyan-100 border-none focus:ring-0 text-black rounded-2xl'
					value={searchInputDm}
					onChange={(e) => setSearchInputDm(e.target.value)}
				/>
			</div>
		</div>
		<div className='flex gap-0 flex-col w-full h-full overflow-y-auto styled-scrollbar'>
			<UserDms
				userDms={userDms.filter((dm) => dm.name.includes(searchInputDm))}
				info={info}
			/>
		</div>
	</div>
	)
}


export default PersonalTab;
