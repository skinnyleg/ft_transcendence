"use client"
import { Dialog, Transition } from '@headlessui/react'
import React, { FC, Fragment, useContext, useState } from 'react'
import { CreateChannelIcon } from './CustomIcons'
import { ChatContext, chatSocketContext } from '../context/soketContext'

interface ChannelPasswordProps {}

const ChannelPassword: FC<ChannelPasswordProps> = () => {

  let [isOpen, setIsOpen] = useState(false)
  const [password, setPassword] = useState<string>('')
  const chatSocket = useContext(chatSocketContext);
  const {channelId, setChannelId} = useContext(ChatContext);
  const [error, setError] = useState<string>('')


  function closeModal() {
	setPassword('')
	setError('')
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }


  	const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();
		chatSocket.emit('joinChannel', {
			channelName: channelId,
			password: password
		})
		chatSocket.on('joinDone', () => {
			chatSocket.emit('getUserChannels');
			chatSocket.emit('getDataCH', {
				channelName: channelId,
			})
		})
		chatSocket.on('failed', (data: string) => {
			setError(data);
		})
		// closeModal();
	}


  return (
	<>
        <div className={`bg-sky-700 w-[100%] rounded-3xl h-full flex items-center justify-center hover:cursor-pointer animate-pulse`}>
        <button
            onClick={openModal}
            className='w-full h-full text-center text-xl font-bold text-teal-200 focus:outline-none'>
            Join
        </button>
        </div>

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
									Channel Password Required
								</Dialog.Title>
								<div className="text-black mt-2 flex gap-2 flex-col">
                                    <div className="text-black w-full h-fit mt-2 flex gap-2 flex-col">
                                        <input
                                            placeholder='type Channel Password'
                                            required
											type='password'
                                            maxLength={8}
                                            minLength={4}
                                            className='rounded-full w-full h-10 p-2'
											value={password}
											onChange={(e) => {
												setPassword(e.target.value);
												setError('');
											}}
                                        />
                                        <p className={`text-red-700 text-xs ${(password !== '') ? 'hidden' : ''} `}>Password must contain at least 4 characters and a maximum of 8 characters</p>
										<p className={`text-red-700 text-2xl self-center  ${(error === '') ? 'hidden' : ''}`}>{error}</p>

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


export default ChannelPassword;



