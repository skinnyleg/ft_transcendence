import React, { FC } from 'react'
import ChannelTab from '../ui/ChannelTab'
import { Metadata } from 'next'
import PersonalTab from '../ui/PersonalTab'
import ChatTab from '../ui/ChatTab'
import ChatSideBar from '../ui/ChatSideBar'
import UserSideBar from '../ui/UserSideBar'

export const metadata: Metadata = {
  title: 'Chat',
  description: 'Pong Platform Chat Page',
  viewport: 'width=device-width, initial-scale=1',
}

interface ChatProps {
	searchParams?: { [key: string]: string | undefined };
}

const chat: FC<ChatProps> = ({searchParams}) => {



	// const checkQuery = () => {
	// 	if (searchParams?.channel !== undefined && searchParams?.personal !== undefined)
	// 		return false;
	// 	if (searchParams?.channel === undefined || searchParams?.channel === '')
	// 	{
	// 		if (searchParams?.personal === undefined || searchParams?.personal === '')
	// 			return false;
	// 	}
	// 	else if (searchParams?.personal === undefined || searchParams?.personal === '')
	// 	{
	// 		if (searchParams?.channel === undefined || searchParams?.channel === '')
	// 			return false;
	// 	}
	// 	return true;
	// }

	return (
		<div className='h-screen flex flex-row pt-[70px] pb-1 pr-2 lg:pb-1 lg:pt-2'>
			<div className='h-full w-full lg:flex lg:w-[40%] flex gap-1 flex-col'>
			{/* <div className={`h-full w-full lg:flex lg:w-[40%] flex gap-1 flex-col ${checkQuery() ? 'hidden' : ''}`}> */}
					<ChannelTab />
					<PersonalTab />
			</div>
			{/* {checkQuery() ? ( */}
			{/* 	<> */}
			{/* 		<div className='lg:flex lg:flex-grow w-full h-full pb-1'> */}
			{/* 			<ChatTab */}
			{/* 				channelId={searchParams?.channel} */}
			{/* 			/> */}
			{/* 		</div> */}
			{/* 		<div className='hidden lg:flex lg:w-[50%] xl:w-[40%] w-full h-full pb-1'> */}
			{/* 			{/* <ChatSideBar */}
			{/* 			{/* 	channelId={searchParams?.channel} */}
			{/* 			{/* /> */}
			{/* 			<UserSideBar /> */}
			{/* 		</div> */}
			{/* 	</> */}
			{/* ) : ( */}
			{/* 	<> */}
			{/* 		<div className='w-full h-full hidden lg:block pb-1'> */}
			{/* 		</div> */}
			{/* 		<div className='hidden lg:flex lg:w-[50%] xl:w-[40%] w-full h-full pb-1'> */}
			{/* 		</div> */}
			{/* 	</> */}
			{/* )} */}
		</div>
	)
}

export default chat;
// 	  const isHidden = () => {
//     if (searchParams?.channel !== undefined && searchParams?.personal !== undefined) {
//       return false;
//     }
//
//     if (
//       (searchParams?.channel === undefined || searchParams?.channel === '') &&
//       (searchParams?.personal === undefined || searchParams?.personal === '')
//     ) {
//       return false;
//     }
//
//     return true;
//   };
//
//   return (
//     <div className="h-screen flex flex-row pt-[70px] pb-1 pr-2 lg:pb-1 lg:pt-2">
//       <div className={`h-full w-full lg:w-[40%] flex gap-1 flex-col ${isHidden() ? 'hidden' : ''}`}>
//         <ChannelTab />
//         <PersonalTab />
//       </div>
//
//       {isHidden() ? (
//         <>
//           <div className="lg:flex lg:flex-grow w-full h-full pb-1">
//             <ChatTab channelId={searchParams?.channel} />
//           </div>
//           <div className="hidden lg:flex lg:w-[50%] xl:w-[40%] w-full h-full pb-1">
//             <UserSideBar />
//           </div>
//         </>
//       ) : (
//         <>
//           <div className="w-full h-full lg:block pb-1"></div>
//           <div className="hidden lg:flex lg:w-[50%] xl:w-[40%] w-full h-full pb-1"></div>
//         </>
//       )}
//     </div>
//   );
// };

