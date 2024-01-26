"use client"
import { Menu, Transition } from '@headlessui/react'
import { FC, Fragment, useContext, useState } from 'react'
import { IconWithTooltip } from './CustomIcons'
import { HiDotsVertical } from "react-icons/hi";
import { HiLogout } from "react-icons/hi";
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import { BiSolidEditAlt } from "react-icons/bi";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdExit } from "react-icons/io";
import ChannelName from './ChangeChannelName';
import ChannelPic from './ChangeChannelPic';
import ChannelPass from './ChangeChannelPass';
import ChannelType from './ChangeChannelType';
import { ChatContext, socketContext } from '../context/soketContext';
import { chatSocketContext } from '../context/soketContext';
import { useRouter } from 'next/navigation';
import { FaUserCircle } from "react-icons/fa";
import { RiPingPongFill } from "react-icons/ri";
import { ImBlocked } from "react-icons/im";
import { TbLockOpen } from "react-icons/tb";
import { gameSocketContext } from '../context/gameSockets';


interface PersonalDropDownProps {
	userRole: string | undefined;
	userNick: string | undefined;
}

const PersonalDropDown: FC<PersonalDropDownProps> = ({userRole, userNick}) => {

	let [openName, setOpenName] = useState(false)
	let [openPic, setOpenPic] = useState(false)
	let [openPass, setOpenPass] = useState(false)
	let [openType, setOpenType] = useState(false)
    const gameSocket = useContext(gameSocketContext)
	const chatSocket = useContext(chatSocketContext);
	const {personalId, setPersonalId ,personal} = useContext(ChatContext);
	const [error, setError] = useState<string>('')
	const socket = useContext(socketContext);

	const router = useRouter();

	const challenge_friend = (friend_id: string) => {
        gameSocket.emit('challengeFriend', {userId: friend_id})
    }


	const viewProfile = () => {
		router.push(`/profile/${userNick}`)
	}

	const BlockUser = () => {
		socket.emit('block-friend', {
			userId: personal.reciverId
		})
	}
	
	const UnblockUser = () => {
		socket.emit('unblock-friend', {
			userId: personal.reciverId
		})
	}

  return (
    <div className="z-10">
      <Menu as="div" className="relative text-left">
        <div>
          <Menu.Button className="flex w-full justify-center rounded-md items-center text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
			<IconWithTooltip
				icon={HiDotsVertical}
				styles='w-8 h-8 hover:cursor-pointer'
				tooltipId="OpenToolTip"
				tooltipContent=""
			/>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
		  	<div className="px-1 py-1" onClick={() => setOpenName(true)}>
				<Menu.Item>
				{({ active }) => (
					<button
					onClick={viewProfile}
					className={`${
						active ? 'bg-violet-500 text-white' : 'text-gray-900'
					} group flex w-full items-center gap-4 rounded-md px-2 py-2 text-sm`}
					>
					<IconWithTooltip
						icon={FaUserCircle}
						styles='w-6 h-6 hover:cursor-pointer'
						tooltipId="OpenToolTip"
						tooltipContent=""
					/>
					View Profile
					</button>
				)}
				</Menu.Item>
			</div>
			{
				userRole === 'BLOCKED' && (
						<div className="px-1 py-1" onClick={() => setOpenName(true)}>
							<Menu.Item>
							{({ active }) => (
								<button
								onClick={UnblockUser}
								className={`${
									active ? 'bg-violet-500 text-white' : 'text-gray-900'
								} group flex w-full items-center gap-4 rounded-md px-2 py-2 text-sm`}
								>
								<IconWithTooltip
									icon={TbLockOpen}
									styles='w-6 h-6 hover:cursor-pointer'
									tooltipId="OpenToolTip"
									tooltipContent=""
								/>
								Unblock User
								</button>
							)}
							</Menu.Item>
						</div>
				)
			}
			{
				userRole === 'ACTIVE' && (
					<>
							<div className="px-1 py-1" onClick={() => setOpenName(true)}>
							<Menu.Item>
							{({ active }) => (
								<button
								onClick={() => challenge_friend(personal.reciverId)}
								className={`${
									active ? 'bg-violet-500 text-white' : 'text-gray-900'
								} group flex w-full items-center gap-4 rounded-md px-2 py-2 text-sm`}
								>
								<IconWithTooltip
									icon={RiPingPongFill}
									styles='w-6 h-6 hover:cursor-pointer'
									tooltipId="OpenToolTip"
									tooltipContent=""
								/>
								Challenge User
								</button>
							)}
							</Menu.Item>
						</div>
						<div className="px-1 py-1" onClick={() => setOpenName(true)}>
							<Menu.Item>
							{({ active }) => (
								<button
								onClick={BlockUser}
								className={`${
									active ? 'bg-violet-500 text-white' : 'text-gray-900'
								} group flex w-full items-center gap-4 rounded-md px-2 py-2 text-sm`}
								>
								<IconWithTooltip
									icon={ImBlocked}
									styles='w-6 h-6 hover:cursor-pointer'
									tooltipId="OpenToolTip"
									tooltipContent=""
								/>
								Block User
								</button>
							)}
							</Menu.Item>
						</div>
					</>
				)
			}

          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}


export default PersonalDropDown;
