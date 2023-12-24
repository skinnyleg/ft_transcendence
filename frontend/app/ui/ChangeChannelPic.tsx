"use client"
import { Dialog, Transition } from '@headlessui/react'
import { Dispatch, FC, Fragment, SetStateAction, useContext, useState } from 'react'
import { CreateChannelIcon, IconWithTooltip } from './CustomIcons'
import { Menu } from '@headlessui/react'
import { BiSolidEditAlt } from "react-icons/bi";
import Image from 'next/image'
import { chatSocketContext } from '../context/soketContext'
import { ChatContext } from '../Chat/page'



interface ChannelPicProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
	currentPic: string | undefined;
}

const ChannelPic: FC<ChannelPicProps> = ({isOpen, setIsOpen, currentPic}) => {

	let [img, setImg] = useState(currentPic)
	const chatSocket = useContext(chatSocketContext);
	const {channelId, setChannelId} = useContext(ChatContext);
	const [imgData, setImgData] = useState<File | undefined>(undefined);



  function closeModal() {
    console.log("closing")
    setIsOpen(false)
}

function openModal() {
    console.log("opening")
    setIsOpen(true)
  }


  	const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();
		chatSocket.emit('changePicCH', {
			channelName: channelId,
			newPicture: img
		})
		chatSocket.on('allowPicture', async () => {
			if (imgData) {
				const formData = new FormData();
				formData.append("file", imgData);
				try {
					const url = process.env.NEXT_PUBLIC_BACKEND_URL;
					console.log('url == ', url);
	
					const results = await fetch(`${url}/upload/ChannelPic`, {
						credentials: 'include',
						method: 'POST',
						headers: {
							'channelname': channelId,
						},
						body: formData,
					})
					if (results) {
					}
					else {
						console.log("error")
					}
				}
				catch (error : any) {
					console.log("error from catch == ", error)
				}
			}
			chatSocket.emit('refreshPicture', {
				channelName: channelId
			});
			chatSocket.on('PicDone', () => {
				chatSocket.emit('getUserChannels')
				chatSocket.emit('getDataCH', {
					channelName: channelId,
				})
			})
		})
		closeModal();
	}

	const updateImg = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile)
		{
			setImgData(selectedFile);
			setImg(URL.createObjectURL(selectedFile))
		}
  };

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
									Change Channel Picture
								</Dialog.Title>
								<div className="text-black mt-2 flex gap-2 flex-col">
									<div className='flex flex-row gap-3 items-end p-3'>
										<div className='w-[80px] h-[80px] '>
											<Image
												src={img as string}
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
											onClick={() => {
												setImg(currentPic);
												closeModal()
											}}
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


export default ChannelPic;



