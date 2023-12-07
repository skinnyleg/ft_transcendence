"use client"
import type { FC } from 'react';
import Image from 'next/image';
import { DmsInter } from '../interfaces/interfaces';
import { useRouter } from 'next/navigation';

interface DmComponentProps {
	Dm : DmsInter
}

const DmComponent: FC<DmComponentProps> = ({Dm}) => {
	const router = useRouter();

	const setDmQuery = () => {
		router.replace(`/Chat?personal=${Dm.id}`);
	}
	return (
		<div onClick={setDmQuery} className='rounded-xl w-full h-14 mb-0 text-black p-2 flex justify-between items-center hover:cursor-pointer'>
			<div className='flex gap-2 w-full'>
				<Image
					src={Dm.userPic}
					alt='Dm Image'
					width='45'
					height='45'
					className='rounded-full bg-teal-300'
				/>
			<div className='flex flex-col bg-teal-100 w-full pl-2 rounded-xl'>
				<h1 className='font-bold text-xl'>{Dm.userNick}</h1>
				<p className='text-gray-500'>last message</p>
			</div>
		</div>
		</div>
	);
}
export default DmComponent;
