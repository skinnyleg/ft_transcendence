"use client"
import { useState, type FC, useEffect } from 'react';
import LeaderboardHeader from './LeaderboardHeader';
import LeaderboardRanking from './LeaderboardRanking';
import { LeaderboardData } from '../interfaces/interfaces';

interface LeaderboardProps {
    Ranking: LeaderboardData[];
}

const Leaderboard: FC<LeaderboardProps> = ({Ranking}) => {
    
    return (
			<div className={`h-full w-full m-auto p-2 lg:flex lg:w-[75%] xl:[40%] flex gap-1 flex-col transition duration-1000 ease-in-out bg-teal-400 rounded-2xl`}>
                <LeaderboardHeader />
                <div className='overflow-y-auto w-full flex flex-grow'>
                    <LeaderboardRanking
                        Ranking={Ranking}
                    />
                </div>
			</div>
	);
}
export default Leaderboard;
