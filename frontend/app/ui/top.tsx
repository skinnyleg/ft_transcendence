'use client';
import { useDebouncedCallback } from 'use-debounce';
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { use, useContext, useEffect, useRef, useState } from "react";
import Link from 'next/link';
import Notifications from './Notification';
import {responseData, profileNickPic} from "@/app/interfaces/interfaces";
import { socket} from '../context/soketContext';
import { ContextProvider, picturesContext } from "../context/profilePicContext";

import { toast } from 'react-toastify';

export default function TopBar () {

  const [search, setSearch] = useState('');
  const [show, setShow] = useState(false);
  const [results, setRes] = useState<responseData[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
      setShow(false);
      setRes([]);
    }
  };

  useEffect(() => {
    // Attach the event listener when the component mounts
    document.addEventListener('click', handleClickOutside);
    // Detach the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

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
      toast.error('Error searching: ' + error);
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
  // console.log("1+++*========", profilePic)
  //   console.log("2+++*========", backgroundPic)
  //   console.log("3+++*========", nickname)
  return (
      <div className="flex lg:flex-row justify-between flex-col w-full bg-transparent">
          <div className="lg:flex md:hidden hidden xl:flex">
            <h1 className="lg:text-2xl text-gray-500 text-lg font-bold-800">Welcome Back ....!</h1>
          </div>
          <div className="relative lg:flex md:hidden hidden bg-accent" ref={searchRef}>
            <MagnifyingGlassIcon className="h-8 w-8 pl-3 rounded-full absolute top-1/3 left transform -translate-y-1/2" />
            <input
              onChange={(e) => {setSearch(e.target.value); if (e.target.value) setShow(true); else {setShow(false); setRes([]);} }}
              onAuxClickCapture={(e) =>{setSearch(''); setShow(false); setRes([]);}}
              type="search"
              placeholder="Search..."
              className={`p-2 lg:h-10 lg:w-80 md:w-40 w-80 mx-auto bg-accents h-6 border border-gray-300 lg:pl-12 md:pl-12 pl-4 text-white rounded-t-xl ${show ? '' : 'rounded-b-xl'} focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-transparent`}
            />
            <div className={`${(show || search) ? 'block' : 'hidden'} absolute top-10 lg:w-80 md:w-40 w-80 mx-auto bg-white shadow-md transition-transform duration-300 z-10 rounded-b-lg`}>
              <div className="flex flex-col">
                {show && results.map((result) => (
                  <Link href={`/profile/${result.nickname}`} key={result.nickname}>
                    <div className="flex items-center p-2 hover:bg-gray-100 cursor-pointer z-10">
                      <img src={result.profilePic} alt="profile" className="rounded-full w-10 h-10" />
                      <p className="ml-2">{result.nickname}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
            <div   className="lg:flex xl:flex md:hidden hidden pr-2 lg:space-x-4 ">
              <Notifications/>
                <Link rel="prefetch" href={`${process.env.NEXT_PUBLIC_FRONTEND_HOST}/profile/${nickname}`}>
                  <img src={profilePic} alt="yo" className="max-w-[50px] max-h-[50px] min-w-[50px] min-h-[50px] rounded-full border-accents border-[2px] hidden lg:flex" />
                </Link>
            </div> 
        </div>
  );
}