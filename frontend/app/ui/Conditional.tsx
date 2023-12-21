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
            <div className="flex flex-row rounded-3xl justify-between text-white mx-auto xl:w-[80%] w-[100%]">
                <div className="flex hover:bg-accents text-white px-2 text-sm rounded-full" onClick={handleAddFriend}>
                    <NoSymbolIcon className="text-button xl:w-8 xl:h-8 lg:w-8 lg:h-8 h-5 w-5 md:h-8 md:w-8"/>
                </div>
                <div className="flex hover:bg-accents text-white text-sm rounded-full px-2" onClick={handleDeleteFriend}>
                    <UserMinusIcon className="text-button xl:w-8 xl:h-8 lg:w-8 lg:h-8 h-5 w-5 md:h-8 md:w-8"/>
                </div>
                <div className="hover:bg-accents text-white text-sm rounded-full px-2" onClick={() => {}}>
                    <ChatBubbleLeftEllipsisIcon className="text-button xl:w-8 xl:h-8 lg:w-8 lg:h-8 h-5 w-5 md:h-8 md:w-8"/>
                </div>
            </div>
        );
    }
    if (!isfriend && !privateProfile)
    {
        return (
            <div className="flex flex-row rounded-3xl justify-between text-white mx-auto xl:w-[80%] w-[100%]">
                <div className="flex hover:bg-accents text-white px-2 text-sm rounded-full" onClick={handleAddFriend}>
                    <NoSymbolIcon className="text-button xl:w-8 xl:h-8 lg:w-8 lg:h-8 h-5 w-5 md:h-8 md:w-8"/>
                </div>
                <div className="flex hover:bg-accents text-white text-sm rounded-full px-2" onClick={handleAddFriend}>
                    <UserPlusIcon className="text-button xl:w-8 xl:h-8 lg:w-8 lg:h-8 h-5 w-5 md:h-8 md:w-8"/>
                </div>
                <div className="hover:bg-accents text-white text-sm rounded-full px-2" onClick={() => {}}>
                    <ChatBubbleLeftEllipsisIcon className="text-button xl:w-8 xl:h-8 lg:w-8 lg:h-8 h-5 w-5 md:h-8 md:w-8"/>
                </div>
            </div>
        );
    }
    return (
        <div className="flex flex-row h-full justify-between items-center text-white w-[100%]">
            <div className="hover:bg-accents text-white items-center text-sm rounded-full px-2" onClick={() => {router.push("/settings")}}>
                <IoSettingsSharp className="text-button xl:w-8 xl:h-8 lg:w-8 lg:h-8 h-5 w-5 md:"/>
            </div>
            <div className="hover:bg-accents text-white items-center px-2 text-sm rounded-full" onClick={() => {router.push("/Dashboard")}}>
                <HomeIcon className="text-button xl:w-8 xl:h-8 lg:w-8 lg:h-8 h-5 w-5 md:" />
            </div>
        </div>
    );
}

export default Conditional;