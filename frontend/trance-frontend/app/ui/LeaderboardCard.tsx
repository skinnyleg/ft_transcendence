import type { FC } from 'react';
import { LeaderboardData } from '../interfaces/interfaces';
import Image from 'next/image';
import Link from 'next/link';

interface LeaderboardCardProps {
	user: LeaderboardData;
}

const LeaderboardCard: FC<LeaderboardCardProps> = ({user}) => {
		return (
			<div className={`  ${user.self === true ? 'bg-teal-800' : 'bg-teal-600'} rounded-2xl  overflow-y-auto h-fit w-full items-center justify-between flex gap-1 flex-row transition p-2 duration-1000 ease-in-out`}>
				<div className='w-1/3 md:w-1/5 '>
					<Link href={`/profile/${user.nickname}`} className='w-full  flex flex-row gap-3 items-center'>
						<div className='max-w-[35px] max-h-[35px] min-w-[35px] min-h-[35px] md:max-w-[50px] md:max-h-[50px] md:min-w-[50px] md:min-h-[50px]'>
							<img
								src={user.profilePic}
								alt='user Pic'
								className='rounded-full text-white max-w-[35px] max-h-[35px] min-w-[35px] min-h-[35px] md:max-w-[50px] md:max-h-[50px] md:min-w-[50px] md:min-h-[50px]'
							/>
						</div>
						<h1 className='flex w-fit hover:text-gray-300 transition ease-in-out duration-500 '>{user.nickname}</h1>
					</Link>
				</div>
				<h1 className='w-1/3 lg:w-1/6'>Rank: {user.Rank}</h1>
				<h1 className='hidden lg:flex lg:w-1/6'>Wins: {user.Wins}</h1>
				<h1 className='hidden lg:flex lg:w-1/6'>Losses: {user.Losses}</h1>
				<h1 className='w-1/3 md:w-1/6'>WinRate: {user.winrateStr}%</h1>
			</div> 
	);
}
export default LeaderboardCard;
