'use client';
import Image from 'next/image'
// import { Pong } from 'react-pong';
import LoginForm from '@/app/ui/login-form';


export default function LoginPage() {
    return (
        <main className="flex items-center justify-center bg-lightblue h-screen">
            <Image src={'/yo.jpg'} alt="yo" layout="fill" objectFit="cover" quality={100} />
            <div className="relative mx-auto flex lg:w-4/5 max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32 md:w-1/2">
                <LoginForm />
                {/* <Pong/> */}
            </div>
      </main>);
  }
