'use client';
import { useDebouncedCallback } from 'use-debounce';
import { BellAlertIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { use, useEffect, useState } from "react";

export default function TopBar () {

  const [search, setSearch] = useState('');

  const searchBackend = async (query: string) => {
    try {
      const results = await fetch(`http://localhost:8000/search?query=${query}`);
      const data = await results.json();
      console.log(data);
    } catch (error) {
      console.error('Error searching:', error);
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
      <div className=" lg:flex lg:justify-start flex-row-reverse">
        <MagnifyingGlassIcon className="h-10 hidden lg:flex w-10 p-2 bg-gray-100 rounded-full" />
        <input
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search..."
          className="p-1 h-10 hidden lg:flex border border-gray-300 w-80 rounded-full"
        />
      </div>
      <div className="flex flex-col lg:flex-row pr-2 lg:space-x-4">
        <BellAlertIcon className="h-10 hidden lg:flex w-10 p-2 bg-gray-100 rounded-full" />
        <img src="/yo.jpg" alt="yo" className="w-10 h-10 rounded-full hidden lg:flex" />
      </div>
    </div>
  );
}