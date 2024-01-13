'use client';
 
import { lusitana } from '@/app/ui/fonts';
import {
  UserIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { useFormState, useFormStatus } from 'react-dom';
import Link  from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import Ellipse from "../../public/Ellipse.svg";
 
export default function LoginForm() {
  const [error, setError] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(true);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsErrorVisible(true);
    event.preventDefault();
  
    const username = event.currentTarget.username.value;
    const password = event.currentTarget.password.value;
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/auth/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ username, password }),
      });
      console.log('response == ', response.status);
      if (response.status === 200) {
        const res = await response.json();
        toast.success("Welcome ...!");
        router.push('/Dashboard', undefined);
      } 
      else if (response.status === 202)
      {
        router.push('/Qr', undefined);
      }
      else if (response.status === 401) {
        toast.error('Invalid credentials. Please check your username and password.', {autoClose: 500});
      } else if (response.status === 404) {
        toast.error('User not found. Please check your credentials.', {autoClose: 500});
      } else {
        toast.error(`Error, Please Try later`);
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again later.', {autoClose: 500});
    }
    };
  

  return (
    <form className="border-[3px] border-solid px-[70px] pt-[35px] pb-[70px] border-[rgba(88,130,193,0.49)] bg-[#189AB4] backdrop-blur-[12.5px] w-[43.48%] h-[66.67%] rounded-[15px] flex flex-col justify-center items-center" onSubmit={handleSubmit}>
      {/* <div className="flex-1 rounded-lg bg-accents border border-gray-300 w-full h-full px-6 pb-4 pt-8 mt-10"> */}
      <div className='w-full h-full p-2  flex flex-col gap-6 rounded-[15px]'>
        <div className='text-[#D4F1F4] font-gilroy text-[20px] font-bold leading-normal self-start '>
            {/* <h1 className={`${lusitana.className} mb-3 lg:text-2xl md:text-xl text-xl`}> */}
              Login
            {/* </h1> */}
        </div>
        <div className="flex flex-col gap-1">
          {/* <div className="mt-0"> */}
          
            <label
              className="text-[#D4F1F4] font-bebas-neue text-[12px] font-normal leading-normal"
              htmlFor="user"
            >
              USER
            </label>
            {/* <div className="relative"> */}
              <input
                className="rounded-[15px] w-full h-[30px] border border-[#BCBEC0] bg-[#D4F1F4]"
                id="user" 
                type="username"
                name="user" 
                required
                      
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                className="text-[#D4F1F4] font-bebas-neue text-[12px] font-normal leading-normal"
                htmlFor="password"
              >
                PASSWORD
              </label>
              {/* <div className="relative"> */}
                <input
                  className="rounded-[15px] w-full h-[30px] border border-[#BCBEC0] bg-[#D4F1F4]"
                  id="password" 
                  type="password"
                  name="password" 
                  required
                        
                />

            </div>
            <LoginButton />
            <div className='flex flex-row gap-2 items-center'>
              <div className="border-t border-black w-1/2"></div>
              <p className='text-[#020943] font-bebas-neue text-center font-bold text-[15px]'>OR</p>
              <div className="border-t border-black w-1/2"></div>
            </div>
            <div className="flex items-center justify-center rounded-xl w-full  h-14">
              <div className="mt-2 mb-5 flex  rounded-xl h-full w-full items-cente justify-center">
                <Link href={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/auth/42/`}>
                  <div className='w-[109px] h-[36px] flex justify-center items-center bg-cyan-100 rounded-[15px]'>
                    <Image
                        priority
                        src={Ellipse}
                        alt="42 Logo"
                    />
                  </div>
                </Link>
              </div>
            </div>
      </div>
  </form>
  );
}

function LoginButton() {
 const { pending } = useFormStatus();

 return (
    // <button className="mt-5 md:ml-6 w-full md:w-4/5 bg-button border border-gray-500 rounded-lg px-4 py-[7px] flex items-center justify-between" aria-disabled={pending}>
    //   <span className="text-white items-center">Log in</span>
    //   <ArrowRightIcon className="h-4 w-4 text-white" />
    // </button>

      <button className="w-full bg-[#05445E]  rounded-[15px] px-4 py-[7px] mt-[40px] flex items-center justify-center" aria-disabled={pending}>
      <span className="text-[#D4F1F4] font-bold text-[20px] items-center">SIGN IN</span>
      {/* <ArrowRightIcon className="h-4 w-4 text-white" /> */}
    </button>
 );
}

  //   <form className=" space-y-3" onSubmit={handleSubmit}>
  //     {/* <div className="flex-1 rounded-lg bg-accents border border-gray-300 px-6 pb-4 pt-8 mt-10"> */}
  //       <h1 className={`${lusitana.className} mb-3 lg:text-2xl md:text-xl text-xl`}>
  //         Please log in to continue.
  //       </h1>
  //       <div className="w-full md:w-4/5">
  //         <div className="mt-10">
  //           <label
  //             className="ml-6 mb-3 mt-5 text-xs hidden lg:block md:block font-medium text-white"
  //             htmlFor="username"
  //           >
  //             username
  //           </label>
  //           <div className="relative">
  //             <input
  //               className="peer md:ml-6 md:mt-2 text-gray-700 block w-full md:w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
  //               id="username" 
  //               type="username"
  //               name="username"
  //               placeholder="Enter your username"
  //               required
                
  //             />
  //             <UserIcon className="md:ml-6 absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
  //           </div>
  //         </div>
  //         <div className="mt-10">
  //           <label className="md:ml-6 mb-3 mt-5 hidden lg:block md:block text-xs font-medium text-white" htmlFor="password">
  //             Password
  //           </label>
  //           <div className="relative">
  //             <input
  //               className="md:ml-6 text-gray-700 peer block w-full md:w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
  //               id="password"
  //               type="password"
  //               name="password"
  //               placeholder="Enter password"
  //               required
  //             />
  //             <KeyIcon className="md:ml-6 pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
  //           </div>
  //         </div>
  //       </div>
  //       <LoginButton />
  //       <div className="text-center mt-5 flex flex-col gap-2">
  //         <div className="flex items-center justify-center">
  //           <div className="border-t border-black w-1/2"></div>
  //           <div className="mx-4 text-xl">or</div>
  //           <div className="border-t border-black w-1/2"></div>
  //         </div>

  //         <div className="flex items-center justify-center rounded-xl w-full  h-14">
  //           <div className="mt-2 mb-5 flex  rounded-xl h-full w-full items-cente justify-center">
  //             <Link href={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/auth/42/`}>
  //               {/* <img
  //                 className="pointer-events-hover rounded-xl object-scale-down opacity-90 hover:opacity-80"
  //                 src="/42.jpg"
  //                 width={40}
  //                 height={40}
  //                 alt="42 Authentication API"
  //               /> */}
  //               <div className='w-[109px] h-[36px] flex justify-center items-center bg-cyan-100 rounded-[15px]'>
  //                 <Image
  //                     priority
  //                     src={Ellipse}
  //                     alt="42 Logo"
  //                 />
  //               </div>
  //             </Link>
  //           </div>
  //         </div>
  //       </div>
  //     {/* </div> */}
  // </form>