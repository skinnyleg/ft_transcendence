'use client';
import TopBar from "@/app/ui/top";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { profileData } from "@/app/interfaces/interfaces";
import { ArrowTrendingUpIcon, TrophyIcon, ChatBubbleBottomCenterIcon, HandThumbUpIcon, UserPlusIcon, HandRaisedIcon, HandThumbDownIcon } from "@heroicons/react/20/solid";
import { ArrowTrendingDownIcon,  ChatBubbleLeftEllipsisIcon, WalletIcon } from "@heroicons/react/24/outline";
import { Progress } from "@nextui-org/react";
import withAuth from "@/app/withAuth";
import ProgressBar from "@/app/ui/progressBar";

const matchHistory = [{
    id : "25/12/2024",
    winner : {
        nickname:"player 1",
        profilePic:"url",
    },
    loser : {
        nickname : "player2",
        profilePic : "url",
    },
    winnerScore : 2,
    loserScore : 1,
    isMeWhoWon : true,
},
{
    id : "26/12/2024",
    winner : {
        nickname:"player 1",
        profilePic:"url",
    },
    loser : {
        nickname : "player2",
        profilePic : "url",
    },
    winnerScore : 2,
    loserScore : 1,
    isMeWhoWon : false,

},
{
    id : "26/2/2424",
    winner : {
        nickname:"player 1",
        profilePic:"url",
    },
    loser : {
        nickname : "player2",
        profilePic : "url",
    },
    winnerScore : 2,
    loserScore : 1,
    isMeWhoWon : true,
},
{
    id : "26/1/2424",
    winner : {
        nickname:"med-doba",
        profilePic:"url",
    },
    loser : {
        nickname : "yimazoua",
        profilePic : "url",
    },
    winnerScore : 2,
    loserScore : 1,
    isMeWhoWon : false,
}]

