"use client"
import type { FC } from 'react';
import ChannelTab from './ChannelTab';
import PersonalTab from './PersonalTab';
import { useSearchParams } from 'next/navigation';

interface RightBarProps {}

const RightBar: FC<RightBarProps> = ({}) => {
	const searchParams = useSearchParams()
	const isHidden = () => {
		if (searchParams.has('channel') && searchParams.has('personal'))
			return false;
		if (searchParams.has('channel') && searchParams.get('channel') !== '')
			return true
		if (searchParams.has('personal') && searchParams.get('personal') !== '')
			return true
		return (false);
	}

		return (
			<div className={`h-full w-full lg:flex lg:w-[50%] xl:[40%] flex gap-1 flex-col
				${isHidden() ? 'hidden' : ''} transition duration-1000 ease-in-out`}>
				<ChannelTab />
				<PersonalTab />
			</div>
	);
}
export default RightBar;
