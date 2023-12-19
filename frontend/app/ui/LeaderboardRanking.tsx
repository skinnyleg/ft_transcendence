'use client'
import { useState, type FC } from 'react';
import LeaderboardCard from './LeaderboardCard';
import { LeaderboardData } from '../interfaces/interfaces';

interface LeaderboardRankingProps {
	Ranking: LeaderboardData[];
}

const LeaderboardRanking: FC<LeaderboardRankingProps> = ({Ranking}) => {

		return (
			<div className={`flex-grow rounded-2xl h-fit w-full  flex gap-1 flex-col transition p-2 duration-1000 ease-in-out`}>
				{
					Ranking.map((user) => {
						return (
							<LeaderboardCard
								key={user.id}
								user={user}
							/>
						);
					})
				}
			</div>
	);
}
export default LeaderboardRanking;
