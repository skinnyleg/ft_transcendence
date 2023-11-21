import { ChatBubbleBottomCenterIcon, CogIcon, LightBulbIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { GiPingPongBat } from "react-icons/gi";

export enum UserStatus {
    online = 'ONLINE',
    offline =  'OFFLINE',
    IN_GAME = 'IN_GAME'
}

interface FriendsData {
    friends: {
        id: string;
        profilePic: string;
        nickname: string;
        status: UserStatus;
    }[];
};


const data: FriendsData = {
    friends: [
        {
          id: "1",
          profilePic: "./yo.jpg",
          nickname: "Friend 1",
          status: UserStatus.online,
        },
        {
          id: "2",
          profilePic: "./yo1.jpg",
          nickname: "Friend 2",
          status: UserStatus.offline,
        },
        {
            id: "3",
            profilePic: "./42.jpg",
            nickname: "Friend 3",
            status: UserStatus.offline,
        },{
            id: "4",
            profilePic: "./42.jpg",
            nickname: "Friend 3",
            status: UserStatus.offline,
        },{
            id: "5",
            profilePic: "./42.jpg",
            nickname: "Friend 3",
            status: UserStatus.offline,
        },
        {
            id: "6",
            profilePic: "./42.jpg",
            nickname: "Friend 3",
            status: UserStatus.offline,
        },
        {
            id: "7",
            profilePic: "./42.jpg",
            nickname: "Friend 3",
            status: UserStatus.offline,
        },
    ]
    // Add more friend objects as needed
};
  
const jsonData = JSON.stringify({ data }, null, 3);

const FriendsList = ({friends} : FriendsData) => {

    return (
        <div className="bg-white p-2 rounded-md col-span-1 lg:col-span-2 lg:col-start-4 lg:col-end-6  
          row-start-5 row-end-6 lg:row-start-2 lg:row-end-4 lg:w-full lg:h-full h-[400px] shadow-md">
            <h4 className="text-xl font-bold mb-0">FRIENDS</h4>
            <div className="flex-col space-y-4 p-4 overflow-y-scroll h-5/6 w-full styled-scrollbar">
                {data.friends.map((friend) => (
                    <div key={friend.id} className="bg-white flex-row p-4 border rounded-md flex items-center justify-between">
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
                          <div className="flex">
                            
                            <button className="ml-2 bg-neonpink rounded-md px-2 py-1 text-white text-xs  lg:block md:block xs:hidden ">Challenge</button>
                            <GiPingPongBat  className="w-8 h-6 ml-2 hidden md:hidden xs:block" />
                            <button className="ml-2 bg-neonpink rounded-md px-2 py-1 text-white text-xs lg:block md:block xs:hidden ">Chat</button>
                            <ChatBubbleBottomCenterIcon className="w-8 h-6 ml-2 hidden md:hidden xs:block" />
                          </div>
                        </div>
                    ))}
            </div>
        </div>
    );

}

export default FriendsList;