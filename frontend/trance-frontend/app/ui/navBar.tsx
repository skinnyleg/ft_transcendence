'use client';
import { ArrowLeftOnRectangleIcon,
    Bars4Icon, ChatBubbleBottomCenterIcon,
    Cog6ToothIcon, HomeIcon, MagnifyingGlassIcon, TrophyIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Inter } from "next/font/google"
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import {profileNickPic, responseData} from "@/app/interfaces/interfaces";
import { useDebouncedCallback } from "use-debounce";
import { ContextProvider, picturesContext } from "../context/profilePicContext";
import Notifications from "./Notification";
import { toast } from "react-toastify";
const inter = Inter({ subsets: ['latin'] })


interface NavBarProps {
  handleShowMenu: (show: boolean) => void;
}

function NavBar ({handleShowMenu}: NavBarProps)
{
  const [show, setShow] = useState(false);
  var currentPath = usePathname();
  const router = useRouter();  


  const [search, setSearch] = useState('');
  const [searchShow, setSearchShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setRes] = useState<responseData[]>([]);
  const [showBar, setShowBar] = useState(false); // show search barr

  const searchBackend = async (query: string) => {
    try {
      const results = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/user/search`, {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify({ searchInput: query }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (results.ok) {
        const res = await results.json();
        setRes(res);
      } else {
        throw new Error(`HTTP error! Status: ${results.status}`);
      }    
    } catch (error) {
      setError('Error searching:' + error);
    } finally {
    }
  };


  const debouncedSearchBackend = useDebouncedCallback(searchBackend, 500);

  useEffect(() => {
    if (search) {
      debouncedSearchBackend(search);
    }
  }, [search, debouncedSearchBackend]);

const {profilePic, backgroundPic, nickname} = useContext(picturesContext)
return (
  <div className={`${inter.className}`}>
    <div className="lg:hidden xl:hidden bg-nav top-0 text-white md:w-screen h-15 z-10 p-4 flex justify-between items-center border-indigo-600 fixed w-full">
      <button className="text-white p-2 focus:outline-none">
          <Bars4Icon onClick={() => {setShow(!show); handleShowMenu(!show)}} className="w-6 h-6"/>
      </button>
      <div className="flex flex-row justify-between">
        <div className="mr-4">
          <Notifications />
        </div>
        <div className="mr-4">
          <MagnifyingGlassIcon onClick={() => {setShowBar(!showBar); setSearch('')}} className="h-8 w-8 rounded-full" />
          <input
            onChange={(e) => {setSearch(e.target.value); if (e.target.value) setSearchShow(true); else {setSearchShow(false); setRes([]);} }}
            type="search"
            placeholder="Search..."
            className={`p-1 ${showBar ? '' : 'hidden'}  w-full h-[40px] border border-gray-300 text-black 
             focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-transparent fixed mt-[20px] left-0 right-0 z-10`}
          />
        </div>
        <Link href={`${process.env.NEXT_PUBLIC_FRONTEND_HOST}/profile/${nickname}`}>
          <img
              className="max-w-[32px] max-h-[32px] min-w-[32px] min-h-[32px] rounded-full mr-2"
              src={profilePic}
              alt="Logo"
          />
        </Link>
      </div>
    </div>
    <div className={`${(search ) ? 'block' : 'hidden'} lg:hidden xl:hidden flex justify-start
          mt-[110px] absolute w-screen bg-white shadow-md transition-transform duration-300 z-10 rounded-b-lg`}>
          <div className="flex w-full flex-col"> 
            {searchShow && results.map((result) => (
              <Link href={`/profile/${result.nickname}`} key={result.id}>
                <div className="flex items-center p-2 hover:bg-gray-100 cursor-pointer z-10">
                  <img src={result.profilePic} alt="profile" className="w-10 h-10 rounded-full" />
                  <p className="ml-5">{result.nickname}</p>
                </div>
              </Link>
            ))}
          </div>
    </div>
    <nav className={`flex flex-col lg:ml-2 lg:mt-2 xl:mt-2 lg:block mt-[6vh] fixed lg:h-[98%] h-[94%] bg-nav w-15 ${show ? '' : 'hidden'} lg:rounded-xl border border-blackpink transition-transform duration-300 w-20`}>
      <div className="flex flex-col flex-grow">
        <div className="flex items-center justify-center mt-6 h-16 w-10 mx-auto xl:h-30 xl:w-30 font-medium hover:opacity">
          <Image
            className="pointer-events-hover rounded-full border-accents hover:opacity-80 border-[2px]" 
            src="/logo.png"
            width={100}
            height={100}
            alt="Profile Picture"
          />
        </div>
        <div className="flex flex-col flex-grow mt-20">
            <div className={clsx(`hover:cursor-pointer flex items-center mt-15 justify-center mt-10 px-15 font-medium 
               hover:text-accents`, {'text-accents'  : currentPath === "/Dashboard", 'text-gray-400'  : currentPath !== "/Dashboard"
              })} onClick={() => {router.push('/Dashboard')}}>
              <HomeIcon className="w-10 ml-3 h-6 mr-4 xl:w-20 xl:h-20" />
            </div>
            <div className={clsx(`hover:cursor-pointer flex items-center mt-10 justify-center xl:mt-15 xl:w-20 xl:h-20 px-15 font-medium 
              hover:text-accents`, {'text-accents'  : currentPath === "/Chat", 'text-gray-400'  : currentPath !== "/Chat"})} onClick={() => {router.push('/Chat')}}>
              <ChatBubbleBottomCenterIcon className="w-10 ml-3 h-6 mr-4 xl:w-20 xl:h-20" />
            </div>
            <div className={clsx(`hover:cursor-pointer flex items-center mt-15 justify-center xl:mt-15 mt-10 px-15 font-medium 
              hover:text-accents`, {'text-accents'  : currentPath === "/Leaderboard", 'text-gray-400'  : currentPath !== "/Leaderboard"
              })} onClick={() => {router.push('/Leaderboard')}}>
              <TrophyIcon className="w-10 h-6 ml-3 mr-4 xl:w-20 xl:h-20" />
            </div>
            <div className={clsx(`hover:cursor-pointer flex items-center mt-15 justify-center mt-10 xl:mt-15 px-15 font-medium  hover:text-accents`, {
              'text-accents'  : currentPath === "/settings", 'text-gray-400'  : currentPath !== "/settings"
                })} onClick={() => {router.push('/settings')}}>
              <Cog6ToothIcon className="w-10 ml-3 h-6 mr-4 xl:w-20 xl:h-20" />
            </div>
        </div>
        <div className="absolute bottom-5 justify-center text-gray-500 xl:mt-15 items-center flex w-full ">
          <Link href={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/auth/signout`} 
            className={clsx(`flex justify-center w-full 
            hover:text-accents`, {
          'text-accents'  : currentPath === "/",
          })}>
            <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45" fill="none">
              <rect width="45" height="45" rx="10" fill="#05445E"/>
              <path d="M18.75 20.625V15L28.125 22.5L18.75 30V24.375H1.875V20.625H18.75ZM4.60837 28.125H8.59035C10.8155 33.6221 16.2049 37.5 22.5 37.5C30.7843 37.5 37.5 30.7843 37.5 22.5C37.5 14.2157 30.7843 7.5 22.5 7.5C16.2049 7.5 10.8155 11.3778 8.59035 16.875H4.60837C6.99763 9.26792 14.1044 3.75 22.5 3.75C32.8552 3.75 41.25 12.1447 41.25 22.5C41.25 32.8552 32.8552 41.25 22.5 41.25C14.1044 41.25 6.99763 35.7321 4.60837 28.125Z" fill="#a8a29e"/>
            </svg>
          </Link>
        </div>
      </div>
    </nav>
    </div>
  );
}

export default (NavBar);
