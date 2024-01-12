'use client';
// pages/VerifyCode.tsx
import React, { use, useEffect, useRef, useState } from 'react';
import VerificationInput from '../ui/qrCode';
import { redirect, useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';


const VerifyCode :  React.FC = () => {
  /// Never Ever Use useRef inside callBack it's against react hooks rules 
  const [inputRefs, setInputRefs] = useState<React.RefObject<HTMLInputElement>[]>(Array(6).fill(null).map(() => React.createRef<HTMLInputElement>()));

  useEffect(() => {
    // Initialize refs only once
    // setInputRefs(Array(6).fill(null).map(() => React.createRef<HTMLInputElement>()));
    inputRefs[0].current?.focus();
  }, []);
  
  // useEffect(() => {
  // }, [inputRefs])

  const [error, setError] = useState<string | null>(null)
  const router = useRouter();
  const handleSubmit = async (code: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/qr/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ code: code }),
      });
      if (response.ok) {
        const data = await response.json();
        toast.success('Verification successfull!', {
          autoClose: 500,
        });
        router.replace('/Dashboard');
      }
      else {
        setError('Verification Failed')
      }
      } catch (error : any) {
      setError('Verification Failed')
    }
  };

  return (
    <>
      <main className="bg-main h-screen overflow-hidden">
        <div className='h-full items-center justify-center flex'>
            <div className="relative flex h-full bg-main lg:w-4/5 max-w-[600px] mx-auto flex-col space-y-2.5 p-4 mt-60 md:w-1/2">
              <div className="flex flex-col  justify-between rounded-lg bg-accents border h-[50%] border-gray-300 px-6 pb-4 mx-auto pt-8 w-[full] mt-10">
                {/* <div className={`bg-main flex justify-center items-center ${!error ? 'hidden' : ''} mx-auto w-full`}>
                  <h1 className="lg:text-5xl xl:text-5xl md:text-2xl text-2xl font-bold-700 mb-4 font-serif">Verification failed</h1>
                </div> */}
                <div className={`mx-auto flex flex-col justify-between h-[60%] mt-10 w-[80%]`}>
                  <h1 className="lg:text-4xl xl:text-4xl md:text-2xl text-2xl h-10 font-bold mb-4 text-center font-serif">Enter Verification Code</h1>
                  <div className='mt-10 flex flex-col justify-between h-[60%]'>
                    <p className="md:text-sm lg:text-lg text-center text-lg">Please enter the 6-digit code from your authenticator app.</p>
                    <VerificationInput inputRefs={inputRefs} onSubmit={handleSubmit} setError={setError} />
                  </div>
                </div>
                    {
                      error && (
                        <p className='text-2xl font-semibold text-red-500 self-center'>{error}</p>
                      )
                    }
              </div>
           </div>
        </div>
      </main>
      </>      
  );
};

export default VerifyCode;
