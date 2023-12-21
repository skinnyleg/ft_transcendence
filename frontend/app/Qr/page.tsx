'use client';
// pages/VerifyCode.tsx
import React, { use, useRef, useState } from 'react';
import VerificationInput from '../ui/qrCode';
import { redirect, useRouter } from 'next/navigation';
// import useInputRefs from '../ui/useInputRefs';


const VerifyCode :  React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const inputRefs =  Array(6).fill(0).map(() => useRef<HTMLInputElement | null>(null));
  const router = useRouter();
  const handleSubmit = async (code: string) => {
    try {
      // Send the code to the backend for verification
      const response = await fetch('http://localhost:8000/qr/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ code }),
      });
      console.log("result", response);
      if (response.ok) {
        const data = await response.json();
        router.replace('/Dashboard');
        console.log('Verification successful:', data);
      }
      else if (response.status === 404) {
        setError('Verification failed');
      }
      else {
        console.error('Verification failed');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
    }
  };

  return (
    <main className="flex items-center justify-center bg-main h-screen overflow-hidden">
        <div className="relative flex h-full bg-main lg:w-4/5 max-w-[600px] mx-auto flex-col space-y-2.5 p-4 mt-60 md:w-1/2">
          <div className="flex flex-col rounded-lg bg-accents border h-[50%] border-gray-300 px-6 pb-4 mx-auto pt-8 w-[full] mt-10">
            <div className={`bg-main flex justify-center items-center ${!error ? 'hidden' : ''} mx-auto w-full`}>
              <h1 className="text-5xl font-bold-700 mb-4 font-serif">Verification failed</h1>
            </div>
            <div className={`${error ? 'hidden' : ''} mx-auto flex flex-col justify-between h-[60%] mt-10 w-[80%]`}>
              <h1 className="text-4xl h-10 font-bold mb-4 text-center font-serif">Enter Verification Code</h1>
              <div className='mt-10 flex flex-col justify-between h-[60%]'>
                <p className="md:text-sm lg:text-lg text-center text-lg">Please enter the 6-digit code from your authenticator app.</p>
                <VerificationInput inputRefs={inputRefs} onSubmit={handleSubmit} />
              </div>
            </div>
          </div>
      </div>
    </main>
      
  );
};

export default VerifyCode;
