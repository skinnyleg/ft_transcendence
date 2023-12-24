"use client"
import { Dialog, Transition } from '@headlessui/react'
import React, { Dispatch, FC, Fragment, SetStateAction, useContext, useState } from 'react'
import { CreateChannelIcon, IconWithTooltip } from './CustomIcons'
import { Menu } from '@headlessui/react'
import { BiSolidEditAlt } from "react-icons/bi";
import { chatSocketContext } from '../context/soketContext'
import { getChannelName } from './ChatUtils'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChatContext } from '../Chat/page'



interface ChannelNameProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const ChannelName: FC<ChannelNameProps> = ({isOpen, setIsOpen}) => {

	const [name, setName] = useState<string>('');
	const searchParams = useSearchParams();
	const router = useRouter();
	const chatSocket = useContext(chatSocketContext);
	const {channelId, setChannelId} = useContext(ChatContext);

  function closeModal() {
	setName('');
    setIsOpen(false)
}

function openModal() {
    setIsOpen(true)
  }


  const setChannelQuery = (newName: string) => {
	  router.replace(`/Chat?channel=${newName}`);
  }


  	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		chatSocket.emit('changeNameCH', {
			channelName: channelId,
			newName: name,
		})
		setChannelId(name);
		// setChannelQuery(name)
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
									Change Channel Name
								</Dialog.Title>
								<div className="text-black mt-2 flex gap-2 flex-col">
                                    <div className="text-black w-full h-fit mt-2 flex gap-2 flex-col">
                                        <input
                                            placeholder='type Channel New Name'
                                            required={true}
                                            maxLength={10}
                                            minLength={4}
                                            className='rounded-full w-full border-blue-300 border-2 border-solid h-10 p-2'
											onChange={(e) => setName(e.target.value)}
											value={name}
										/>
                                    </div>
								</div>

								<div className='flex flex-row justify-end items-center gap-2'>
									<div className="mt-4">
										<button
											type="submit"
											className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-green-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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


export default ChannelName;



