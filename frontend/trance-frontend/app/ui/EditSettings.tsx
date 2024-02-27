"use client"
import { Dialog, Transition } from '@headlessui/react'
import { Dispatch, FC, Fragment, SetStateAction, useContext, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import addCircle from '../../public/add-circle-line.svg'
import uploadBack from '../../public/addImage.svg'
import editName from '../../public/edit-2-line_24.svg'
import eyeIcon from '../../public/eye.svg'
import axios from 'axios'
import { toast } from 'react-toastify'
import { picturesContext } from '../context/profilePicContext'
import { usePathname, useRouter } from 'next/navigation'

interface EditSettingsProps {
	userPic: string | undefined;
	backPic: string | undefined;
	nick: string | undefined;
	setUserNickname: Dispatch<SetStateAction<string | undefined>>;
	setUserProfilePic: Dispatch<SetStateAction<string | undefined>>;
	setUserBackPic: Dispatch<SetStateAction<string | undefined>>;
}

const EditSettings: FC<EditSettingsProps> = ({userPic, backPic, nick, setUserNickname, setUserProfilePic, setUserBackPic}) => {

	let [isOpen, setIsOpen] = useState(false)
	const [nickname, setNickname] = useState<string | undefined>(nick);
	const [password, setPassword] = useState<string>("");
	const [backImgData, setBackImgData] = useState<File | undefined>(undefined);
	const [userImgData, setUserImgData] = useState<File | undefined>(undefined);
	let [backImg, setBackImg] = useState(backPic)
	let [userImg, setUserImg] = useState(userPic)
    const fileRef = useRef<HTMLInputElement>(null);
    const avatarRef = useRef<HTMLInputElement>(null);
	const router = useRouter();
	const [reveal, setReveal] = useState<boolean>(false);
	const [viewPass, setViewPass] = useState<string>('password');

  function closeModal() {
	setIsOpen(false)
	setBackImgData(undefined);
	setUserImgData(undefined);
	setNickname(nick);
	setBackImg(backPic);
	setUserImg(userPic);
	setPassword('');
  }

  function openModal() {
	setNickname(nick);
	setBackImg(backPic);
	setUserImg(userPic);
    setIsOpen(true)
  }

  const handleAvatarChange = async () => {
	if (userImgData)
	{
		const formData = new FormData();
		formData.append("file", userImgData);
		try{
			const results = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/upload/ProfilePic`, {
			credentials: 'include',
			method: 'POST',
			body: formData,})
			if (results.ok){
				const pic = await results.json();
				setUserImg(pic.filename);
				setUserProfilePic(pic.filename);
			}
			else {
				toast.error("Unable To change Picture Please try again", {toastId: "Error", autoClose: 1000});
			}
		} catch (error : any) {
			toast.error(error.response.data.message, {toastId: "Error", autoClose: 1000});
		}
	}
}

  const handleFileChange = async () => {
	if (backImgData) {
		const formData = new FormData();
		formData.append("file", backImgData);
		try{
			const results = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/upload/BackgroundPic`, {
			credentials: 'include',
			method: 'POST',
			body: formData,})

			if (results.ok){
				const pic = await results.json();
				setBackImg(pic.filename);
				setUserBackPic(pic.filename);
			}
			else {
				toast.error("Unable To change Picture Please try again", {toastId: "Error", autoClose: 1000});

			}
		} catch (error : any) {
			toast.error(error.response.data.message, {toastId: "Error", autoClose: 1000});

		}
	}
  };
  const HandlePassChange = async () => {
	if (password)
	{
		try{
			const results =  await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/user/pass`, {password : password}, {withCredentials : true});
			if (results.status === 201){
				setPassword('');
				toast.success("Password Change Was Successful", {toastId: "PassChange", autoClose: 1000});
			}
			else {
				toast.error("Unable To change Password Please try again", {toastId: "Error", autoClose: 1000});
			}
		} catch (error : any) {
			toast.error(error.response.data.message[0], {toastId: "Error", autoClose: 1000});
		}
	}
}

  const HandleNickChange = async () => {
	if (nickname){
		try{
			const results = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/user/nick`, {nickname : nickname}, {withCredentials:true});
			if (results.status === 201){
				setUserNickname(nickname);
				setNickname(nickname);
				router.replace(`/profile/${nickname}`);
			}
			else {
				toast.error("Unable To change Nickname Please try again", {toastId: "Error", autoClose: 1000});
			}
		} catch (error : any) {
			toast.error(error.response.data.message, {toastId: "Error", autoClose: 1000});
		}
	}
}

  	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (nick !== nickname)
			await HandleNickChange();
		if (backPic !== backImg)
			await handleFileChange();
		if (userPic !== userImg)
			await handleAvatarChange();
		if (password !== "")
			await HandlePassChange();
		setIsOpen(false);
		// closeModal();
	}

	const updateBackImg = (e: any) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile)
		{
			setBackImgData(selectedFile);
			setBackImg(URL.createObjectURL(selectedFile))
		}
  };

  const viewPassword = (e: any) => {
	if (viewPass === 'password')
		setViewPass('text');
	else
		setViewPass('password');
  } 

  const updateUserImg = (e: React.ChangeEvent<HTMLInputElement>) => {
	const selectedFile = e.target.files?.[0];
	if (selectedFile)
	{
		setUserImgData(selectedFile);
		setUserImg(URL.createObjectURL(selectedFile))
	}
};

  return (
	<>
		<button
			type="button"
			onClick={openModal}
			className="rounded-r-2xl w-[50%] bg-[#75E6DA]"
		>
			EDIT
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
							<Dialog.Panel className="w-full md:w-[50%] lg:w-[35%] xl:w-[30%] h-[450px] transform overflow-hidden rounded-2xl bg-[#189AB4] border-[3px] border-[#05445E] p-6 text-left align-middle shadow-xl transition-all">
								<div className="text-black  w-full h-[310px] relative ">
									<div onClick={(e) => {fileRef.current?.click()}} className='hover:cursor-pointer mx-auto w-full h-[278px] flex justify-center relative'>
										<Image
											unoptimized
											src={backImg}
											// width={200}
											// height={200}
											style={{objectFit: 'fill'}}
											fill={true}
											alt='Background Picture'
											className='rounded-2xl border-solid border-[2.5px] border-[#05445E]'
										/>
										<Image
											priority
											src={uploadBack}
											alt="Add Image"
											className='absolute top-2 right-2'
										/>
										<label htmlFor="file"></label>
										<input type="file" id="file" className="hidden" ref={fileRef} onChange={updateBackImg}/>
									</div>
									<div onClick={(e) => {avatarRef.current?.click()}} className='hover:cursor-pointer flex justify-center absolute bottom-0 left-3'>
										<div className='relative'>
											<Image
												unoptimized
												src={userImg}
												width={80}
												height={80}
												// style={{objectFit: 'fill'}}
												// fill={true}
												alt='User Picture'
												className='rounded-full border-solid border-[2.5px] border-[#05445E] max-h-[80px] max-w-[80px] min-h-[80px] min-w-[80px]'
											/>
											<Image
												priority
												src={addCircle}
												alt="Add Image circle"
												className='absolute top-1/2 -right-1'
											/>
											<label htmlFor="avatar"></label>
											<input type="file" id="avatar" className="hidden" ref={avatarRef} onChange={updateUserImg}/>
										</div>
									</div>
								</div>
								<div className='flex  flex-row gap-2 justify-center w-full mt-2'>
									<div className='flex  flex-row w-1/2 border-[#05445E] border-[2.5px] rounded-xl'>
										<input placeholder='Change Nickname'
											value={nickname}
											type='text'
											onChange={(e) => {setNickname(e.target.value)}}
											className={`border-none focus:ring-0 w-full z-10 h-7 rounded-l-xl p-2 text-center bg-[#D4F1F4]`}
										/>
										<Image
											priority
											src={editName}
											alt="edit name"
											className={`border-none z-20  bg-[#D4F1F4] rounded-r-xl`}
										/>
									</div>
									<div className='flex  flex-row w-1/2 border-[#05445E] border-[2.5px] rounded-xl'>
										<input placeholder='Change Password'
											value={password}
											type={viewPass}
											onChange={(e) => {setPassword(e.target.value)}}
											className={`border-none focus:ring-0 w-full z-10 h-7 rounded-l-xl p-2 text-center bg-[#D4F1F4]`}
											/>
										<Image
											priority
											onClick={viewPassword}
											src={eyeIcon}
											alt="edit Password"
											className='border-none z-20 hover:cursor-pointer  bg-[#D4F1F4]  rounded-r-xl '
										/>
									</div>
								</div>
								

								<div className='flex flex-row justify-center items-center gap-2'>
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


export default EditSettings;
// TODO to remove refresh when updating the nickname use the user id and update the backend accordingly


