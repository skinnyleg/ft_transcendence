import React from 'react'
import { CiSearch } from "react-icons/ci";
import UserDms from './UserDms';

const PersonalTab = () => {
	return (
		<div className="bg-teal-600 rounded-lg p-3 w-full sm:w-5/12 md:4/12 lg:w-4/12 xl:3/12 h-3/6 flex flex-col">
			<h1 className='text-teal-300 font-bold text-lg mb-1'>PERSONAL</h1>
			<div className='flex flex-row justify-around rounded-2xl w-full mb-2'>
				<div className='flex flex-row rounded-xl bg-teal-200 w-full'>
					<CiSearch
						className='w-8 h-10 bg-teal-200 rounded-xl pl-2 text-black'
					/>
					<input type='text'
						placeholder='Search DMS...'
						className='w-full h-10 bg-teal-200 rounded-xl border-none focus:ring-0 text-black'
					/>
				</div>
			</div>
		<UserDms />
		</div>
	)
}


export default PersonalTab;
