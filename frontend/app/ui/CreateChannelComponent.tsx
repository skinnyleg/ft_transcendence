"use client"
import { Dialog, Transition } from '@headlessui/react'
import { FC, Fragment, useState } from 'react'
import { CreateChannelIcon } from './CustomIcons'
import Image from 'next/image'
import ChannelTypes from './ChannelTypeSelect'

interface CreateChannelProps {}

const CreateChannel: FC<CreateChannelProps> = () => {

  let [isOpen, setIsOpen] = useState(false)
  let [img, setImg] = useState('/GroupChat.png')
  let [type, setType] = useState('public')

  function closeModal() {
	setType('public')
	setImg('/GroupChat.png')
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }
  const handleTypeChange = (type: string) => {
	console.log("type is ", type);
	setType(type);
  }

  	const handleSubmit = (e) => {
		e.preventDefault();
		closeModal();
	}
  const updateImg = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile)
			setImg(URL.createObjectURL(selectedFile))
  };

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
			<Dialog as="form" className="relative z-30" onClose={closeModal}>
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
							<Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
								<Dialog.Title
									as="h3"
									className="text-lg font-medium leading-6 text-gray-900"
								>
									Create Channel
								</Dialog.Title>
								<div className="text-black mt-2 flex gap-2 flex-col">
									<div className='flex flex-row gap-3 items-end p-3'>
										<div className='w-[80px] h-[80px] '>
											<Image
												src={img}
												width={80}
												height={80}
												alt='Channel Picture'
												className='rounded-full border-solid border-2 border-teal-500 max-h-[80px] max-w-[80px] min-h-[80px] min-w-[80px]'
											/>
										</div>
										<label className="border bg-cyan-400 rounded-2xl cursor-pointer w-32 h-fit mb-2 text-center">
										<input
											type="file"
											accept="image/*"
											className="hidden"
											onChange={(e) => updateImg(e)}
										/>
										Upload Image
										</label>
									</div>
									<h1 className='text-bold text-lg text-blue-900'>Name</h1>
									<input placeholder='Channel Name'
										type='text'
										className='rounded-2xl border-solid border-teal-200 focus:border-teal-500'
										maxLength={10}
										required
									/>
									<div className='w-full h-fit'>
										<h1 className='text-bold text-lg text-blue-900'>Type</h1>
										<ChannelTypes 
											handleTypeChange={handleTypeChange}
											currentType='public'
										/>
									</div>

									<div className={`w-full h-fit ${type === 'protected' ? '': 'hidden'}`}>
										<h1 className={`text-bold text-lg text-blue-900`}>Password</h1>
										<input placeholder='Channel Password'
											type='password'
											className='rounded-2xl w-full border-solid border-teal-200 focus:border-teal-500'
											required
										/>
									</div>
								</div>

								<div className='flex flex-row justify-end items-center gap-2'>
									<div className="mt-4">
										<button
											type="submit"
											className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-green-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
											onClick={handleSubmit}
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
