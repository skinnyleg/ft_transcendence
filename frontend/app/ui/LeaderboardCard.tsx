import type { FC } from 'react';
import { LeaderboardData } from '../interfaces/interfaces';
import Image from 'next/image';

interface LeaderboardCardProps {
	user: LeaderboardData;
}

const LeaderboardCard: FC<LeaderboardCardProps> = ({user}) => {
		return (
			<div className={`bg-teal-600 ${user.self === true ? 'bg-teal-800 animate-pulse' : 'bg-teal-600'} rounded-2xl overflow-y-auto h-fit w-full items-center justify-between flex gap-1 flex-row transition p-2 duration-1000 ease-in-out`}>
				<div>
					<Image
						src={user.profilePic}
						width={50}
						height={50}
						alt='user Pic'
					/>
				</div>
				<h1 className='hidden lg:flex'>{user.nickname}</h1>
				<h1>Rank: {user.Rank}</h1>
				<h1 className='hidden lg:flex'>Wins: {user.Wins}</h1>
				<h1 className='hidden lg:flex'>Losses: {user.Losses}</h1>
				<h1>WinRate: {user.winrate}%</h1>
			</div> 
	);
}
export default LeaderboardCard;
