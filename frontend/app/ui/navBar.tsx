'use client';
import { ArrowLeftOnRectangleIcon,
    Bars4Icon, ChatBubbleBottomCenterIcon,
    Cog6ToothIcon, HomeIcon, TrophyIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Metadata } from "next"
import { Inter } from "next/font/google"
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import withAuth from "../withAuth";

const inter = Inter({ subsets: ['latin'] })

function NavBar ()
{
    const [show, setShow] = useState(false);
    var currentPath = usePathname();
    return (
        <div className={inter.className}>
            <div className="block lg:hidden bg-gray-800 text-white md:w-screen p-4 flex justify-between items-center border-indigo-600">
                <div>
                    <Link href="/Dashboard" />
                    <Image
                        className="h-8 w-auto"
                        src="/logo.png"
                        alt="Logo"
                        width={100}
                        height={40}
                    />
                </div>
                <button className="text-white p-2 focus:outline-none">
                    <Bars4Icon onClick={() => setShow(!show)} className="w-6 h-6" />
                </button>
            </div>
            <div>
            <div
              className={`${
                show ? 'p-12 md:p-0 block md:block bg-lightblue' : 'hidden'
              }`}
            >
              <ul className="h-screen items-center p-10 justify-center">
                <li className="pb-6 text-xl text-gray-900 py-2 px-6 text-center rounded-full hover:opacity-80">
                  <Link href="/Dashboard" onClick={() => setShow(!show)}>
                    Home
                  </Link>
                </li>
                <li className="pb-6 text-xl text-gray-900 py-2 px-6 text-center rounded-full opacity-80">
                  <Link href="/Profile" onClick={() => setShow(!show)}>
                    Profile
                  </Link>
                </li>
                <li className="pb-6 text-xl text-gray-900 py-2 px-6 text-center rounded-full opacity-80">
                  <Link href="/chat" onClick={() => setShow(!show)}>
                    Chat
                  </Link>
                </li>
                <li className="pb-6 text-xl text-gray-900 py-2 px-6 text-center rounded-full opacity-80">
                  <Link href="/logout" onClick={() => setShow(!show)}>
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          </div>
            <nav className="flex flex-col ml-2 w-20 mt-2 mb-1 lg:block h-[98vh] bg-back md:hidden hidden rounded-xl border border-blackpink">
                <div className="flex flex-col flex-grow">
                     <div className="flex items-center justify-center mt-6 h-16 px-6 font-medium hover:opacity">
                         <Image
                             className="pointer-events-hover rounded-full border border-neonpink hover:opacity-80 border-[2px]" 
                             src="/logo.png"
                             width={80}
                             height={80}
                             alt="Profile Picture"
                         />
                     </div>
                     <div className="flex flex-col flex-grow mt-20">
                         <Link href="/Dashboard" className={clsx(`flex items-center mt-15 justify-center mt-10 px-15 font-medium text-gray-400 hover:opacity-50
                            hover:text-neonpink`, {
                          'text-neonpink'  : currentPath === "/Dashboard",
                          })}>
                             <HomeIcon className="w-10 ml-3 h-6 mr-4" />
                         </Link>
                         <Link href="/chat" className={clsx(`flex items-center mt-15 justify-center mt-10 px-15 font-medium text-gray-400 hover:opacity-50
                            hover:text-neonpink`, {
                          'text-neonpink'  : currentPath === "/chat",
                          })}>
                             <ChatBubbleBottomCenterIcon className="w-10 ml-3 h-6 mr-4" />
                         </Link>
                         <Link href="/Leaderboard" className={clsx(`flex items-center mt-15 justify-center mt-10 px-15 font-medium text-gray-400 hover:opacity-50
                            hover:text-neonpink`, {
                          'text-neonpink'  : currentPath === "/Leaderboard",
                          })}>
                             <TrophyIcon className="w-10 h-6 ml-3 mr-4" />
                         </Link>
                         <Link href="/settings"
                          className={clsx(`flex items-center mt-15 justify-center mt-10 px-15 font-medium text-gray-400 hover:opacity-50
                          hover:text-neonpink`, {
                        'text-neonpink'  : currentPath === "/Leaderboard",
                        })}>
                             <Cog6ToothIcon className="w-10 ml-3 h-6 mr-4" />
                         </Link>
                     </div>
                    <div className="absolute bottom-5 justify-center text-gray-500 items-center ml-4">
                        <Link href="/logout" 
                        className={clsx(`flex hover:opacity-50
                        hover:text-neonpink`, {
                      'text-neonpink'  : currentPath === "/Leaderboard",
                      })}>
                            <ArrowLeftOnRectangleIcon className="w-10 mr-4" />
                        </Link>
                    </div>
                 </div>
            </nav>
        </div>
    );
}

export default (NavBar);