'use client';
// import { Pong } from 'react-pong';
import LoginForm from '@/app/ui/login-form';
import { ToastContainer } from 'react-toastify';


function LoginPage() {
    return (
        <main className=" flex items-center justify-center bg-cyan-900 h-screen">
            {/* <Image src={'/yo.jpg'} alt="yo" layout="fill" objectFit="cover" className="h-full w-full object-cover" quality={100} /> */}
            {/* <div className="justify-center items-center flex h-full bg-cyan-100 lg:w-4/5 max-w-[400px] flex-col space-y-2.5 p-4 mt-60 md:w-1/2"> */}
            <div className="justify-center items-center flex bg-cyan-100 w-[95.83%] h-[93.75%] rounded-[15px]">
            <ToastContainer pauseOnFocusLoss={false}  />
                <LoginForm />
                {/* <Pong/> */}
            </div>
        </main>);
}

export default LoginPage;