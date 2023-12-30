import type { FC } from 'react';
import { LeaderboardData } from '../interfaces/interfaces';
import Image from 'next/image';
import Link from 'next/link';

interface LeaderboardCardProps {
	user: LeaderboardData;
}

const LeaderboardCard: FC<LeaderboardCardProps> = ({user}) => {
		return (
			<div className={`bg-teal-600 ${user.self === true ? 'bg-teal-800' : 'bg-teal-600'} rounded-2xl overflow-y-auto h-fit w-full items-center justify-between flex gap-1 flex-row transition p-2 duration-1000 ease-in-out`}>
				<div className='w-1/5'>
					<Link href={`/profile/${user.nickname}`} className='w-[50%]  flex flex-row justify-between items-center'>
						<Image
							src={user.profilePic}
							width={50}
							height={50}
							alt='user Pic'
							className='rounded-full text-white'
						/>
						<h1 className='flex w-1/6 hover:text-gray-300 transition ease-in-out duration-500'>{user.nickname}</h1>
					</Link>
				</div>
				<h1 className='lg:w-1/6'>Rank: {user.Rank}</h1>
				<h1 className='hidden lg:flex lg:w-1/6'>Wins: {user.Wins}</h1>
				<h1 className='hidden lg:flex lg:w-1/6'>Losses: {user.Losses}</h1>
				<h1>WinRate: {user.winrate}%</h1>
			</div> 
	);
}
export default LeaderboardCard;
