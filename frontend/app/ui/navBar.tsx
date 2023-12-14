'use client';
import { ArrowLeftOnRectangleIcon,
    Bars4Icon, BellIcon, ChatBubbleBottomCenterIcon,
    Cog6ToothIcon, HomeIcon, MagnifyingGlassIcon, TrophyIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Metadata } from "next"
import { Inter } from "next/font/google"
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {responseData} from "@/app/interfaces/interfaces";
import { useDebouncedCallback } from "use-debounce";
import { BellAlertIcon } from "@heroicons/react/20/solid";
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
  const [nickname, setNickname] = useState(''); 
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    const getnickname = async () => {
      try {
        const res = await fetch(`http://localhost:8000/user/Nickname`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          const nickname = await res.json();
          setNickname(nickname.nickname);
        }
      } catch (error) {
        setError('Error fetching data');
      }
    };
    getnickname();
  }, []);

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


  // Debounce the search function to avoid rapid API calls
  const debouncedSearchBackend = useDebouncedCallback(searchBackend, 500); // 500 milliseconds debounce time

  useEffect(() => {
    if (search) {
      debouncedSearchBackend(search);
    }
  }, [search, debouncedSearchBackend]);


  return (
  <div className={`${inter.className}`}>
    <div className="block lg:hidden bg-nav top-0 text-white md:w-screen h-[8vh] z-10 p-4 flex justify-between items-center border-indigo-600 fixed w-full ">
      <button className="text-white p-2 focus:outline-none">
          <Bars4Icon onClick={() => {setShow(!show); handleShowMenu(!show)}} className="w-6 h-6"/>
      </button>
      <div className="flex flex-row justify-between">
        <div className="mr-4">
          <BellIcon onClick={() => {setShowNotif(!showNotif)}} className="h-8 w-8 rounded-full" />
        </div>
        <div className="mr-4">
          <MagnifyingGlassIcon onClick={() => {setShowBar(!showBar)}} className="h-8 w-8 rounded-full" />
          {/* // show when clicked on search icon */}
          <input
            onChange={(e) => {setSearch(e.target.value); if (e.target.value) setSearchShow(true); else {setSearchShow(false); setRes([]);} }}
            type="search"
            placeholder="Search..."
            className={`p-1 ${showBar ? '' : 'hidden'}  w-full h-10 border border-gray-300 text-black 
             focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-transparent fixed mt-[2vh] left-0 right-0 z-10`}
          />
        </div>
        <Link href={`http://localhost:3000/profile/` + nickname }>
          <Image
              className="h-8 w-auto rounded-full mr-2"
              src="/logo.png"
              alt="Logo"
              width={100}
              height={40}
          />
        </Link>
      </div>
    </div>
      <div className={`${(searchShow || search) ? 'block' : 'hidden'} flex justify-start
            mt-[12vh] absolute lg:w-80 md:w-40 w-full bg-white shadow-md transition-transform duration-300 z-10 rounded-b-lg`}>
            <div className="flex flex-col"> 
              {searchShow && results.map((result) => (
                <Link href={`/user/${result.id}`} key={result.id}>
                  <div className="flex items-center p-2 hover:bg-gray-100 cursor-pointer z-10">
                    <img src={result.profilePic} alt="profile" className="w-10 h-10 rounded-full" />
                    <p className="ml-2">{result.nickname}</p>
                  </div>
                </Link>
              ))}
            </div>
        </div>
    <nav className={`flex flex-col lg:ml-2 lg:mt-2 lg:block mt-[8vh] fixed lg:h-[98%] h-[92vh] bg-nav w-20 ${show ? '' : 'hidden'} lg:rounded-xl border border-blackpink transition-transform duration-300 `}>
      <div className="flex flex-col flex-grow">
        <div className="flex items-center justify-center mt-6 h-16 w-10 mx-auto xl:h-30 xl:w-30 font-medium hover:opacity">
          <Image
            className="pointer-events-hover rounded-full border border-accents hover:opacity-80 border-[2px]" 
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
        <div className="absolute bottom-5 justify-center text-gray-500 xl:mt-15 items-center ml-1">
          <Link href="/logout" 
            className={clsx(`flex
            hover:text-accents`, {
          'text-accents'  : currentPath === "/Leaderboard",
          })}>
            <ArrowLeftOnRectangleIcon className="w-10 mr-4 xl:w-[80px] lg:w-[50px]" />
          </Link>
        </div>
      </div>
    </nav>
    </div>
  );
}

export default (NavBar);