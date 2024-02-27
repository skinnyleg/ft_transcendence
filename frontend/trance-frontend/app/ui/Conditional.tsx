'use client'
import { UserPlusIcon, UserMinusIcon, ChatBubbleLeftEllipsisIcon, NoSymbolIcon, HomeIcon } from "@heroicons/react/20/solid";
import { CiUnlock } from "react-icons/ci";
import { IoSettingsSharp } from "react-icons/io5";
import { Children, Dispatch, ElementType, SetStateAction, useContext, useEffect, useState } from "react";
import { chatSocketContext, socketContext } from "@/app/context/soketContext";
import { useRouter } from "next/navigation";
import { IconWithTooltip } from "./CustomIcons";
import { FriendStatusContext } from "../context/profileContext";
import Enable2FA from "./Enable2FA";
import { profileData } from "../interfaces/interfaces";
import EditSettings from "./EditSettings";



interface DataProps {
  isfriend: boolean | undefined;
  privateProfile: boolean | undefined;
  isBlocked: boolean | undefined;
  userId: string | undefined;
  profileData: profileData;
  children?: React.ReactNode; // Include children in the type
  setUserNickname: Dispatch<SetStateAction<string | undefined>>;
  setUserProfilePic: Dispatch<SetStateAction<string | undefined>>;
  setUserBackPic: Dispatch<SetStateAction<string | undefined>>;
  userNickname: string | undefined;
  userProfilePic: string | undefined;
  userBackPic: string | undefined;
}


const Conditional = ({isfriend, privateProfile, userId, isBlocked, profileData , userNickname, userProfilePic, userBackPic, setUserNickname, setUserProfilePic, setUserBackPic} : DataProps ) => {
    const router = useRouter();
    const socket = useContext(socketContext);
    const chatSocket = useContext(chatSocketContext);
    const [friendIcon, setFriendIcon] = useState<boolean | undefined>();
    const [blockIcon, setBlockIcon] = useState<boolean | undefined>();

    useEffect(() => {
        setFriendIcon(isfriend);
        setBlockIcon(isBlocked)
        
    }, [isfriend, isBlocked])


    useEffect(() => {
        socket.on('refreshFriendIcon', (data: {val: boolean}) => {
            setFriendIcon(data.val);
        })
        socket.on('refreshBlockIcon', (data: {val:boolean}) => {
            setBlockIcon(data.val);
        })
        return () => {
            socket.off('refreshFriendIcon')
            socket.off('refreshBlockIcon')
        }
    }, [socket])

    // Events Emiter
    const handleAddFriend = () => {
        socket.emit("add-friend", {userId});
    }
    const handleDeleteFriend = () => {
        socket.emit("remove-friend", {userId});
    }

    const handleBlockUser  = () => {
        socket.emit("block-friend", {userId});
    }

    const handleUnblockUser = () => {
        socket.emit("unblock-friend", {userId});
    }

    const sendMessage = () => {
        chatSocket.emit('sendMsgDM', {
            receiverId : userId
        })

        chatSocket.on('redirect', (data: {dmId: string}) => {
            router.push(`/Chat`)
        })
    }
    if (!privateProfile)
    {
        return (
            <div className="flex flex-row rounded-3xl justify-evenly items-center text-white mx-auto  h-full xl:w-[80%] w-[100%]">
                <div className={`flex text-white text-sm rounded-full hover:cursor-pointer`} onClick={() => {blockIcon ? handleUnblockUser() : handleBlockUser()}}>
                    {
                        blockIcon ? (
                            <IconWithTooltip
                                icon={CiUnlock}
                                styles='text-button xl:w-8 xl:h-8 lg:w-8 lg:h-8 h-5 w-5 md:h-8 md:w-8'
                                tooltipId="UnblockToolTip"
                                tooltipContent="Unblock"
                            />
                        ) : (
                            <IconWithTooltip
                            icon={NoSymbolIcon}
                            styles='text-button xl:w-8 xl:h-8 lg:w-8 lg:h-8 h-5 w-5 md:h-8 md:w-8'
                            tooltipId="UnblockToolTip"
                            tooltipContent="Unblock"
                        />
                        )
                    }
                </div>
                <div className="flex  text-white text-sm rounded-full hover:cursor-pointer" onClick={() => {friendIcon ? handleDeleteFriend(): handleAddFriend()}}>
                {
                        friendIcon ? (
                            <IconWithTooltip
                                icon={UserMinusIcon}
                                styles='text-button xl:w-8 xl:h-8 lg:w-8 lg:h-8 h-5 w-5 md:h-8 md:w-8'
                                tooltipId="UnfriendToolTip"
                                tooltipContent="Unfriend"
                            />
                        ) : (
                            <IconWithTooltip
                            icon={UserPlusIcon}
                            styles='text-button xl:w-8 xl:h-8 lg:w-8 lg:h-8 h-5 w-5 md:h-8 md:w-8'
                            tooltipId="AddToolTip"
                            tooltipContent="Add Friend"
                        />
                        )
                    }
                </div>
                <div className=" text-white text-sm rounded-full pr-1 hover:cursor-pointer" onClick={sendMessage}>
                    <IconWithTooltip
                        icon={ChatBubbleLeftEllipsisIcon}
                        styles='text-button xl:w-8 xl:h-8 lg:w-8 lg:h-8 h-5 w-5 md:h-8 md:w-8'
                        tooltipId="SendMessageToolTip"
                        tooltipContent="Send Message"
                    />
                </div>
            </div>
        );
    }

 
    return (
        // <div className="flex flex-row mx-auto justify-evenly items-center text-white w-[100%]">
        //     <div className=" text-white text-sm rounded-full hover:cursor-pointer" onClick={() => {router.push("/settings")}}>
        //         <IconWithTooltip
        //             icon={IoSettingsSharp}
        //             styles='text-button xl:w-8 xl:h-8 lg:w-8 lg:h-8 h-5 w-5 md:h-8 md:w-8'
        //             tooltipId="SettingsToolTip"
        //             tooltipContent="Settings"
        //         />
        //     </div>
        //     <div className="text-white text-sm rounded-full hover:cursor-pointer" onClick={() => {router.push("/Dashboard")}}>
        //         <IconWithTooltip
        //             icon={HomeIcon}
        //             styles='text-button xl:w-8 xl:h-8 lg:w-8 lg:h-8 h-5 w-5 md:h-8 md:w-8'
        //             tooltipId="HomeToolTip"
        //             tooltipContent="Home"
        //         />
        //     </div>
        // </div>
        <div className="w-full rounded-2xl h-full flex flex-row gap-1">
            <Enable2FA 
                userPic={profileData.userData.profilePic}
            />
            <EditSettings
                userPic={userProfilePic}
                backPic={userBackPic}
                nick={userNickname}
                setUserNickname={setUserNickname}
                setUserProfilePic={setUserProfilePic}
                setUserBackPic={setUserBackPic}
            />
            {/* <button className="rounded-r-2xl w-[50%] bg-[#75E6DA]">EDIT</button> */}
        </div>
    );
}

export default Conditional;