"use client"
import { Dialog, Transition } from '@headlessui/react'
import React, { Dispatch, FC, Fragment, SetStateAction, useContext, useEffect, useState } from 'react'
import { CreateChannelIcon, IconWithTooltip } from './CustomIcons'
import { Menu } from '@headlessui/react'
import { BiSolidEditAlt } from "react-icons/bi";
import ChannelTypes from './ChannelTypeSelect'
import { chatSocketContext } from '../context/soketContext'
import { ChatContext } from '../Chat/page'
import { setDefaultAutoSelectFamily } from 'net'



interface ChannelTypeProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
	currentType: string | undefined;
}

const ChannelType: FC<ChannelTypeProps> = ({isOpen, setIsOpen, currentType}) => {

	let [type, setType] = useState(currentType)
	const [isRequired, setIsRequired] = useState<boolean>(false)
	const [password, setPassword] = useState<string>('')
	const [confPassword, setConfPassword] = useState<string>('')
	const chatSocket = useContext(chatSocketContext);
	const {channelId, setChannelId} = useContext(ChatContext);
	const [error, setError] = useState<string>('')

	const handleTypeChange = (type: string) => {
		console.log("type is ", type);
		setType(type);
	}

  function closeModal() {
    console.log("closing")
	setType(currentType)
	setError('');
    setIsOpen(false)
	setPassword('')
	setConfPassword('')
}

function openModal() {
    console.log("opening")
    setIsOpen(true)
	setPassword('')
	setConfPassword('')
  }

  useEffect(() => {
		if (currentType !== 'protected' && type === 'protected')
			setIsRequired(true);
		else
			setIsRequired(false);

  }, [type])


  	const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (password !== confPassword)
		{
			setError('Passwords Don\'t Match');
			return ;
		}
		if (type === 'protected')
		{
			chatSocket.emit('changeTypeCH', {
				channelName: channelId,
				newType: type.toUpperCase(),
				password: password,
			})
		}
		else
		{
			chatSocket.emit('changeTypeCH', {
				channelName: channelId,
				newType: type?.toUpperCase()
			})
		}
		chatSocket.on('changeDone', () => {
			chatSocket.emit('getDataCH', {
				channelName: channelId,
			})
		})
		setIsOpen(false)
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
									Change Channel Type
								</Dialog.Title>
								<div className="text-black mt-2 flex gap-2 flex-col">
									<div className='w-full h-fit'>
										<ChannelTypes
											handleTypeChange={handleTypeChange}
											currentType={currentType}
										/>
									</div>
									{
										((currentType !== 'protected' && type === 'protected')) && (
											<div className="text-black mt-2 flex gap-2 flex-col">
												<div className="text-black w-full h-fit mt-2 flex gap-3 flex-col">
													<input
														placeholder='type Channel New Password'
														type='password'
														required={isRequired}
														maxLength={8}
														minLength={4}
														className='rounded-full w-full h-10 p-2 border-blue-300 border-2 border-solid'
														onChange={(e) => setPassword(e.target.value)}
														value={password}
														/>
													<input
														placeholder='Confirm New Password'
														type='password'
														required={isRequired}
														maxLength={8}
														minLength={4}
														className='rounded-full w-full h-10 p-2 border-blue-300 border-2 border-solid'
														onChange={(e) => setConfPassword(e.target.value)}
														value={confPassword}
													/>
													<p className={`text-red-700 text-xs ${(password !== '' || confPassword !== '') ? 'hidden' : ''} `}>Password must contain at least 4 characters and a maximum of 8 characters</p>
													<p className={`text-red-700 text-2xl self-center  ${error === '' ? 'hidden' : ''}`}>{error}</p>
												</div>
											</div>
										)
									}
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


export default ChannelType;



