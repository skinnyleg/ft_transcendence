"use client"
import { Dialog, Transition } from '@headlessui/react'
import React, { Dispatch, FC, Fragment, SetStateAction, useContext, useState } from 'react'
import { CreateChannelIcon, IconWithTooltip } from './CustomIcons'
import { Menu } from '@headlessui/react'
import { BiSolidEditAlt } from "react-icons/bi";
import { ChatContext, chatSocketContext } from '../context/soketContext'



interface ChannelPassProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const ChannelPass: FC<ChannelPassProps> = ({isOpen, setIsOpen}) => {

	const [password, setPassword] = useState<string>('')
	const [confPassword, setConfPassword] = useState<string>('')
	const chatSocket = useContext(chatSocketContext);
	const {channelId, setChannelId} = useContext(ChatContext);
	const [error, setError] = useState<string>('')

  function closeModal() {
    setIsOpen(false)
	setPassword('')
	setConfPassword('')
	setError('')
}

function openModal() {
    setIsOpen(true)
  }


  	const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (password !== confPassword)
		{
			setError('Passwords Don\'t Match');
			return ;
		}
		chatSocket.emit('changePassCH', {
			channelName: channelId,
			newPassword: password
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
									Change Channel Password
								</Dialog.Title>
								<div className="text-black mt-2 flex gap-2 flex-col">
                                    <div className="text-black w-full h-fit mt-2 flex gap-3 flex-col">
                                        <input
                                            placeholder='type Channel New Password'
                                            required
                                            maxLength={8}
                                            minLength={4}
                                            className='rounded-full w-full h-10 p-2 border-blue-300 border-2 border-solid'
											value={password}
											onChange={(e) => {
												setPassword(e.target.value);
												setError('')
											}}
											type='password'
										/>
										<input
                                            placeholder='Confirm New Password'
                                            required
											type='password'
                                            maxLength={8}
                                            minLength={4}
                                            className='rounded-full w-full h-10 p-2 border-blue-300 border-2 border-solid'
											value={confPassword}
											onChange={(e) => {
													setConfPassword(e.target.value);
													setError('');		
												}
											}
										/>
										<p className={`text-red-700 text-xs ${(password !== '' || confPassword !== '') ? 'hidden' : ''} `}>Password must contain at least 4 characters and a maximum of 8 characters</p>
										<p className={`text-red-700 text-2xl self-center  ${(error === '') ? 'hidden' : ''}`}>{error}</p>
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


export default ChannelPass;



