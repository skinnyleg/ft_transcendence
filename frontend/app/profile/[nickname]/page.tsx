'use client';
import TopBar from "@/app/ui/top";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { profileData } from "@/app/interfaces/interfaces";
import { ArrowTrendingUpIcon, TrophyIcon,  HandThumbUpIcon, UserPlusIcon, HandRaisedIcon, HandThumbDownIcon } from "@heroicons/react/20/solid";
import { ArrowTrendingDownIcon,  ChatBubbleLeftEllipsisIcon, UserMinusIcon, WalletIcon } from "@heroicons/react/24/outline";
import { FaUserFriends } from "react-icons/fa";
import withAuth from "@/app/withAuth";
import ProgressBar from "@/app/ui/progressBar";
import Conditional from "@/app/ui/Conditional";

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
    <main className="flex flex-col h-screen">
        <TopBar />
        <div className="grid grid-cols-4 xl:mt-5 lg:auto-rows-min xl:gap-5 gap-4 w-full mt-4 md:grid-row-6 grid-row-6 ">
            <div className="bg-white relative col-start-1 col-end-5 xl:h-[400px] h-[400px] row-start-1 row-end-2 w-full w-full shadow-md rounded-xl">
                <div className="flex flex-col rounded-xl  lg:h-[400px]" style={{backgroundImage: `url(${profileData?.userData.BackgroundPic})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
                    <h1 className="pt-20 mt-10 p-5 text-5xl text-white text-bold-900">{profileData?.userData.nickname}</h1>
                </div>
                <div  className="rounded-full lg:w-[80px] w-[60px] xl:h-[150px] xl:w-[150px] lg:h-22 h-15 absolute bottom-0 left-0 transform  xl:translate-x-[10px] xl:translate-y-[55px] translate-x-[8px] translate-y-[32px] border-2">
                    <img src={profileData?.userData.profilePic} alt="profile Picture" className="rounded-full lg:w-20 lg:h-20 xl:w-[150px] xl:h-[150px] w-15 h-15 rounded-full" />
                </div>
            </div>
            <div className="bg-lightblue lg:col-start-2 lg:col-end-4 w-full lg:row-start-2 lg:mt-0 mt-10 lg:row-end-3 col-start-1 col-end-4 row-start-3 row-end-4
            h-[30px] xl:h-[40px] rounded-2xl lg:w-[100%] w-full flex shadow-md">
                <ProgressBar level={level} />
            </div>
            <div className="relative col-start-4 col-end-5 mt-10 mb-1 lg:mt-0 lg:row-start-2 xl:h-[70px] h-[30px] lg:row-end-3 row-start-3 row-end-4 flex w-full shadow-md rounded-xl">
                <Conditional isfriend={profileData?.isfriend} privateProfile = {profileData?.privateProfile}/>
            </div>
            {/* 4 cards */}
            <div  className="bg-lightblue col-span-1 lg:row-start-3 row-start-4 row-end-5 flex justify-between lg:row-end-4 w-full xl:h-[150px] h-[150px] shadow-md rounded-xl">
                <div className="flex lg:flex-row flex-col h-full">
                    <WalletIcon className="text-red-500 xl:w-[100px] xl:h-[100px] lg:w-[80px] mb-4 md:w-[80px] w-[70px] xl:mt-8 mt-4 lg:ml-2 md:ml-2 ml-0"/>
                    <p className="lg:text-xl xl:text-2xl lg:block md:block hidden text-lg text-center xl:mt-8 lg:w-20 w-10 lg:ml-2 ml-7 pb-2 lg:mt-10 mt-3 text-bold-900">Wallet</p>
                </div>
                <h2 className="lg:text-2xl xl:text-5xl md:text-2xl text-lg mt-7 xl:mt-10 lg:mt-12 md:mt-10 text-bold-900 mr-3 md:mr-3 lg:mr-4">{profileData?.userData.wallet}</h2>
            </div>
            <div  className="bg-lightblue col-span-1 flex justify-between lg:row-start-3 xl:h-[150px] row-start-4 row-end-5 lg:row-end-4 w-full h-[150px] shadow-md rounded-xl">
                <div className="flex lg:flex-row flex-col h-full">
                    <TrophyIcon  className="text-red-500 xl:w-[100px] lg:w-[80px] md:w-[80px] w-[70px] mt-4 lg:ml-2 md:ml-2 ml-0"/>
                    <p className="lg:text-xl xl:text-2xl lg:block md:block hidden text-lg text-center xl:mt-8 lg:w-20 w-10 lg:ml-2 ml-7 pb-2 lg:mt-10 mt-3 text-bold-900">Rank</p>
                </div>
                <h2 className="lg:text-2xl xl:text-5xl md:text-2xl text-lg mt-7 xl:mt-10 lg:mt-12 md:mt-10 text-bold-900 mr-3 md:mr-3 lg:mr-4">{/*profileData?.userData.Rank*/}5</h2>
            </div>
            <div className="bg-lightblue col-span-1 lg:row-start-3 row-start-4 row-end-5 lg:row-end-4 w-full xl:h-[150px] h-[150px] shadow-md flex justify-between rounded-xl">
                <HandThumbUpIcon width={150} height={100} className="text-green-500 text-2xl xl:mt-5"/>
                <span className="center text-green-500 text-bold xl:mt-10 mt-5 lg:mr-20 mr-5 ml-2 lg:text-5xl text-3xl" >2</span>
            </div>
            <div  className="bg-lightblue col-span-1 lg:row-start-3 row-start-4 row-end-5 lg:row-end-4 w-full xl:h-[150px] h-[150px] shadow-md flex justify-between rounded-xl">
                <HandThumbDownIcon width={150} height={100} className="text-red-400 text-2xl xl:mt-5"/>
                <span className="center text-green-500 text-bold xl:mt-10 mt-5 lg:mr-20 mr-5 ml-2 lg:text-5xl text-3xl" >2</span>
            </div>
            <div className="bg-lightblue overflow-y-scroll overflow-y-auto styled-scrollbar xl:h-[500px] lg:col-span-2 col-span-4 lg:row-start-4 lg:row-end-5 row-start-5 row-end-6 w-full h-[500px] shadow-md rounded-xl">
                <div className="lg:w-[80%] xl:w-[90%] w-[98%] mt-5 h-full mx-auto">
                    {matchHistory.map((match) => {
                        return (
                        <div key={match.id} className="flex flex-col border border-[#69B02d] rounded-xl w-full mt-2 xl:mt-4">
                            <div className="flex flex-row justify-between">
                                <div className="flex flex-row m-3">
                                    <img src="/yo.jpg" alt="profilePic" className="rounded-full w-10 h-10 xl:w-15 xl:w-15 rounded-full" />
                                    <h2 className="text-bold m-1 lg:ml-5 md:ml-5 ml-1 lg:text-lg xl:text-2xl md:text-lg text-sm ">{match.winner.nickname}</h2>
                                </div>
                                <div className="flex flex-col m-0 ">
                                    <span className="text-bold text-center mt-2 xl:text-lg text-sm">{match.isMeWhoWon ? `won` : `lose`}</span>  
                                    <div className="flex flex-row justify-between border border-white rounded-xl xl:w-[100px] w-[50px] mb-2 h-[30px] xl:h-[40px] bg-signin text-white">
                                        <h2 className="text-bold ml-2 xl:mt-1 text-xl">{match.winnerScore}</h2>
                                        <h2 className="text-bold xl:mt-1 text-xl">:</h2>
                                        <h2 className="text-bold mr-2 xl:mt-1 text-xl">{match.loserScore}</h2>
                                    </div>
                                </div>
                                <div className="flex flex-row-reverse m-3"> 
                                    <img src="/yo1.jpg" alt="profilePic" className="rounded-full w-10 h-10 xl:w-15 xl:w-15 rounded-full" />
                                    <h2 className="text-bold m-2 lg:mr-5 md:mr-5 mr-1 lg:text-lg xl:text-2xl md:text-lg text-sm" >{match.loser.nickname}</h2>
                                </div>
                            </div>
                        </div>
                        )
                    })}
                </div>
            </div>
            <div className="bg-lightblue lg:col-span-2 col-span-4 lg:row-start-4 xl:h-[500px] lg:row-end-5 row-start-6 row-end-7 w-full h-[500px] shadow-md rounded-xl"> match history </div>
        </div>
    </main>
    );

}

export default withAuth (Profile);