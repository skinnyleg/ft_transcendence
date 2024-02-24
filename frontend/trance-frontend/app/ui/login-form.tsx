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
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import Ellipse from "../../public/Ellipse.svg";
 
export default function LoginForm() {
  const [error, setError] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(true);
  const router = useRouter();
  let lastClicked = '';


  const buttonClicked = (e) => {
    lastClicked = e.target.innerHTML;
  }

  const deleteCookies = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/auth/clearCookies`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json'},
    });
  }

  useEffect(() => {
    deleteCookies();
  }, [])


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsErrorVisible(true);
    event.preventDefault();
  
    const username = event.currentTarget.user.value;
    const password = event.currentTarget.password.value;
    let response;
    try {

      if (lastClicked.includes('SIGN UP'))
      {
          response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/auth/signup`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ username, password }),
           });
      }
      else
      {
          response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/auth/signin`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ username, password }),
           });
      }
      // console.log('response == ', response.status);
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
        toast.error('Please check your credentials.', {autoClose: 500});
      } else if (response.status === 400) {
        toast.error('You Have Not Set Your Password Yet', {autoClose: 500});
      } else {
        toast.error(`Error, Please Try later`, {autoClose: 500});
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again later.', {autoClose: 500});
    }
    };

  return (
    <form className="border-[3px] border-solid xl:px-[70px] xl:pt-[35px] xl:pb-[70px] border-[rgba(88,130,193,0.49)] bg-[#189AB4] backdrop-blur-[12.5px] w-[75%] md:w-[43.48%] h-fit rounded-[15px] flex flex-col justify-center items-center" onSubmit={handleSubmit}>
      <div className='w-full h-full p-2  flex flex-col gap-4 rounded-[15px]'>
        <div className='text-[#D4F1F4] font-gilroy text-[20px] font-bold leading-normal self-start '>
              Login
        </div>
        <div className="flex flex-col gap-1">
          
            <label
              className="text-[#D4F1F4] font-bebas-neue text-[12px] font-normal leading-normal"
              htmlFor="user"
            >
              USER
            </label>
              <input
                className="p-2 rounded-[15px] w-full h-[30px] border border-[#BCBEC0] bg-[#D4F1F4]"
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
                <input
                  className="p-2 rounded-[15px] w-full h-[30px] border border-[#BCBEC0] bg-[#D4F1F4]"
                  id="password" 
                  type="password"
                  name="password" 
                  required
                        
                />

            </div>
            <LoginButton 
              lastClicked={lastClicked}
              buttonClicked={buttonClicked}
            />
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

function LoginButton({lastClicked, buttonClicked}) {
 const { pending } = useFormStatus();

 return (
        <div className="flex flex-row gap-2">
          <button onClick={(e) => {buttonClicked(e)}} className="w-full bg-[#05445E]  rounded-[15px] px-4 py-[7px] mt-[40px] flex items-center justify-center" aria-disabled={pending}>
            <span className="text-[#D4F1F4] font-bold text-[20px] items-center">SIGN IN</span>
          </button>
          <button onClick={(e) => {buttonClicked(e)}} className="w-full bg-[#05445E]  rounded-[15px] px-4 py-[7px] mt-[40px] flex items-center justify-center" aria-disabled={pending}>
            <span className="text-[#D4F1F4] font-bold text-[20px] items-center">SIGN UP</span>
          </button>
        </div>
 );
}