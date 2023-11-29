'use client';
import { useDebouncedCallback } from 'use-debounce';
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { use, useEffect, useState } from "react";
import Link from 'next/link';
import Notifications from './Notification';

interface responseData {
    id: string;
    profilePic: string;
    nickname: string;
};

interface nickprop {nickname : string};

export default function TopBar ({nickname }: nickprop) {

  const [search, setSearch] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setRes] = useState<responseData[]>([]);

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
    <div className="flex lg:flex-row  justify-between flex-col mt-20 lg:mt-0 w-full bg-transparent p-0">
      <div className="lg:flex lg:justify-start">
        <h1 className="text-2xl font-bold">Welcome Back ....!</h1>
      </div>
      <div className="flex lg:justify-start relative">
        <MagnifyingGlassIcon className="h-8 w-8 p-2 rounded-full absolute top-1/2 left transform -translate-y-1/2" />
        <input
          onChange={(e) => {setSearch(e.target.value); if (e.target.value) setShow(true); else {setShow(false); setRes([]);} }}
          type="text"
          placeholder="Search..."
          className={`p-1 h-10 lg:w-80 border border-gray-300 pl-12 rounded-t-xl ${show ? '' : 'rounded-b-xl'} focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-transparent`}
        />
        <div className={`${(show || search) ? 'block' : 'hidden'} absolute top-10 w-80 bg-white shadow-md transition-transform duration-300 z-10 rounded-b-lg`}>
          <div className="flex flex-col">
            {show && results.map((result) => (
              <Link href={`/user/${result.id}`} key={result.id}>
                <div className="flex items-center p-2 hover:bg-gray-100 cursor-pointer z-10">
                  <img src={result.profilePic} alt="profile" className="w-10 h-10 rounded-full" />
                  <p className="ml-2">{result.nickname}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row pr-2 lg:space-x-4">
        {/* <Notifications  /> */}
        <Link href={`http://localhost:3000/profile/` + nickname }> {/* pass nickname for profile link */}
          <img src="/yo.jpg" alt="yo" className="w-10 h-10 rounded-full hidden lg:flex" />
        </Link>
      </div>
    </div>
  );
}