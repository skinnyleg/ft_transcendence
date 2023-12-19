import type { FC } from 'react';
import LeaderboardCard from './LeaderboardCard';
import { Ranking } from './ChatConstants';

interface LeaderboardRankingProps {}

const LeaderboardRanking: FC<LeaderboardRankingProps> = ({}) => {
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
