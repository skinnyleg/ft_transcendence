'use client';
import { ArrowLeftOnRectangleIcon,
    Bars4Icon, ChatBubbleBottomCenterIcon,
    Cog6ToothIcon, HomeIcon, MagnifyingGlassIcon, TrophyIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Inter } from "next/font/google"
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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


  const [search, setSearch] = useState('');
  const [searchShow, setSearchShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setRes] = useState<responseData[]>([]);
  const [showBar, setShowBar] = useState(false); // show search barr
  const [profilePic, setProfilePic] = useState('');
  const [backgroundPic, setBackgroundPic] = useState('');
  const [nickname, setNickname] = useState('');

  const searchBackend = async (query: string) => {
    try {
      const results = await fetch(`http://localhost:8000/user/search`, {
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

  useEffect(() => {
    const getnickname = async () => {
      try {
        const res = await fetch(`http://localhost:8000/user/Nickname`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          const nickname : profileNickPic = await res.json();
          setProfilePic(nickname.profilePic);
          setBackgroundPic(nickname.BackgroundPic);
          setNickname(nickname.nickname);
          console.log("nick:", nickname);
        }
      } catch (error) {
        toast.error('Error fetching data');
      }
    };
    getnickname();
}, []);
  
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
            className={`p-1 ${showBar ? '' : 'hidden'}  w-full h-[5%] border border-gray-300 text-black 
             focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-transparent fixed xs:mt-[4%] md:mt-[1%] left-0 right-0 z-10`}
          />
        </div>
        <Link href={`http://localhost:3000/profile/${nickname}`}>
          <img
              className="h-8 w-auto rounded-full mr-2"
              src={profilePic}
              alt="Logo"
              width={100}
              height={40}
          />
        </Link>
      </div>
    </div>
    <div className={`${(search ) ? 'block' : 'hidden'} lg:hidden xl:hidden flex justify-start
          md:mt-[15%] mt-[26%]  absolute w-screen bg-white shadow-md transition-transform duration-300 z-10 rounded-b-lg`}>
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
    <nav className={`flex flex-col lg:ml-2 lg:mt-2 xl:mt-2 lg:block md:mt-20 mt-[6vh] fixed lg:h-[98%] h-[94%] bg-nav w-15 ${show ? '' : 'hidden'} lg:rounded-xl border border-blackpink transition-transform duration-300 w-20`}>
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
            <Link href="/Dashboard" className={clsx(`flex items-center mt-15 justify-center mt-10 px-15 font-medium text-gray-400
               hover:text-accents`, {'text-accents'  : currentPath === "/Dashboard",
            })}>
              <HomeIcon className="w-10 ml-3 h-6 mr-4 xl:w-20 xl:h-20" />
            </Link>
            <Link href="/chat" className={clsx(`flex items-center mt-10 justify-center xl:mt-15 xl:w-20 xl:h-20 px-15 font-medium text-gray-400
              hover:text-accents`, {'text-accents'  : currentPath === "/chat",
            })}>
              <ChatBubbleBottomCenterIcon className="w-10 ml-3 h-6 mr-4 xl:w-20 xl:h-20" />
            </Link>
            <Link href="/Leaderboard" className={clsx(`flex items-center mt-15 justify-center xl:mt-15 mt-10 px-15 font-medium text-gray-400
              hover:text-accents`, {'text-accents'  : currentPath === "/Leaderboard",
            })}>
              <TrophyIcon className="w-10 h-6 ml-3 mr-4 xl:w-20 xl:h-20" />
            </Link>
            <Link href="/settings"
              className={clsx(`flex items-center mt-15 justify-center mt-10 xl:mt-15 px-15 font-medium text-gray-400 hover:text-accents`, {
              'text-accents'  : currentPath === "/Leaderboard",
              })}>
              <Cog6ToothIcon className="w-10 ml-3 h-6 mr-4 xl:w-20 xl:h-20" />
            </Link>
        </div>
        <div className="absolute bottom-5 justify-center text-gray-500 xl:mt-15 items-center flex w-full ">
          <Link href="http://localhost:8000/auth/signout" 
            className={clsx(`flex justify-center w-full 
            hover:text-accents`, {
          'text-accents'  : currentPath === "/",
          })}>
            <ArrowLeftOnRectangleIcon className="xl:w-[75%] lg:w-[60%] md:w-[50%] w-[50%]" />
          </Link>
        </div>
      </div>
    </nav>
    </div>
  );
}

export default (NavBar);