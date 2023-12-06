import type { FC } from 'react';
import { ChannelUser } from '../interfaces/interfaces';
import UserCard from './UserCard';
import { CiSearch } from "react-icons/ci";

interface ChatSideBarProps {}

const channelUsers: ChannelUser[] = [
	{
		id: '1',
		userNick: 'skinnyleg',
		userPic: '/GroupChat.png',
		userRole: 'ADMIN'
	},
	{
		id: '2',
		userNick: 'doba',
		userPic: '/GroupChat.png',
		userRole: 'ADMIN'
	},
	{
		id: '3',
		userNick: 'daifi',
		userPic: '/GroupChat.png',
		userRole: 'ADMIN'
	},
	{
		id: '4',
		userNick: 'ayoub',
		userPic: '/GroupChat.png',
		userRole: 'MEMBER'
	},

	{
		id: '5',
		userNick: 'taha',
		userPic: '/GroupChat.png',
		userRole: 'MEMBER'
	},
	{
		id: '6',
		userNick: 'mustapha',
		userPic: '/GroupChat.png',
		userRole: 'MEMBER'
	},
	{
		id: '6',
		userNick: 'mustapha',
		userPic: '/GroupChat.png',
		userRole: 'MEMBER'
	},
	{
		id: '6',
		userNick: 'mustapha',
		userPic: '/GroupChat.png',
		userRole: 'MEMBER'
	},
	{
		id: '6',
		userNick: 'mustapha',
		userPic: '/GroupChat.png',
		userRole: 'MEMBER'
	},
	{
		id: '6',
		userNick: 'mustapha',
		userPic: '/GroupChat.png',
		userRole: 'MEMBER'
	},
	{
		id: '6',
		userNick: 'mustapha',
		userPic: '/GroupChat.png',
		userRole: 'MEMBER'
	},
	{
		id: '6',
		userNick: 'mustapha',
		userPic: '/GroupChat.png',
		userRole: 'MEMBER'
	},
	{
		id: '6',
		userNick: 'mustapha',
		userPic: '/GroupChat.png',
		userRole: 'MEMBER'
	},
	{
		id: '6',
		userNick: 'mustapha',
		userPic: '/GroupChat.png',
		userRole: 'MEMBER'
	},
	{
		id: '6',
		userNick: 'mustapha',
		userPic: '/GroupChat.png',
		userRole: 'MEMBER'
	},
	{
		id: '6',
		userNick: 'mustapha',
		userPic: '/GroupChat.png',
		userRole: 'MEMBER'
	},
	{
		id: '6',
		userNick: 'mustapha',
		userPic: '/GroupChat.png',
		userRole: 'MEMBER'
	},
	{
		id: '6',
		userNick: 'mustapha',
		userPic: '/GroupChat.png',
		userRole: 'MEMBER'
	},
	{
		id: '6',
		userNick: 'mustapha',
		userPic: '/GroupChat.png',
		userRole: 'MEMBER'
	},
]


const ChatSideBar: FC<ChatSideBarProps> = ({}) => {
		return (
		<div className='w-full bg-teal-600 lg:ml-2 rounded-xl flex flex-col p-2 overflow-y-auto'>
			<div className='flex flex-row rounded-xl bg-teal-200 w-full sticky top-0'>
				<CiSearch
					className='w-8 h-10 bg-teal-200 rounded-xl pl-2 text-black'
				/>
				<input type='text'
					placeholder='Search Users...'
					className='w-4/5 h-10 bg-teal-200 border-none focus:ring-0 text-black'
				/>
			</div>
			{ // Show "OWNERS" div if there are search results for 'ADMIN' role
				channelUsers.some((user) => user.userRole === 'ADMIN') && (
					<div className='flex items-center gap-1 h-7 mt-2 p-1'>
						<h1 className='text-teal-800 font-bold font-sans w-fit text-xs'>ADMINS</h1>
						<div className="w-[75%] h-1 bg-teal-800 rounded-full"></div>
					</div>
				)
			}
			{
				channelUsers
				.filter((user) => user.userRole === 'ADMIN')
				.map((admin) => (
					<UserCard key={admin.id} user={admin} />
				))
			}
			{ // Show "MEMBERS" div if there are search results for 'MEMBER' role
			channelUsers.some((user) => user.userRole === 'MEMBER') && (
					<div className='flex items-center gap-1 h-7 mt-2 p-1'>
						<h1 className='text-teal-800 font-bold font-sans w-fit text-xs'>MEMBERS</h1>
						<div className="w-[75%] h-1 bg-teal-800 rounded-full"></div>
					</div>
				)
			}
			{
				channelUsers
				.filter((user) => user.userRole === 'MEMBER')
				.map((member) => (
					<UserCard key={member.id} user={member} />
				))
			}
		</div>
	);
}
export default ChatSideBar;
