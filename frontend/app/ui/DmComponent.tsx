"use client"
import { useContext, type FC } from 'react';
import Image from 'next/image';
import { DmsInter } from '../interfaces/interfaces';
import { useRouter } from 'next/navigation';
import { ChatContext } from '../context/soketContext';

interface DmComponentProps {
	Dm : DmsInter
}

const DmComponent: FC<DmComponentProps> = ({Dm}) => {
	const router = useRouter();

	const {personalId, setPersonalId, setSearchInputDm} = useContext(ChatContext);

	const setDmQuery = () => {
		console.log('here == ', Dm.dmId);
		router.replace(`/Chat?personal=${Dm.dmId}`);
		setPersonalId(Dm.dmId);
		// setSearchInputDm('');
	}
	return (
		<div onClick={setDmQuery} className='gap-2 rounded-[15px] w-full h-12 mb-1 text-black p-0 flex justify-between items-center hover:cursor-pointer'>
				<Image
					unoptimized={process.env.NEXT_PUBLIC_ENVIRONMENT !== "PRODUCTION"}
					src={Dm.picture as string}
					alt='Dm Image'
					width={45}
					height={45}
					className='rounded-full bg-teal-300 max-w-[40px] max-h-[40px] min-w-[40px] min-h-[40px]'
				/>
				<div className='flex flex-col bg-teal-100 w-full h-full pl-2 rounded-xl'>
					<h1 className='font-bold text-base '>{Dm.name}</h1>
					{/* <p className='text-gray-500 text-sm'>{channel.lastMsg === '' ? 'No New Messages' : channel.lastMsg}</p> */}
					<p className='text-gray-500 text-sm'>  {Dm.lastMsg.length > 7
								? `${Dm.lastMsg.substring(0, 7)}...`
								: Dm.lastMsg === ''
								? 'No New Messages'
								: Dm.lastMsg}
								</p>
				</div>
		</div>
	);
}
export default DmComponent;
