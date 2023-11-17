'use client';

import { BellAlertIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function TopBar () {
    return (
        <div className="flex lg:flex-row justify-between flex-col md:mt-20 lg:mt-0 w-full bg-transparent p-0 rounded-md">
            <div className="lg:w-1/2">
              <h1 className="text-2xl font-bold">Welcome Back ....!</h1>
            </div>

            <div className="lg:w-1/2 lg:flex lg:justify-end">
              <div className="flex flex-col lg:flex-row pr-2 lg:space-x-4">
                <BellAlertIcon className="h-10 hidden lg:flex w-10 p-2 bg-gray-100 rounded-full" />
              </div>
              <MagnifyingGlassIcon className="h-10 hidden lg:flex w-10 p-2 bg-gray-100 rounded-full" />
              <input
                type="text"
                placeholder="Search..."
                className="p-1 h-10 hidden lg:flex border border-gray-300 w-40 rounded-full"
              />
            </div>
        </div>
    );
}