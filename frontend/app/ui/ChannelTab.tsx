// "use client"
import React from 'react'
import UserChannels from './UserChannels';
import { CiSearch } from "react-icons/ci";
import { IoMdAddCircleOutline } from "react-icons/io";
import { CreateChannelIcon } from './CustomIcons';
import CreateChannelComponent from './CreateChannelComponent';

const ChannelTab = () => {
	return (
		<div className="bg-teal-600 rounded-lg p-3 w-full lg:w-full h-[50%] flex flex-col">
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
				{/* <Popup trigger={ */}
				{/* <button className='text-black bg-teal-200 text-center w-1/6 rounded-e-xl'> */}
				{/* 	<CreateChannelIcon */}
				{/* 		style='w-full h-6 focus:ring-0 focus:outline-none' */}
				{/* 	/> */}
				{/* </button>} modal> */}
				{/* 		<CreateChannelComponent /> */}
				{/* </Popup> */}
				{/* <button className='text-black bg-teal-200 text-center w-1/6 rounded-e-xl'> */}
				{/* 	<CreateChannelIcon */}
				{/* 		style='w-full h-6 focus:ring-0 focus:outline-none' */}
				{/* 	/> */}
				{/* </button> */}
			</div>
		<UserChannels />
		</div>
	)
}


export default ChannelTab;
