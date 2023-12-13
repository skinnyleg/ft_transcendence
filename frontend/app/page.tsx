'use client';
import Image from 'next/image'
// import { Pong } from 'react-pong';
import LoginForm from '@/app/ui/login-form';


function LoginPage() {
    return (
        <main className="flex items-center justify-center bg-main h-screen overflow-hidden">
            {/* <Image src={'/yo.jpg'} alt="yo" layout="fill" objectFit="cover" className="h-full w-full object-cover" quality={100} /> */}
            <div className="relative flex h-full bg-main lg:w-4/5 max-w-[400px] flex-col space-y-2.5 p-4 mt-60 md:w-1/2">
                <LoginForm />
                {/* <Pong/> */}
            </div>
        </main>);
}

export default LoginPage;