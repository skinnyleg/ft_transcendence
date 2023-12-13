"use client"
import type { FC } from 'react';
import { ChannelInter, ChannelUser } from '../interfaces/interfaces';
import UserCard from './UserCard';
import { CiSearch } from "react-icons/ci";
import { useRouter, useSearchParams } from 'next/navigation';
import { IoIosArrowBack } from "react-icons/io";
import { IconWithTooltip } from './CustomIcons';
import { channelUsers, channels, user } from './ChatConstants';

interface ChatSideBarProps {
	channelId: string | null;
}

const ChatSideBar: FC<ChatSideBarProps> = ({channelId}) => {

	const searchParams = useSearchParams()
	const router = useRouter();
	const channel = channels.find((c) => c.id === channelId);
	const isJoined = channel?.isJoined ?? false;

	const handleCloseSideBar = () => {
		const channelId = searchParams.get('channel')
		router.replace(`/Chat?channel=${channelId}`);
	}

	const renderBar = (channelUsers: ChannelUser[], userRole: string[]) => {
		const users = channelUsers.filter((user) => userRole.includes(user.userRole));
		if (users.length === 1 && users[0].userNick === user.userNick)
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

		return (
		<div className={`w-full bg-teal-600 lg:ml-2 rounded-xl flex flex-col p-2 h-full overflow-y-auto`}>
			<div className={`${isJoined ? '' : 'blur overflow-y-hidden'}`}>
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
					/>
				</div>
				{renderBar(channelUsers, ['ADMIN', 'OWNER'])}
				{
					channelUsers
					.filter((u) => (u.userRole === 'ADMIN' || u.userRole === 'OWNER') && user.userNick !== u.userNick)
					.map((admin) => (
						<UserCard key={admin.id} user={admin} userRole={channel?.userRole} />
					))
				}
				{renderBar(channelUsers, ['MEMBER'])}
				{
					channelUsers
					.filter((u) => u.userRole === 'MEMBER' && u.userNick !== user.userNick)
					.map((member) => (
						<UserCard key={member.id} user={member} userRole={channel?.userRole}/>
					))
				}
			</div>
		</div>
	);
}
export default ChatSideBar;
