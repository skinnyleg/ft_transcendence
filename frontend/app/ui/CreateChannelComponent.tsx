"use client"
import { Dialog, Transition } from '@headlessui/react'
import { FC, Fragment, useState } from 'react'
import { CreateChannelIcon } from './CustomIcons'

interface CreateChannelProps {}

const CreateChannel: FC<CreateChannelProps> = () => {

  let [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

	{/* <div className="fixed inset-0 flex items-center justify-center"> */}
      // </div>
  return (
	<>
		<button
			type="button"
			onClick={openModal}
			className="text-black bg-teal-200 text-center w-1/6 rounded-e-xl"
		>
			<CreateChannelIcon
			style='w-full h-6 focus:ring-0 focus:outline-none'
			/>
		</button>

		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={closeModal}>
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

				<div className="fixed inset-0 overflow-y-auto">
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
							<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
								<Dialog.Title
									as="h3"
									className="text-lg font-medium leading-6 text-gray-900"
								>
									Create Channel
								</Dialog.Title>
								<div className="text-black mt-2 flex flex-col">
									<h1>Name</h1>
									<input placeholder='Channel Name'
											type='text'
											className=''
									/>
									<h1>Type</h1>
									<input placeholder='Channel Type'
											type='text'
											className=''
									/>

									<h1>Password</h1>
									<input placeholder='Channel Password'
											type='password'
											className=''
									/>
									<input
									type="file"
									accept="image/*"
									className=""
									/>
									<button 
									className=""
									>
										Upload Image
									</button>
								</div>

								<div className='flex flex-row justify-end items-center gap-2'>
									<div className="mt-4">
										<button
											type="button"
											className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-green-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
											onClick={closeModal}
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


export default CreateChannel;
