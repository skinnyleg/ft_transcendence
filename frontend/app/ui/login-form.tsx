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
      const response = await fetch('http://localhost:8000/auth/signin', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      if (response.ok) {
        const res = await response.json();
        toast.success("Welcome ...!");
        router.push('/Dashboard', undefined);
      } else if (response.status === 401) {
        toast.error('Invalid credentials. Please check your username and password.');
      } else if (response.status === 404) {
        toast.error('User not found. Please check your credentials.');
      } else {
        toast.error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again later.');
    }
    };
  

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      {/* <ToastContainer /> */}
      <div className="flex-1 rounded-lg bg-accents border border-gray-300 px-6 pb-4 pt-8 mt-10">
        <h1 className={`${lusitana.className} mb-3 lg:text-2xl md:text-xl text-xl`}>
          Please log in to continue.
        </h1>
        <div className="w-4/5">
          <div className="mt-10">
            <label
              className="ml-6 mb-3 mt-5 text-xs hidden lg:block md:block font-medium text-white"
              htmlFor="username"
            >
              username
            </label>
            <div className="relative">
              <input
                className="peer md:ml-6 md:mt-2 text-gray-700 block md:w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="username" 
                type="username"
                name="username"
                placeholder="Enter your username"
                required
                
              />
              <UserIcon className="md:ml-6 absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-10">
            <label className="md:ml-6 mb-3 mt-5 hidden lg:block md:block text-xs font-medium text-white" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                className="md:ml-6 text-gray-700 peer block md:w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
              />
              <KeyIcon className="md:ml-6 pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <LoginButton />
        <div className="text-center mt-5 flex flex-col gap-2">
          <div className="flex items-center justify-center">
            <div className="border-t border-black w-1/2"></div>
            <div className="mx-4 text-xl">or</div>
            <div className="border-t border-black w-1/2"></div>
          </div>

          <div className="flex items-center justify-center rounded-xl w-full  h-14">
            <div className="mt-2 mb-5 flex  rounded-xl h-full w-full items-cente justify-center">
              <Link href="http://localhost:8000/auth/42/">
                <img
                  className="pointer-events-hover rounded-xl object-scale-down opacity-90 hover:opacity-80"
                  src="/42.jpg"
                  width={40}
                  height={40}
                  objectFit='fit'
                  alt="42 Authentication API"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
  </form>
  );
}

function LoginButton() {
 const { pending } = useFormStatus();

 return (
    <button className="mt-5 ml-6 w-4/5 bg-button border border-gray-500 rounded-lg px-4 py-[7px] flex items-center justify-between" aria-disabled={pending}>
      <span className="text-white items-center">Log in</span>
      <ArrowRightIcon className="h-4 w-4 text-white" />
    </button>
 );
}