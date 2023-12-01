import React from 'react'
import UserChannels from './UserChannels';
import { CiSearch } from "react-icons/ci";
import { IoMdAddCircleOutline } from "react-icons/io";

const ChannelTab = () => {
	return (
		<div className="bg-teal-600 rounded-lg p-3 w-full sm:w-5/12 md:4/12 lg:w-4/12 xl:3/12 h-3/6 flex flex-col mb-3">
			<h1 className='text-teal-300 font-bold text-lg mb-1'>CHANNELS</h1>
			<div className='flex flex-row justify-around rounded-2xl w-full mb-2'>
				<div className='flex flex-row rounded-s-xl bg-teal-200 w-4/5'>
					<CiSearch
						className='w-8 h-10 bg-teal-200 rounded-s-lg pl-2 text-black'
					/>
					<input type='text'
						placeholder='Search Channels...'
						className='w-4/5 h-10 bg-teal-200 border-none focus:ring-0 text-black'
					/>
				</div>
				<button className='text-black bg-teal-200 text-center w-1/6 rounded-e-xl group relative'>
					<IoMdAddCircleOutline className='w-full h-6'/>
					<span className="hidden group-hover:block bg-gray-800 text-white text-xs rounded-md py-1 px-2 absolute bottom-full left-1/2 transform -translate-x-1/2 translate-y-20 transition-opacity duration-300">
						Create Channel
					</span>
				</button>
			</div>
		<UserChannels />
		</div>
	)
}


export default ChannelTab;
