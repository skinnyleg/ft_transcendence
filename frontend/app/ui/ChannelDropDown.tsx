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
import { ChatContext } from '../context/soketContext';
import { chatSocketContext } from '../context/soketContext';


interface ChannelDropDownProps {
	userRole: string | undefined;
	showSideBar: () => void;
	channelType: string | undefined;
	channelPic: string | undefined;
}

const ChannelDropDown: FC<ChannelDropDownProps> = ({userRole, showSideBar, channelType, channelPic}) => {

	let [openName, setOpenName] = useState(false)
	let [openPic, setOpenPic] = useState(false)
	let [openPass, setOpenPass] = useState(false)
	let [openType, setOpenType] = useState(false)
	const chatSocket = useContext(chatSocketContext);
	const {channelId, setChannelId} = useContext(ChatContext);
	const [error, setError] = useState<string>('')

	const leaveChannel = () => {
		chatSocket.emit('leaveChannel', {
			channelName: channelId
		})
	}

  return (
    <div className="z-10">
		<ChannelName
			isOpen={openName}
			setIsOpen={setOpenName}
		/>
		<ChannelPic
			isOpen={openPic}
			setIsOpen={setOpenPic}
			currentPic={channelPic}
		/>
		<ChannelPass
			isOpen={openPass}
			setIsOpen={setOpenPass}
		/>
		<ChannelType
			isOpen={openType}
			setIsOpen={setOpenType}
			currentType={channelType?.toLowerCase()}
		/>
      <Menu as="div" className="relative text-left">
        <div>
          <Menu.Button className="flex w-full justify-center rounded-md items-center text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
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
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
			{
				userRole === 'OWNER' && (
					<>
						<div className="px-1 py-1" onClick={() => setOpenName(true)}>
							<Menu.Item>
							{({ active }) => (
								<button
								className={`${
									active ? 'bg-violet-500 text-white' : 'text-gray-900'
								} group flex w-full items-center gap-4 rounded-md px-2 py-2 text-sm`}
								>
								<IconWithTooltip
									icon={BiSolidEditAlt}
									styles='w-6 h-6 hover:cursor-pointer'
									tooltipId="OpenToolTip"
									tooltipContent=""
									// clickBehavior={showSideBar}
								/>
								Change Name
								</button>
							)}
							</Menu.Item>
						</div>
						<div className="px-1 py-1" onClick={() => setOpenPic(true)}>
						  <Menu.Item>
							{({ active }) => (
							  <button
								className={`${
								  active ? 'bg-violet-500 text-white' : 'text-gray-900'
								} group flex w-full items-center gap-4 rounded-md px-2 py-2 text-sm`}
							  >
								<IconWithTooltip
									icon={AddPhotoAlternateRoundedIcon}
									styles='w-8 h-8 hover:cursor-pointer'
									tooltipId="OpenToolTip"
									tooltipContent=""
									// clickBehavior={showSideBar}
								/>
								Change Picture
							  </button>
							)}
						  </Menu.Item>
						</div>
						<div className="px-1 py-1" onClick={() => setOpenType(true)}>
						  <Menu.Item>
							{({ active }) => (
							  <button
								className={`${
								  active ? 'bg-violet-500 text-white' : 'text-gray-900'
								} group flex w-full items-center ml-0 gap-4 rounded-md px-2 py-2 text-sm`}
							  >
								<IconWithTooltip
									icon={ChangeCircleIcon}
									styles='w-8 h-8 hover:cursor-pointer'
									tooltipId="OpenToolTip"
									tooltipContent=""
									// clickBehavior={showSideBar}
								/>
								Change Type
							  </button>
							)}
						  </Menu.Item>
						</div>
						{
							channelType === 'PROTECTED' && (
									<div className="px-1 py-1" onClick={() => setOpenPass(true)}>
									  <Menu.Item>
										{({ active }) => (
										  <button
											className={`${
											  active ? 'bg-violet-500 text-white' : 'text-gray-900'
											} group flex w-full items-center gap-4 rounded-md px-2 py-2 text-sm`}
										  >
											<IconWithTooltip
												icon={RiLockPasswordFill}
												styles='w-6 h-6 hover:cursor-pointer'
												tooltipId="OpenToolTip"
												tooltipContent=""
												// clickBehavior={showSideBar}
											/>
											Change Password
										  </button>
										)}
									  </Menu.Item>
									</div>
							)
						}
					</>
				)
			}
            <div className="px-1 py-1 lg:hidden">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-violet-500 text-white' : 'text-gray-900'
                    } group flex w-full items-center gap-4 rounded-md px-2 py-2 text-sm`}
					onClick={showSideBar}
                  >
					<IconWithTooltip
						icon={HiLogout}
						styles='w-7 h-6 hover:cursor-pointer '
						tooltipId="OpenToolTip"
						tooltipContent=""
						// clickBehavior={showSideBar}
					/>
                    See Members
                  </button>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
					onClick={leaveChannel}
                    className={`${
                      active ? 'bg-violet-500 text-white' : 'text-gray-900'
                    } group flex w-full items-center gap-4 rounded-md px-2 py-2 text-sm`}
                  >
					<IconWithTooltip
						icon={IoMdExit}
						styles='w-6 h-6 hover:cursor-pointer'
						tooltipContent=""
						tooltipId="OpenToolTip"
					/>
                    Leave channel
                  </button>
                )}
              </Menu.Item>
			</div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}


export default ChannelDropDown;
