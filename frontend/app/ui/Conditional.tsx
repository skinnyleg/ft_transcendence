'use client'
import { UserPlusIcon, } from "@heroicons/react/20/solid";
import {  UserMinusIcon, ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { FaUserFriends } from "react-icons/fa";
import { SiAuthy } from "react-icons/si";
import { IoSettingsSharp } from "react-icons/io5";
import { Children } from "react";
import { Socket } from "socket.io-client";


interface DataProps {
  isfriend: boolean | undefined;
  privateProfile: boolean | undefined;
  children?: React.ReactNode; // Include children in the type
}


const Conditional = ({isfriend, privateProfile} : DataProps ) => {
    if (isfriend && !privateProfile)
    {
        return (
            <div className="flex flex-row mx-auto"> 
                <div className="flex hover:bg-white text-white px-3 text-sm lg:ml-10 xl:ml-10 rounded-full" onClick={() => {}}>
                    <FaUserFriends className="text-button w-8 h-8"/>
                </div>
                <div className="flex hover:bg-white text-white text-sm rounded-full px-2 lg:ml-6 xl:ml-10" onClick={() => {}}>
                    <UserMinusIcon className="text-red-500 w-8 h-8"/>
                </div>
            </div>
        );
    }
    if (!isfriend && !privateProfile)
    {
        return (
            <div className="flex flex-row mx-auto">
                <div className="hover:bg-white text-white px-3 text-sm lg:ml-10 rounded-full" onClick={() => {}}>
                    <UserPlusIcon className="text-button w-8 h-8"/>
                </div>
                <div className="hover:bg-white text-white text-sm rounded-full px-2 lg:ml-6 " onClick={() => {}}>
                    <ChatBubbleLeftEllipsisIcon className="text-button w-8 h-8"/>
                </div>
            </div>
        );
    }
    return (
        <div className="flex flex-row mx-auto">
            <div className="hover:bg-white text-white px-3 text-sm lg:ml-10 rounded-full" onClick={() => {}}>
                <SiAuthy className="text-button w-8 h-8"/>
            </div>
            <div className="hover:bg-white text-white text-sm rounded-full px-2 lg:ml-6 " onClick={() => {}}>
                <IoSettingsSharp className="text-button w-8 h-8"/>
            </div>
        </div>
    );
}

export default Conditional;