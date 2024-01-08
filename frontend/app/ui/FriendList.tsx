import { ChatBubbleBottomCenterIcon, CogIcon, LightBulbIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { GiPingPongBat } from "react-icons/gi";
import { UserStatus } from "@/app/interfaces/interfaces";
import { useContext, useEffect, useState } from "react";
import { chatSocketContext, socket, socketContext } from "../context/soketContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


interface FriendsData {
    id: string;
    profilePic: string;
    nickname: string;
    status: UserStatus;
}[];


const FriendsList = () => {
    const [friendsList, setFriendList] = useState<FriendsData[]>([]);
    const chatSocket = useContext(chatSocketContext);
    const socket = useContext(socketContext);
    const router = useRouter();


    const friendsGet = async() => {
    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/user/Friends`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });
        if (res.status === 200) {
            const data = await res.json();
            setFriendList(data)
        }
    } catch(error){
        toast.error(error as string);
    }
    }

    useEffect(() => {
    
    friendsGet();
    },[])

    
    useEffect(() => {
        const handleStatusChange = (stat : {id : string, status : UserStatus}) => {
          if (stat.status !== undefined) {
            setFriendList((prevFriendsList) => {
              return prevFriendsList.map((friend) => {
                if (friend.id === stat.id) {
                  return { ...friend, status: stat.status };
                }
                return friend;
              });
            });
          }
        };
        socket.on("statusChange", handleStatusChange);
        socket.on("refreshFriendsList", friendsGet);
        return () => {
          socket.off("statusChange", handleStatusChange);
          socket.off("refreshFriendsList", friendsGet)
        };
      }, [socket, setFriendList]);

      const sendMessage = (userId: string) => {
        console.log('here')
        chatSocket.emit('sendMsgDM', {
            receiverId : userId
        })
        chatSocket.on('redirect', (data: {dmId: string}) => {
            router.push(`/Chat?personal=${data.dmId}`)
        })
    }

    const redirectToProfile = (nickname: string) => {
        router.push(`/profile/${nickname}`)
    }

    const chunkedFriends = () => {
        const jsxElements = [];
        
        for (let index = 0; index < friendsList.length; index += 3) {
            var chunk: FriendsData[] = friendsList.slice(index, index + 3);
            
            jsxElements.push(
                    <div className="flex flex-row w-full h-1/3 gap-1 mt-10 md:mt-28 lg:mt-24 xl:mt-16">
                        {
                            chunk.map((friend) => (
                                <div  key={friend.id} className="bg-lightQuartze w-1/3 h-full p-2 border rounded-[15px] flex flex-col items-center justify-between">
                                <div className="flex items-center justify-center relative hover:cursor-pointer" onClick={() => redirectToProfile(friend.nickname)}>
                                    <img src={friend.profilePic} alt={`Friend ` + friend.id} className="w-6 h-6 md:w-8 md:h-8 xl:w-10 xl:h-10 lg:w-6 lg:h-6 rounded-full" />
                                    <span className={clsx(` h-2 w-2  xl:h-3 xl:w-3 rounded-full absolute transform translate-y-2 translate-x-[10px] xl:translate-y-3 xl:translate-x-[15px]`
                                    , {
                                        'bg-green-500'  : friend.status === UserStatus.online,
                                        'bg-red-500'    : friend.status === UserStatus.offline,
                                        'bg-yellow-500' : friend.status === UserStatus.IN_GAME,
                                        })}></span>
                                    </div>
                                    <div className="font-bold text-sm lg:text-lg xs:max-chars-5">
                                        {friend.nickname}
                                    </div>
                                    <div className="flex flex-row justify-evenly lg:justify-between items-center gap-0  w-full">
                                        <button className="bg-button rounded-md px-2 py-1 text-white text-xs lg:block md:block xs:hidden">Challenge</button>
                                        <GiPingPongBat  className="w-6 h-4 ml-0 hidden md:hidden text-button xs:block" />
                                        <button onClick={(e) => {sendMessage(friend.id)}} className="bg-button rounded-md px-2 py-1 text-white text-xs lg:block md:block xs:hidden">Chat</button>
                                        <ChatBubbleBottomCenterIcon className="w-6 h-4 hidden text-button md:hidden xs:block" onClick={(e) => {sendMessage(friend.id)}}/>
                                    </div>
                                </div>
                        ))
                    }
                </div>
            )
        }
        return (jsxElements)
    }

    return (
        <div className="bg-accents rounded-md col-span-1 lg:col-span-2 lg:col-start-4 lg:col-end-6  
        row-start-5 row-end-6 lg:row-start-2 lg:row-end-4 lg:w-full xl:w-full md:h-[350px] h-[350px] xl:h-[97%] lg:h-[97%] shadow-md">
                <h4 className="text-xl font-bold text-white p-4">FRIENDS</h4>
            <div className={`${(friendsList.length == 0) ? 'flex' : 'hidden'} w-full h-1/2  justify-center items-center`}><h5 className="text-bold-900 text-3xl">Go socialize</h5></div>
            <div className={`${(friendsList.length > 0) ? 'flex' : 'hidden'} flex-col  space-y-0 p-2 gap-2 justify-center overflow-y-scroll h-5/6  w-full styled-scrollbar`}>
                {chunkedFriends().map((jsxElement) => {
                    return (jsxElement);
                }) }
                </div>
        </div>
    );

}

export default FriendsList;