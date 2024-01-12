"use client"
import { useState, type FC, useContext, useEffect } from 'react';
import { ChannelInter, ChannelUser } from '../interfaces/interfaces';
import UserCard from './UserCard';
import { CiSearch } from "react-icons/ci";
import { useRouter, useSearchParams } from 'next/navigation';
import { IoIosArrowBack } from "react-icons/io";
import { IconWithTooltip } from './CustomIcons';
import { ChatContext, chatSocketContext } from '../context/soketContext';
import { chatSocket } from '../context/soketContext';

interface ChatSideBarProps {}

const ChatSideBar: FC<ChatSideBarProps> = () => {


	const {channelIdRef,channelId, setChannelId, user, channel, setBarOpen} = useContext(ChatContext);

	// const searchParams = useSearchParams()
	const router = useRouter();
	const val = channel?.userRole as string;
	const isJoined = val !== 'none' ? true : false;
	const [channelUsers, setChannelsUsers] = useState<ChannelUser[]>([])
	const chatSocket = useContext(chatSocketContext);
	const [search, setSearch] = useState('');



	useEffect(() => {
		// console.log('load time users channels')

		//Old Method
		// chatSocket.emit('getChSidebar', {
		// 	channelName: channelId
		// })

		// New Method
		chatSocket.emit('getChSidebar', {
			channelName: channelId
		})
	}, [channelId])

	useEffect(() => {

		chatSocket.on('channelSidebar', (data: ChannelUser[]) => {
			// console.log('sideBar data == ', data);
			setChannelsUsers(data);
		})


		// Old Method
		// chatSocket.on('refreshSide', () => {
		// 	// console.log('refresh == ', channelId)
		// 	chatSocket.emit('getChSidebar', {
		// 		channelName: channelId
		// 	})
		// 	chatSocket.emit('getDataCH',{
		// 		channelName: channelId
		// 	})
		// })



		// New Method
		chatSocket.on('refreshSide', () => {
			// console.log('refresh == ', channelId)
			chatSocket.emit('getChSidebar', {
				channelName: channelId
			})
			chatSocket.emit('getDataCH',{
				channelName: channelId
			})
		})
		return () => {
			chatSocket.off('channelSidebar')
			chatSocket.off('refreshSide')
		}
	}, [channelId])

	const filteredUsers = () => {
		if (search === '')
			return (channelUsers);
		const searchUsers = channelUsers.filter(user => user.username?.toLowerCase().includes(search.toLowerCase()));
		return searchUsers;
	}


	const handleCloseSideBar = () => {
		setSearch('');
		setBarOpen(false);
		// router.replace(`/Chat?channel=${channelId}`);
	}

	const renderBar = (channelUsers: ChannelUser[], userRole: string[]) => {
		const users = channelUsers.filter((user) => userRole.includes(user.channelRole as string));

		if (users.length === 0)
			return null;
		if (users.length === 1 && (user && (users[0].username === user.nickname as string)))
			return null;
		return (
			<div className='flex items-center gap-1 h-7 mt-2 p-1'>
				<h1 className='text-teal-800 font-bold font-sans w-fit text-xs'>
					{userRole.length > 1 ? 'ADMINS' : 'MEMBERS'}
				</h1>
				<div className="w-[100%] h-1 bg-teal-800 rounded-full"></div>
			</div>
		);
	}

		// if (channelUsers.length === 0)
		// {
		// 	return (
		// 		<></>
		// 	);
		// }

		return (
		<div className={`w-full bg-teal-600 lg:ml-2 rounded-xl flex flex-col p-2 h-full overflow-y-auto styled-scrollbar`}>
			<div className={`${isJoined === true ? '' : 'blur overflow-y-hidden pointer-events-none'}`}>
				<div className='flex flex-row rounded-xl bg-teal-200 w-full items-center sticky top-0'>
					<IconWithTooltip
						icon={IoIosArrowBack}
						styles='w-8 h-8 hover:cursor-pointer block lg:hidden text-black'
						tooltipId="backToolTip"
						tooltipContent="Go Back"
						clickBehavior={handleCloseSideBar}
					/>
					<CiSearch
						className='w-8 h-10 bg-teal-200 rounded-xl pl-2 text-black'
					/>
					<input type='text'
						placeholder='Search Users...'
						className='w-4/5 h-10 bg-teal-200 rounded-xl border-none focus:ring-0 text-black'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				{renderBar(filteredUsers(), ['ADMIN', 'OWNER'])}
				{
					filteredUsers()
					.filter((u) => (u.channelRole === 'ADMIN' || u.channelRole === 'OWNER') && (user && (user.nickname !== u.username)))
					.map((admin) => (
						<UserCard key={admin.userId} user={admin} userRole={channel?.userRole} />
					))
				}
				{renderBar(filteredUsers(), ['MEMBER'])}
				{
					filteredUsers()
					.filter((u) => u.channelRole === 'MEMBER' && (user && (u.username !== user.nickname)))
					.map((member) => (
						<UserCard key={member.userId} user={member} userRole={channel?.userRole}/>
					))
				}
			</div>
		</div>
	);
}
export default ChatSideBar;
