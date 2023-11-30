import React from 'react'
import UserChannels from './UserChannels';
import { CiSearch } from "react-icons/ci";
import { IoMdAddCircleOutline } from "react-icons/io";

const ChannelTab = () => {
	return (
		<div className="bg-teal-600 rounded-lg p-3 w-1/5 h-1/2 flex flex-col">
			<h1 className='text-teal-300 font-bold text-lg mb-1'>CHANNELS</h1>
			<div className='flex flex-row justify-around bg-teal-200 rounded-2xl w-full'>
				<CiSearch
					className='w-8 h-10 bg-teal-200 rounded-s-lg pl-2 text-black'
				/>
				<input type='text'
					placeholder='Search Channels...'
					className='w-3/5 h-10 bg-teal-200 border-none focus:ring-0 rounded-e-lg text-black'
				/>
				<button className='text-black text-center w-1/6'>
					<IoMdAddCircleOutline className='w-full h-6'/>
				</button>
			</div>
		<UserChannels />
		</div>
	)
}


export default ChannelTab;
