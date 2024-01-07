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
    const router = useRouter();



    useEffect(() => {
    
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
        return () => {
          socket.off("statusChange", handleStatusChange);
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

    return (
        <div className="bg-accents rounded-md col-span-1 lg:col-span-2 lg:col-start-4 lg:col-end-6  
        row-start-5 row-end-6 lg:row-start-2 lg:row-end-4 lg:w-full xl:w-full md:h-[350px] h-[350px] xl:h-[507px] lg:h-[507px] shadow-md">
            <h4 className="text-xl font-bold text-white p-4">FRIENDS</h4>
            <div className={`${(friendsList.length == 0) ? 'block' : 'hidden'}  w-full h-1/2 mt-20`}><h5 className="w-1/2 mt-10 mx-auto text-bold-900 text-3xl">Go socialize</h5></div>
            <div className={`${(friendsList.length > 0) ? 'block' : 'hidden'} flex-col space-y-4 p-4 items-center overflow-y-scroll h-5/6 w-full styled-scrollbar`}>
                {friendsList.map((friend) => (
                    <div  key={friend.id} className="bg-lightQuartze flex-row p-4 border rounded-md flex justify-between">
                        <div className="flex items-center">
                            <img src={friend.profilePic} alt={`Friend ` + friend.id} className="w-10 h-10 ml-1 rounded-full" />
                            <span className={clsx(`h-3 w-3 rounded-full relative transform translate-y-3 translate-x-[-10px]`
                            , {
                            'bg-green-500'  : friend.status === UserStatus.online,
                            'bg-red-500'    : friend.status === UserStatus.offline,
                            'bg-yellow-500' : friend.status === UserStatus.IN_GAME,
                            })}></span>
                            <div className="ml-2">
                            <div className="font-bold text-md xs:max-chars-5">
                                {friend.nickname}</div>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-center gap-2">
                            <button className="bg-button rounded-md px-2 py-1 text-white text-xs lg:block md:block xs:hidden">Challenge</button>
                            <GiPingPongBat  className="w-8 h-6 ml-2 hidden md:hidden text-button xs:block" />
                            <button onClick={(e) => {sendMessage(friend.id)}} className="bg-button rounded-md px-2 py-1 text-white text-xs lg:block md:block xs:hidden">Chat</button>
                            <ChatBubbleBottomCenterIcon className="w-8 h-6 hidden text-button md:hidden xs:block" onClick={(e) => {sendMessage(friend.id)}}/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

}

export default FriendsList;