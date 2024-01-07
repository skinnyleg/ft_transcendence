"use client"
import React, { FC, useEffect, useState} from 'react'
import TopBar from '../ui/top'
import { LeaderboardData } from '../interfaces/interfaces'
import Leaderboard from '../ui/Leaderboard'






interface LeaderboardProps {}

const LeaderboardPage: FC<LeaderboardProps> = () => {


	const [ranking, setRanking] = useState<LeaderboardData[]>([])


	const getLeaderboard = async () => {
		let data;
		try {
				const leaderboard = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/user/Leaderboard`, {
				method: 'GET',
				credentials: 'include',
				headers:{'Content-Type': 'application/json',
				}
			});
			data = await leaderboard.json();
			setRanking(data);
		}
		catch (error)
		{
			console.log("error1 == ", error);
		}
		return data;
	}


	useEffect(() => {
		getLeaderboard();
	}, [])


	return (
		<div className='h-screen flex flex-col'>
			<TopBar />
			<div className='h-[100%]  lg:h-[92%] xl:h-[100%] mb-0 lg:mb-4 w-full flex flex-row  pt-[70px] pb-1 pr-2 pl-4 lg:pb-1 lg:pt-2'>
				<Leaderboard 
					Ranking={ranking}
				/>
			</div>
		</div>
	)


}

export default LeaderboardPage;
