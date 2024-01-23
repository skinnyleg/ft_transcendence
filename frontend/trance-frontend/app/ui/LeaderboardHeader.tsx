import type { FC } from 'react';

interface LeaderboardHeaderProps {}

const LeaderboardHeader: FC<LeaderboardHeaderProps> = ({}) => {
		return (
			<div className={`border-b-4 border-solid border-sky-300 h-fit w-full  flex gap-1 border- flex-col transition p-2 duration-1000 ease-in-out`}>
				<h1 className='text-2xl text-bold text-teal-200 self-center'>LEADERBOARD</h1>
			</div>
	);
}
export default LeaderboardHeader;
