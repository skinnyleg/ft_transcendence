"use client"
import { useContext, type FC } from 'react';
import Image from 'next/image'
import { ChannelInter } from '../interfaces/interfaces';
import { IoMdSettings } from "react-icons/io";
import { GoSidebarExpand } from "react-icons/go";
import { IoIosArrowBack } from "react-icons/io";
import { GoSidebarCollapse } from "react-icons/go";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { IconWithTooltip } from './CustomIcons';
import { HiLogout } from "react-icons/hi";
import { HiDotsVertical } from "react-icons/hi";
import { useRouter, useSearchParams } from 'next/navigation';
import ChannelDropDown from './ChannelDropDown';
import { ChatContext } from '../context/soketContext';
import PersonalDropDown from './PersonalDropDown';


interface PersonalTopBarProps {}

const PersonalTopBar: FC<PersonalTopBarProps> = () => {

	const router = useRouter();
	const searchParams = useSearchParams()
	const {personalId, setPersonalId, personal} = useContext(ChatContext);

	const handleBack = () => {
		router.replace('/Chat');
	}
	const showSideBar = () => {
		router.replace(`/Chat?personal=${personalId}`);
	}

	return (
		<div className='bg-teal-100 text-black h-16 rounded-xl p-2 flex flex-row justify-between items-center gap-0'>
			<div className='flex gap-4 items-center justify-between'>
				<div className='flex gap-1 flex-row lg:flex-row-reverse items-center'>
					<IconWithTooltip
						icon={IoIosArrowBack}
						styles='w-8 h-8 hover:cursor-pointer block md:hidden'
						tooltipId="backToolTip"
						tooltipContent="Go Back"
						clickBehavior={handleBack}
					/>
					<div className='max-w-[45px] max-h-[45px] min-w-[45px] min-h-[45px] flex justify-center'>
						<Image
							unoptimized={process.env.ENVIRONMENT !== "PRODUCTION"}
							src={personal?.picture}
							width={45}
							height={45}
							alt='User picture'
							className='rounded-full border border-teal-600'
						/>
					</div>
				</div>
				<div className='flex flex-col'>
					<h1 className='font-bold text-lg'>{personal?.name}</h1>
					<p className='text-gray-500 hidden md:block'>{personal?.lastMsg}...</p>
				</div>
			</div>
			<div className='flex flex-row items-center justify-end gap-3 p-2 w-fit'>
					<PersonalDropDown
						key={personal?.personalId}
						userRole={personal?.status}
						userNick={personal?.name}
					/>
			</div>
		</div>
	);
}
export default PersonalTopBar;
