"use client"
import { Dialog, Transition } from '@headlessui/react'
import React, { Dispatch, FC, Fragment, SetStateAction, useContext, useState } from 'react'
import { CreateChannelIcon, IconWithTooltip } from './CustomIcons'
import { Menu } from '@headlessui/react'
import { BiSolidEditAlt } from "react-icons/bi";
import ChannelTypes from './ChannelTypeSelect'
import MuteOptions from './MuteOptions'
import { ChatContext, chatSocketContext } from '../context/soketContext'


const types = [
	{ type: '10s' },
	{ type: '1min' },
	{ type: '15min' },
	{ type: '1h' },
]

const time = [
	10,
	60,
	900,
	3600
]


interface MuteUserProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
	userNick: string;
	userId: string;
}

const MuteUser: FC<MuteUserProps> = ({isOpen, setIsOpen, userNick, userId}) => {

	let [type, setType] = useState(types[0].type)
	const chatSocket = useContext(chatSocketContext);
	const {channelId} = useContext(ChatContext);

	const handleTypeChange = (type: string) => {
		// console.log("type is ", type);
		setType(type);
	}

  function closeModal() {
    // console.log("closing")
    setIsOpen(false)
}

function openModal() {
    // console.log("opening")
    setIsOpen(true)
  }


  	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		  // console.log('muteType == ', type);
		e.preventDefault();
		let index = types.findIndex((item) => item.type === type);
		if (index === -1 && types[0].type === type)
			index = 0;

		// console.log('type index == ', time[index]);

		chatSocket.emit('muteUser', {
			channelName: channelId,
			user2muteId: userId,
			expirationTime: time[index]
		})
		closeModal();
	}


  return (
	<>
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="form" className="relative z-30" onClose={closeModal} onSubmit={handleSubmit}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black/25" />
				</Transition.Child>

				<div className="fixed inset-0  lg:left-20 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
								<Dialog.Title
									as="h3"
									className="text-lg font-medium leading-6 text-gray-900"
								>
									Mute User Options
								</Dialog.Title>
								<div className="text-black mt-2 flex gap-2 flex-col">
									<div className='w-full h-fit'>
										<MuteOptions
											handleTypeChange={handleTypeChange}
										/>
									</div>
								</div>

								<div className='flex flex-row justify-end items-center gap-2'>
									<div className="mt-4">
										<button
											type="submit"
											className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-green-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
											// onClick={handleSubmit}
										>
										Submit
										</button>
									</div>
									<div className="mt-4">
										<button
											type="button"
											className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
											onClick={closeModal}
										>
										Cancel
										</button>
									</div>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	</>
  )
}


export default MuteUser;



