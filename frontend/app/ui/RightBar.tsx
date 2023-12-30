"use client"
import type { FC } from 'react';
import ChannelTab from './ChannelTab';
import PersonalTab from './PersonalTab';
import { useSearchParams } from 'next/navigation';
import { isBarOpen, isHidden } from './ChatUtils';

interface RightBarProps {}

const RightBar: FC<RightBarProps> = ({}) => {
	const searchParams = useSearchParams()

	const hidden = isHidden(searchParams)
	const sideBar = isBarOpen(searchParams)
		return (
			<div className={`h-full w-full  md:w-[50%] md:flex min-[1024px]:flex min-[1024px]:w-[50%] xl:[40%] flex justify-between flex-col
				${hidden ? 'hidden' : ''} ${sideBar ? 'md:hidden' : ''} transition duration-1000 ease-in-out`}>
				<ChannelTab />
				<PersonalTab />
			</div>
	);
}
export default RightBar;
