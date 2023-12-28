'use client'
import { UserPlusIcon, UserMinusIcon, ChatBubbleLeftEllipsisIcon, NoSymbolIcon, HomeIcon } from "@heroicons/react/20/solid";
import {  } from "@heroicons/react/24/outline";
import { CiUnlock } from "react-icons/ci";
import { IoSettingsSharp } from "react-icons/io5";
import { Children, useContext, useEffect } from "react";
import { chatSocketContext, socketContext } from "@/app/context/soketContext";
import { useRouter } from "next/navigation";



interface DataProps {
  isfriend: boolean | undefined;
  privateProfile: boolean | undefined;
  isBlocked: boolean | undefined;
  userId: string | undefined;
  children?: React.ReactNode; // Include children in the type
}


const Conditional = ({isfriend, privateProfile, userId, isBlocked} : DataProps ) => {
    const router = useRouter();
    const socket = useContext(socketContext);
    const chatSocket = useContext(chatSocketContext);

    // Events Emiter
    const handleAddFriend = () => {
        console.log(userId, socket.connected);
        socket.emit("add-friend", {userId});
    }
    const handleDeleteFriend = () => {
        console.log(userId, socket.connected);
        socket.emit("remove-friend", {userId});
    }

    const handleBlockUser  = () => {
        socket.emit("block-friend", {userId});
    }

    const handleUnblockUser = () => {
        socket.emit("unblock-friend", {userId});
    }

    const sendMessage = () => {
        console.log('here')
        chatSocket.emit('sendMsgDM', {
            receiverId : userId
        })
        router.push('/Chat')
    }

    if (isfriend && !privateProfile)
    {
        if (isBlocked){
            return (
                <div className="flex flex-row rounded-3xl justify-evenly items-center text-white mx-auto h-full xl:w-[80%] w-[100%]">
                    <div className={`flex text-white px-2 text-sm rounded-full hover:cursor-pointer`} onClick={handleUnblockUser}>
                        <CiUnlock className="text-button xl:w-8 xl:h-8 lg:w-8 lg:h-8 h-5 w-5 md:h-8 md:w-8"/>
                    </div>
                    <div className="flex  text-white text-sm rounded-full px-2 hover:cursor-pointer" onClick={handleDeleteFriend}>
                        <UserMinusIcon className="text-button xl:w-8 xl:h-8 lg:w-8 lg:h-8 h-5 w-5 md:h-8 md:w-8"/>
                    </div>
                    <div className=" text-white text-sm rounded-full px-2 pr-1 hover:cursor-pointer" onClick={sendMessage}>
                        <ChatBubbleLeftEllipsisIcon className="text-button xl:w-8 xl:h-8 lg:w-8 lg:h-8 h-5 w-5 md:h-8 md:w-8"/>
                    </div>
                </div>
            );
        }
        return (
            <div className="flex flex-row rounded-3xl justify-evenly items-center text-white mx-auto h-full xl:w-[80%] w-[100%]">
                <div className={`flex text-white px-2 text-sm rounded-full hover:cursor-pointer`} onClick={handleBlockUser}>
                    <NoSymbolIcon className="text-button xl:w-8 xl:h-8 lg:w-8 lg:h-8 h-5 w-5 md:h-8 md:w-8"/>
                </div>
                <div className="flex  text-white text-sm rounded-full px-2 hover:cursor-pointer" onClick={handleDeleteFriend}>
                    <UserMinusIcon className="text-button xl:w-8 xl:h-8 lg:w-8 lg:h-8 h-5 w-5 md:h-8 md:w-8"/>
                </div>
                <div className=" text-white text-sm rounded-full px-2 pr-1 hover:cursor-pointer" onClick={sendMessage}>
                    <ChatBubbleLeftEllipsisIcon className="text-button xl:w-8 xl:h-8 lg:w-8 lg:h-8 h-5 w-5 md:h-8 md:w-8"/>
                </div>
            </div>
        );
    }
    if (!isfriend && !privateProfile)
    {
        if (isBlocked){
            return (
                <div className="flex flex-row rounded-3xl justify-evenly items-center text-white mx-auto text-center xl:w-[80%] w-[100%]">
                    <div className={`${isBlocked ? 'hidden' : ''}flex text-white px-2 text-sm rounded-full hover:cursor-pointer`} onClick={handleUnblockUser}>
                        <CiUnlock className="text-button xl:w-8 xl:h-8 lg:w-8 lg:h-8 h-5 w-5 md:h-8 md:w-8"/>
                    </div>
                    <div className="flex  text-white text-sm rounded-full px-2 hover:cursor-pointer" onClick={handleAddFriend}>
                        <UserPlusIcon className="text-button xl:w-8 xl:h-8 lg:w-8 lg:h-8 h-5 w-5 md:h-8 md:w-8"/>
                    </div>
                    <div className=" text-white text-sm rounded-full px-2 hover:cursor-pointer" onClick={sendMessage}>
                        <ChatBubbleLeftEllipsisIcon className="text-button xl:w-8 xl:h-8 lg:w-8 lg:h-8 h-5 w-5 md:h-8 md:w-8 pr-1"/>
                    </div>
                </div>
            );
        }
        return (
            <div className="flex flex-row rounded-3xl justify-evenly items-center text-white mx-auto text-center xl:w-[80%] w-[100%]">
                <div className={`${isBlocked ? 'hidden' : ''}flex text-white px-2 text-sm rounded-full hover:cursor-pointer`} onClick={handleBlockUser}>
                    <NoSymbolIcon className="text-button xl:w-8 xl:h-8 lg:w-8 lg:h-8 h-5 w-5 md:h-8 md:w-8"/>
                </div>
                <div className="flex  text-white text-sm rounded-full px-2 hover:cursor-pointer" onClick={handleAddFriend}>
                    <UserPlusIcon className="text-button xl:w-8 xl:h-8 lg:w-8 lg:h-8 h-5 w-5 md:h-8 md:w-8"/>
                </div>
                <div className=" text-white text-sm rounded-full px-2 hover:cursor-pointer" onClick={sendMessage}>
                    <ChatBubbleLeftEllipsisIcon className="text-button xl:w-8 xl:h-8 lg:w-8 lg:h-8 h-5 w-5 md:h-8 md:w-8 pr-1"/>
                </div>
            </div>
        );
    }
    return (
        <div className="flex flex-row mx-auto justify-evenly items-center text-white w-[100%]">
            <div className=" text-white text-sm rounded-full px-2 " onClick={() => {router.push("/settings")}}>
                <IoSettingsSharp className="text-button xl:w-8 xl:h-8 lg:w-8 lg:h-8 h-5 w-5 md:h-8 md:w-8 "/>
            </div>
            <div className="text-white text-sm px-2 rounded-full" onClick={() => {router.push("/Dashboard")}}>
                <HomeIcon className="text-button xl:w-8 xl:h-8 lg:w-8 lg:h-8 h-5 w-5 md:h-8 md:w-8 " />
            </div>
        </div>
    );
}

export default Conditional;