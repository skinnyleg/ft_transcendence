"use client"
import type { FC } from 'react';
import Image from 'next/image'
import { ChannelInter } from '../interfaces/interfaces';
import { IoMdSettings } from "react-icons/io";
import { GoSidebarExpand } from "react-icons/go";
import { IoIosArrowBack } from "react-icons/io";
import { GoSidebarCollapse } from "react-icons/go";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { IconWithTooltip } from './CustomIcons';
import { useRouter, useSearchParams } from 'next/navigation';


interface ChatTopBarProps {
	channel: ChannelInter;
}

const ChatTopBar: FC<ChatTopBarProps> = ({channel}) => {

	const router = useRouter();
	const searchParams = useSearchParams()

	const handleBack = () => {
		router.replace('/Chat');
	}
	const showSideBar = () => {
		const channelId = searchParams.get('channel');
		router.replace(`/Chat?channel=${channelId}&bar=open`);
	}

	return (
		<div className='bg-teal-100 text-black h-16 rounded-xl p-2 flex flex-row justify-between items-center gap-0'>
			<div className='flex gap-4 items-center justify-between'>
				<div className='flex gap-1 flex-row lg:flex-row-reverse items-center'>
					<IconWithTooltip
						icon={IoIosArrowBack}
						styles='w-8 h-8 hover:cursor-pointer block lg:hidden'
						tooltipId="backToolTip"
						tooltipContent="Go Back"
						clickBehavior={handleBack}
					/>
					<Image
						src={channel.channelPic}
						width={45}
						height={45}
						alt='channel picture'
						className='rounded-full border border-teal-600'
					/>
				</div>
				<div className='flex flex-col'>
					<h1 className='font-bold text-lg'>{channel?.channelName}</h1>
					<p className='text-gray-500'>{channel?.channelName}</p>
				</div>
			</div>
			{
				channel.isJoined === true && (
					<div className='flex flex-row items-center justify-end gap-3 p-2 w-36'>
						{
							channel.userRole === 'OWNER' && (
								<IconWithTooltip
									icon={IoMdSettings}
									styles='w-8 h-8 hover:cursor-pointer'
									tooltipId="settingsToolTip"
									tooltipContent="Channel Settings"
								/>
							)
						}
						<IconWithTooltip
							icon={GoSidebarExpand}
							styles='w-8 h-8 hover:cursor-pointer lg:hidden'
							tooltipId="OpenToolTip"
							tooltipContent="See Members"
							clickBehavior={showSideBar}
						/>
						<IconWithTooltip
							icon={RiLogoutCircleRLine}
							styles='w-8 h-8 hover:cursor-pointer'
						tooltipContent="Leave Channel"
							tooltipId="OpenToolTip"
						/>
					</div>
				)
			}
		</div>
	);
}
export default ChatTopBar;
