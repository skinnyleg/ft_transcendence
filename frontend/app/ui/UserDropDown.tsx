import { Menu, Transition } from '@headlessui/react'
import { FC, Fragment } from 'react'
import { IconWithTooltip } from './CustomIcons'
import { HiDotsVertical } from "react-icons/hi";
import { HiLogout } from "react-icons/hi";
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import { BiSolidEditAlt } from "react-icons/bi";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdExit } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { IoVolumeMuteSharp } from "react-icons/io5";
import { RiPingPongFill } from "react-icons/ri";
import { FaUserSlash } from "react-icons/fa";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { GiPoliceOfficerHead } from "react-icons/gi";
import { FaUserXmark } from "react-icons/fa6";
import { GiThroneKing } from "react-icons/gi";



interface UserDropDownProps {
	userRole: string | undefined;
	userCardRole: string;
}

const UserDropDown: FC<UserDropDownProps> = ({userRole, userCardRole}) => {


	const displayActions = () => {
		if (userRole === 'MEMBER')
			return (false)
		if (userRole === 'ADMIN' && (userCardRole === 'ADMIN' || userCardRole === 'OWNER'))
			return (false);
		return (true);
	}

  return (
    <div className="">
      <Menu as="div" className="relative text-left">
        <div>
          <Menu.Button className="flex w-full justify-center z-0 items-center rounded-md text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
			<IconWithTooltip
				icon={HiDotsVertical}
				styles='w-8 h-8 hover:cursor-pointer'
				tooltipId="OpenToolTip"
				tooltipContent=""
				// clickBehavior={showSideBar}
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
          <Menu.Items className="absolute z-20 right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
			<div className="px-1 py-1">
			  <Menu.Item>
				{({ active }) => (
				  <button
					className={`${
					  active ? 'bg-violet-500 text-white' : 'text-gray-900'
					} group flex w-full items-center gap-4 rounded-md px-2 py-2 text-sm`}
				  >
					<IconWithTooltip
						icon={FaUserCircle}
						styles='w-6 h-6 hover:cursor-pointer'
						tooltipId="OpenToolTip"
						tooltipContent=""
						// clickBehavior={showSideBar}
					/>
					View Profile
				  </button>
				)}
			  </Menu.Item>
			</div>
			<div className="px-1 py-1">
			  <Menu.Item>
				{({ active }) => (
				  <button
					className={`${
					  active ? 'bg-violet-500 text-white' : 'text-gray-900'
					} group flex w-full items-center gap-4 rounded-md px-2 py-2 text-sm`}
				  >
					<IconWithTooltip
						icon={RiPingPongFill}
						styles='w-6 h-6 hover:cursor-pointer'
						tooltipId="OpenToolTip"
						tooltipContent=""
						// clickBehavior={showSideBar}
					/>
					Challenge User
				  </button>
				)}
			  </Menu.Item>
			</div>
			{
				displayActions() && (
					<>
						<div className="px-1 py-1">
						  <Menu.Item>
							{({ active }) => (
							  <button
								className={`${
								  active ? 'bg-violet-500 text-white' : 'text-gray-900'
								} group flex w-full items-center gap-4 rounded-md px-2 py-2 text-sm`}
							  >
								<IconWithTooltip
									icon={IoVolumeMuteSharp}
									styles='w-6 h-6 hover:cursor-pointer'
									tooltipId="OpenToolTip"
									tooltipContent=""
									// clickBehavior={showSideBar}
								/>
								Mute User
							  </button>
							)}
						  </Menu.Item>
						</div>
						<div className="px-1 py-1">
						  <Menu.Item>
							{({ active }) => (
							  <button
								className={`${
								  active ? 'bg-violet-500 text-white' : 'text-gray-900'
								} group flex w-full items-center gap-4 rounded-md px-2 py-2 text-sm`}
							  >
								<IconWithTooltip
									icon={DeleteForeverIcon}
									styles='w-8 h-8 hover:cursor-pointer'
									tooltipId="OpenToolTip"
									tooltipContent=""
									// clickBehavior={showSideBar}
								/>
								Kick User
							  </button>
							)}
						  </Menu.Item>
						</div>
						<div className="px-1 py-1">
						  <Menu.Item>
							{({ active }) => (
							  <button
								className={`${
								  active ? 'bg-violet-500 text-white' : 'text-gray-900'
								} group flex w-full items-center ml-0 gap-4 rounded-md px-2 py-2 text-sm`}
							  >
								<IconWithTooltip
									icon={FaUserSlash}
									styles='w-6 h-6 hover:cursor-pointer'
									tooltipId="OpenToolTip"
									tooltipContent=""
									// clickBehavior={showSideBar}
								/>
								Ban User
							  </button>
							)}
						  </Menu.Item>
						</div>
						{
							(userRole === 'OWNER' && userCardRole === 'ADMIN') && (
								<div className="px-1 py-1">
								  <Menu.Item>
									{({ active }) => (
									  <button
										className={`${
										  active ? 'bg-violet-500 text-white' : 'text-gray-900'
										} group flex w-full items-center gap-4 rounded-md px-2 py-2 text-sm`}
									  >
										<IconWithTooltip
											icon={FaUserXmark}
											styles='w-6 h-6 hover:cursor-pointer'
											tooltipId="OpenToolTip"
											tooltipContent=""
											// clickBehavior={showSideBar}
										/>
										Demote
									  </button>
									)}
								  </Menu.Item>
								</div>
							)
						}
						{
							(userRole === 'OWNER' && userCardRole === 'MEMBER') && (
								<div className="px-1 py-1">
								  <Menu.Item>
									{({ active }) => (
									  <button
										className={`${
										  active ? 'bg-violet-500 text-white' : 'text-gray-900'
										} group flex w-full items-center gap-4 rounded-md px-2 py-2 text-sm`}
									  >
										<IconWithTooltip
											icon={GiPoliceOfficerHead}
											styles='w-6 h-6 hover:cursor-pointer'
											tooltipId="OpenToolTip"
											tooltipContent=""
											// clickBehavior={showSideBar}
										/>
										Promote
									  </button>
									)}
								  </Menu.Item>
								</div>
							)
						}
					</>
				)
			}
			{
				userRole === 'OWNER' && (
						<div className="px-1 py-1">
							<Menu.Item>
							{({ active }) => (
								<button
								className={`${
									active ? 'bg-violet-500 text-white' : 'text-gray-900'
								} group flex w-full items-center gap-4 rounded-md px-2 py-2 text-sm`}
								>
								<IconWithTooltip
									icon={GiThroneKing}
									styles='w-6 h-6 hover:cursor-pointer'
									tooltipId="OpenToolTip"
									tooltipContent=""
									// clickBehavior={showSideBar}
								/>
								set As Owner
								</button>
							)}
							</Menu.Item>
						</div>
				)
			}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}


export default UserDropDown;
