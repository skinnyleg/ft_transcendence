'use client'
import { UserPlusIcon, UserMinusIcon, ChatBubbleLeftEllipsisIcon, NoSymbolIcon, HomeIcon } from "@heroicons/react/20/solid";
import {  } from "@heroicons/react/24/outline";
import { FaUserFriends } from "react-icons/fa";
import { SiAuthy } from "react-icons/si";
import { IoSettingsSharp } from "react-icons/io5";
import { Children, useContext, useEffect } from "react";
import { socketContext } from "@/app/context/soketContext";
import { useRouter } from "next/navigation";



interface DataProps {
  isfriend: boolean | undefined;
  privateProfile: boolean | undefined;
  userId: string | undefined;
  children?: React.ReactNode; // Include children in the type
}


const Conditional = ({isfriend, privateProfile, userId} : DataProps ) => {
    const router = useRouter();
    const socket = useContext(socketContext);
    const handleAddFriend = () => {
        console.log(userId, socket.connected);
        socket.emit("add-friend", {userId});
    }
    const handleDeleteFriend = () => {
        console.log(userId, socket.connected);
        socket.emit("remove-friend", {userId});
    }

    if (isfriend && !privateProfile)
    {
        return (
            <div className="flex flex-row mx-auto"> 
                <div className="flex hover:bg-white text-white px-2 text-sm lg:ml-6 xl:ml-10 rounded-full" onClick={handleAddFriend}>
                    <NoSymbolIcon className="text-button w-8 h-8"/>
                </div>
                <div className="flex hover:bg-white text-white text-sm rounded-full px-2 lg:ml-6 xl:ml-10" onClick={handleDeleteFriend}>
                    <UserMinusIcon className="text-button w-8 h-8"/>
                </div>
            </div>
        );
    }
    if (!isfriend && !privateProfile)
    {
        return (
            <div className="flex flex-row mx-auto">
                <div className="hover:bg-white text-white px-2 text-sm lg:ml-10 rounded-full" onClick={handleAddFriend}>
                    <NoSymbolIcon className="text-button w-8 h-8"/>
                </div>
                <div className="hover:bg-white text-white px-2 text-sm lg:ml-10 rounded-full" onClick={handleAddFriend}>
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
            <div className="hover:bg-white text-white text-sm rounded-full px-2 lg:ml-6 " onClick={() => {router.push("/settings")}}>
                <IoSettingsSharp className="text-button w-8 h-8"/>
            </div>
            <div className="hover:bg-white text-white px-2 text-sm lg:ml-10 rounded-full" onClick={() => {router.push("/Dashboard")}}>
                <HomeIcon className="text-button w-8 h-8" />
            </div>
        </div>
    );
}

export default Conditional;