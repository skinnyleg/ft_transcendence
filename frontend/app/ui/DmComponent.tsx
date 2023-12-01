import type { FC } from 'react';
import Image from 'next/image';
import { DmsInter } from '../interfaces/interfaces';

interface DmComponentProps {
	Dm : DmsInter
}

const DmComponent: FC<DmComponentProps> = ({Dm}) => {
	return (
		<div className='bg-teal-100 rounded-xl w-full h-14 mb-1 text-black p-2 flex justify-between items-center'>
			<div className='flex space-x-3'>
				<Image
					src={Dm.userPic}
					alt='Dm Image'
					width='45'
					height='45'
					className='rounded-full bg-gray-500'
				/>
			<div className='flex flex-col'>
				<h1 className='font-bold text-xl'>{Dm.userNick}</h1>
				<p className='text-gray-500'>last message</p>
			</div>
		</div>
		</div>
	);
}
export default DmComponent;
