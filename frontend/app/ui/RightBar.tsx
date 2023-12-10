"use client"
import type { FC } from 'react';
import ChannelTab from './ChannelTab';
import PersonalTab from './PersonalTab';
import { useSearchParams } from 'next/navigation';
import { isHidden } from './ChatUtils';

interface RightBarProps {}

const RightBar: FC<RightBarProps> = ({}) => {
	const searchParams = useSearchParams()

	const hidden = isHidden(searchParams)
		return (
			<div className={`h-full w-full lg:flex lg:w-[50%] xl:[40%] flex gap-1 flex-col
				${hidden ? 'hidden' : ''} transition duration-1000 ease-in-out`}>
				<ChannelTab />
				<PersonalTab />
			</div>
	);
}
export default RightBar;
