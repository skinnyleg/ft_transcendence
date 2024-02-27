"use client"
import { Dialog, Transition } from '@headlessui/react'
import { FC, Fragment, useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import ChannelTypes from './ChannelTypeSelect'
import { ChatContext, chatSocketContext } from '../context/soketContext'
import QRCode from 'qrcode.react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Lexend_Tera } from 'next/font/google'

interface Enable2FAProps {
	userPic: string;
}

const Enable2FA: FC<Enable2FAProps> = ({userPic}) => {

	let [isOpen, setIsOpen] = useState(false)
	const [Qr, setQr] = useState<string | null>(null);
	const [buttonVal, setButtonVal] = useState<string>("");
	const [isRequired, setIsRequired] = useState<boolean>(true);
	const [qrCode, setQrCode] = useState<string>("");


  function closeModal() {
	setQrCode('');
    setIsOpen(false)
  }

  function openModal() {
	IsQrEnabled();
	gnerateQrCode();
    setIsOpen(true)
  }


  const IsQrEnabled = async () => {
	try {
	  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/user/qrEnabled`, {
		method: "GET",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
	  });
	  if (res.ok) {
		  const enable = await res.json();
		  if (enable.isEnabled === true)
		  {
			  setButtonVal("Disable");
			  setIsRequired(false);
		  }
		  else
			  setButtonVal("Enable");
	  }
	} catch (error : any) {
	  toast.error(error.response.data.message, {toastId: "Error", autoClose: 1000});
	}
  };

  	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		  e.preventDefault();
		  console.log('submit action is === ', buttonVal);
		  let bool = false;
		  if (buttonVal === 'Enable')
			bool = true;
		try
		{
			const results =  await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/user/2FA`, {Enabled : bool, QrCode: qrCode}, {withCredentials : true});
			console.log('results === ', results);
			if (results.status === 201)
			{
				setButtonVal("Disable");
				closeModal();
			}
			else
				toast.error("Wrong Qr Code", {toastId: "Error", autoClose: 1000});
		}
		catch (error : any)
		{
			toast.error(error.response.data.message, {toastId: "Error", autoClose: 1000});
		}
	}

	  const gnerateQrCode = async () => {
		  console.log('generateQrCode');
		  try{
			  const results =  await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/user/GenerateQr`, {withCredentials : true});
			  console.log('results == ', results);
			if (results.status === 200){
                setQr(results.data.img)
            }
        } catch (error : any){
            toast.error(error.response.data.message, {toastId: "Error", autoClose: 1000});
        }
    }

  return (
	<>
		<button
			type="button"
			onClick={openModal}
			className="rounded-l-2xl w-[50%] bg-[#75E6DA]"
		>
			2FA
		</button>

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
							<Dialog.Panel className="w-full md:w-[50%] lg:w-[30%] xl:w-[25%] transform overflow-hidden rounded-2xl bg-[#189AB4] border-[3px] border-[#05445E] p-6 text-left align-middle shadow-xl transition-all">
								<Dialog.Title
									as="h3"
									className="text-lg font-medium leading-6 text-gray-900"
								>
									Enable Two Factor Authentification
								</Dialog.Title>
								<div className="text-black mt-2  items-center flex gap-2 flex-col">
									<div className='w-[80px] h-[80px] '>
										<Image
											src={userPic}
											width={80}
											height={80}
											alt='User Picture'
											className='rounded-full border-solid border-2 border-teal-500 max-h-[80px] max-w-[80px] min-h-[80px] min-w-[80px]'
										/>
									</div>
									<div className={`flex flex-col justify-center gap-4 items-center  w-fit`}>
										<QRCode
											size={200}
											value={Qr as string}
											className='rounded-2xl'
										/>
										<input placeholder='Enter Code'
											value={qrCode}
											onChange={(e) => {setQrCode(e.target.value)}}
											maxLength={6}
											minLength={6}
											required={isRequired}
											className={`w-full h-7 rounded-xl border-b-3 p-2 ${buttonVal === 'Enable' ? '': 'hidden'}`}
										/>
									</div>
								</div>

								<div className='flex flex-row justify-center items-center gap-2'>
									<div className="mt-4">
										<button
											type="submit"
											className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-green-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
										>
										{buttonVal}
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


export default Enable2FA;
