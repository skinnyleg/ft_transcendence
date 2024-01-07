"use client"
import type { FC } from 'react';
import ChannelTab from './ChannelTab';
import PersonalTab from './PersonalTab';
import { useSearchParams } from 'next/navigation';
import { isBarOpen, isHidden, whichTab } from './ChatUtils';

interface RightBarProps {}

const RightBar: FC<RightBarProps> = ({}) => {
	const searchParams = useSearchParams()

	const hidden = isHidden(searchParams)
	const which = whichTab(searchParams)
	const sideBar = isBarOpen(searchParams)
	// <div className={`h-full w-full  md:w-full md:flex lg:flex  lg:w-[21.74%] flex justify-between flex-col
	// 	${hidden ? 'hidden' : ''} ${sideBar ? 'md:hidden' : ''} transition duration-1000 ease-in-out`}>
	return (
			<div className={`h-full w-full  md:w-full md:flex lg:flex ${which === 'personal' ? 'lg:w-[36.65%] xl:w-[39.3%]' : 'lg:w-[55%]'} flex justify-between flex-col
				${hidden ? 'hidden' : ''} ${sideBar ? 'md:hidden' : ''} transition duration-1000 ease-in-out`}>
				<ChannelTab />
				<PersonalTab />
			</div>
	);
}
export default RightBar;