const Profile = () => {

    const [isFriend, setIsFriend] = useState<boolean | undefined>(false);
    const [isprivateProfile, setisprivateProfile] = useState<boolean | undefined>(false);
    const pathname = usePathname();
    const [profileData, setProfileData] = useState<profileData | undefined>(undefined);
    let nickname : string = pathname.split("/")[2];
    console.log(nickname);

    useEffect(() => {
        const getProfileData = async () => {
            try {
                const res = await fetch(`http://localhost:8000/user/profile/${nickname}`, {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                });
                if (res.ok) {
                    const profileData = await res.json();
                    console.log(profileData);
                    setProfileData(profileData);
                }
            } catch (error) {
                console.error("Error during authentication check:", error);
            }
        };
        getProfileData();
        setIsFriend(profileData?.isfriend);
        setisprivateProfile(profileData?.privateProfile);
    }, []);
    var level : number = profileData?.userData?.level;

    return (
    <main className="flex flex-col">
        <TopBar nickname={nickname}/>
        <div className="grid grid-cols-4 lg:auto-rows-min gap-2 w-full mt-4 md:grid-row-6 grid-row-6 ">
            <div className="bg-white relative col-start-1 col-end-5 h-[250px] row-start-1 row-end-2 w-full w-full shadow-md rounded-xl">
                <div className="flex flex-col rounded-xl h-[250px]" style={{backgroundImage: `url(${profileData?.userData.BackgroundPic})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
                    <h1 className="pt-20 mt-10 p-5 text-5xl text-white text-bold-900">{profileData?.userData.nickname}</h1>
                </div>
                <div  className="rounded-full lg:w-[80px] w-[60px] lg:h-22 h-15 absolute bottom-0 left-0 transform  translate-x-[8px] translate-y-[32px] border-2">
                    <img src={profileData?.userData.profilePic} alt="profile Picture" className="rounded-full lg:w-20 lg:h-20 w-15 h-15 rounded-full" />
                </div>
            </div>
            <div className="bg-lightblue lg:col-start-2 lg:col-end-4 w-full lg:row-start-2 lg:mt-0 mt-10 lg:row-end-3 col-start-1 col-end-4 row-start-3 row-end-4
            h-[30px] rounded-2xl lg:w-[100%] w-full flex shadow-md">
                <ProgressBar level={level} />
            </div>
            <div className="relative col-start-4 col-end-5 mt-10 mb-1 lg:mt-0 lg:row-start-2 h-[30px] lg:row-end-3 row-start-3 row-end-4 flex w-full shadow-md rounded-xl">
                <div className="hover:bg-white text-white px-3 text-sm lg:ml-10 rounded-full" onClick={() => {}}>
                    <UserPlusIcon className="text-green-500 w-8 h-8"/>
                </div>
                <div className="hover:bg-white text-white text-sm rounded-full px-2 lg:ml-6 " onClick={() => {}}>
                    <ChatBubbleLeftEllipsisIcon className="text-green-500 w-8 h-8"/>
                </div>    
            </div>
            {/* 4 cards */}
            <div  className="bg-lightblue col-span-1 lg:row-start-3 row-start-4 row-end-5 flex justify-between lg:row-end-4 w-full h-[100px] shadow-md rounded-xl">
                <div className="flex lg:flex-row flex-col">
                    <WalletIcon width={50} height={50} className="text-red-500 text-2xl mt-4 lg:ml-2 md:ml-2 ml-0"/>
                    <p className="lg:text-2xl lg:block md:block hidden text-lg text-center lg:w-20 w-10 lg:ml-5 ml-7 pb-2 lg:mt-6 mt-3 text-bold-700">wallet</p>
                </div>
                <h2 className="lg:text-5xl md:text-3xl text-lg text-center lg:mt-5 md:mt-4 mt-7 text-bold-700 mr-3 md:mr-6 lg:mr-10">{profileData?.userData.wallet}</h2>
            </div>
            <div  className="bg-lightblue col-span-1 flex justify-between lg:row-start-3 row-start-4 row-end-5 lg:row-end-4 w-full h-[100px] shadow-md rounded-xl">
                <div className="flex lg:flex-row flex-col">
                    <TrophyIcon width={50} height={50} className="text-red-500 text-2xl mt-4 lg:ml-2 md:ml-2 ml-0"/>
                    <p className="lg:text-2xl lg:block md:block hidden text-lg text-center lg:w-20 w-10 lg:ml-5 ml-7 pb-2 lg:mt-6 mt-3 text-bold-700">Rank</p>
                </div>
                <h2 className="lg:text-5xl md:text-3xl text-lg text-center lg:mt-4 md:mt-4 mt-7 text-bold-700 mr-3 md:mr-6 lg:mr-10">{/*profileData?.userData.Rank*/}5</h2>
            </div>
            <div className="bg-lightblue col-span-1 lg:row-start-3 row-start-4 row-end-5 lg:row-end-4 w-full h-[100px] shadow-md flex justify-between rounded-xl">
                <HandThumbUpIcon width={150} height={100} className="text-green-500 text-2xl"/>
                <span className="center text-green-500 text-bold mt-5 lg:mr-20 mr-5 ml-2 lg:text-5xl text-3xl" >2</span>
            </div>
            <div  className="bg-lightblue col-span-1 lg:row-start-3 row-start-4 row-end-5 lg:row-end-4 w-full h-[100px] shadow-md flex justify-between rounded-xl">
                <HandThumbDownIcon width={150} height={100} className="text-red-500 text-2xl"/>
                <span className="center text-green-500 text-bold mt-5 lg:mr-20 mr-5 ml-2 lg:text-5xl text-3xl" >2</span>
            </div>
            <div className="bg-lightblue overflow-y-scroll overflow-y-auto styled-scrollbar lg:col-span-2 col-span-4 lg:row-start-4 lg:row-end-5 row-start-5 row-end-6 w-full h-[280px] shadow-md rounded-xl">
                <div className="lg:w-[80%] w-[98%] mt-5 mx-auto">
                    {matchHistory.map((match) => {
                        return (
                        <div key={match.id} className="flex flex-col border border-[#69B02d] rounded-xl w-full mt-2">
                            <div className="flex flex-row justify-between">
                                <div className="flex flex-row m-3">
                                    <img src="/yo.jpg" alt="profilePic" className="rounded-full w-10 h-10 rounded-full" />
                                    <h2 className="text-bold m-1 lg:ml-5 md:ml-5 ml-1 lg:text-lg md:text-lg text-sm ">{match.winner.nickname}</h2>
                                </div>
                                <div className="flex flex-col m-0">
                                    <span className="text-bold text-center mt-2 text-sm">{match.isMeWhoWon ? `won` : `lose`}</span>  
                                    <div className="flex flex-row justify-between border border-white rounded-xl w-[50px] mb-2 h-[30px] bg-signin text-white">
                                        <h2 className="text-bold ml-2 text-xl">{match.winnerScore}</h2>
                                        <h2 className="text-bold text-xl">:</h2>
                                        <h2 className="text-bold mr-2 text-xl">{match.loserScore}</h2>
                                    </div>
                                </div>
                                <div className="flex flex-row-reverse m-3">
                                    <img src="/yo1.jpg" alt="profilePic" className="rounded-full w-10 h-10 rounded-full" />
                                    <h2 className="text-bold m-2 lg:mr-5 md:mr-5 mr-1 lg:text-lg md:text-lg text-sm" >{match.loser.nickname}</h2>
                                </div>
                            </div>
                        </div>
                        )
                    })}
                </div>
            </div>
            <div className="bg-lightblue lg:col-span-2 col-span-4 lg:row-start-4 lg:row-end-5 row-start-6 row-end-7 w-full h-[280px] shadow-md rounded-xl"> match history </div>
        </div>
    </main>
    );

}

export default withAuth (Profile);