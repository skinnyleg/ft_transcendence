'use client';
import LoginForm from '@/app/ui/login-form';
import { ToastContainer } from 'react-toastify';


function LoginPage() {
    return (
        <main className=" flex items-center justify-center bg-cyan-900 h-screen">
            <div className="justify-center items-center flex bg-cyan-100 w-[95.83%] h-[93.75%] rounded-[15px]">
            <ToastContainer pauseOnFocusLoss={false}  />
                <LoginForm />
            </div>
        </main>);
}

export default LoginPage;